import {
  appendBooking,
  createPayment,
  deleteBooking as removeBookingFromStore,
  getBookingsSnapshot,
  getPayments,
  patchBooking,
  setBookingsSnapshot,
  subscribeDataStore,
  updatePayment,
  updateVehicle,
} from "@/lib/db/data-store";
import type { Booking, PaymentMethod } from "@/lib/db/types";
import {
  findBookingConflicts,
  isBlockingBookingStatus,
  type BookingConflict,
  type BookingDraft,
} from "@/lib/booking/conflict-detection";

export type CreateBookingInput = Omit<BookingDraft, "booking_id"> & {
  total_amount: number;
  payment_method?: PaymentMethod;
};

function syncVehicleAvailability(vehicleId: number): void {
  const hasActiveBooking = getBookingsSnapshot().some(
    (b) => b.vehicle_id === vehicleId && isBlockingBookingStatus(b.status)
  );
  updateVehicle(vehicleId, {
    status: hasActiveBooking ? "reserved" : "available",
  });
}

export type CreateBookingResult =
  | { success: true; booking: Booking }
  | { success: false; conflicts: BookingConflict[]; message: string };

export type BookingActionResult =
  | { success: true; booking: Booking }
  | { success: false; message: string };

function refundBookingPayment(bookingId: number): void {
  const payment = getPayments().find((p) => p.booking_id === bookingId);
  if (payment && payment.status !== "refunded") {
    updatePayment(payment.payment_id, { status: "refunded" });
  }
}

function captureBookingPayment(bookingId: number): void {
  const payment = getPayments().find((p) => p.booking_id === bookingId);
  if (payment && payment.status === "pending") {
    updatePayment(payment.payment_id, {
      status: "paid",
      payment_date: new Date().toISOString().slice(0, 10),
    });
  }
}

type Listener = () => void;

const listeners = new Set<Listener>();

subscribeDataStore(() => emit());

function getSnapshot(): Booking[] {
  return getBookingsSnapshot();
}
const lockTail = new Map<string, Promise<void>>();

function emit() {
  listeners.forEach((l) => l());
}

function nextBookingId(): number {
  const snapshot = getSnapshot();
  return Math.max(0, ...snapshot.map((b) => b.booking_id)) + 1;
}

async function withSingleLock<T>(key: string, fn: () => Promise<T>): Promise<T> {
  const prev = lockTail.get(key) ?? Promise.resolve();
  let release!: () => void;
  const next = new Promise<void>((resolve) => {
    release = resolve;
  });
  lockTail.set(key, prev.then(() => next));
  await prev;
  try {
    return await fn();
  } finally {
    release();
  }
}

/** Serialize concurrent attempts per resource (vehicle, driver, customer). */
async function withBookingLocks<T>(
  keys: string[],
  fn: () => Promise<T>
): Promise<T> {
  const unique = [...new Set(keys)].sort();
  const run = async (index: number): Promise<T> => {
    if (index >= unique.length) return fn();
    return withSingleLock(unique[index], () => run(index + 1));
  };
  return run(0);
}

export function getBookingSnapshot(): Booking[] {
  return getBookingsSnapshot();
}

export function subscribeBookings(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function resetBookings(bookings: Booking[]): void {
  setBookingsSnapshot(bookings);
  emit();
}

/** Live validation without mutating state. */
export function checkBookingAvailability(draft: BookingDraft): BookingConflict[] {
  return findBookingConflicts(getSnapshot(), draft);
}

export async function tryCreateBooking(
  input: CreateBookingInput
): Promise<CreateBookingResult> {
  const lockKeys = [
    `vehicle:${input.vehicle_id}`,
    `customer:${input.customer_user_id}`,
    ...(input.driver_id ? [`driver:${input.driver_id}`] : []),
  ];

  return withBookingLocks(lockKeys, async () => {
    if (input.customer_user_id <= 0) {
      return {
        success: false,
        conflicts: [],
        message: "Sign in to complete your booking.",
      };
    }

    const conflicts = findBookingConflicts(getSnapshot(), input);
    if (conflicts.length > 0) {
      const primary = conflicts[0];
      return {
        success: false,
        conflicts,
        message:
          conflicts.length === 1
            ? primary.message
            : `${conflicts.length} scheduling conflicts detected. ${primary.message}`,
      };
    }

    const booking: Booking = {
      booking_id: nextBookingId(),
      customer_user_id: input.customer_user_id,
      vehicle_id: input.vehicle_id,
      driver_id: input.driver_id,
      pickup_date: input.pickup_date,
      return_date: input.return_date,
      status: input.status,
      total_amount: input.total_amount,
    };

    appendBooking(booking);

    const paymentCaptured =
      input.status === "confirmed" || input.status === "active";
    createPayment({
      booking_id: booking.booking_id,
      amount: input.total_amount,
      payment_date: new Date().toISOString().slice(0, 10),
      payment_method: input.payment_method ?? "card",
      status: paymentCaptured ? "paid" : "pending",
      transaction_ref: `TXN-${booking.booking_id}`,
    });

    syncVehicleAvailability(input.vehicle_id);
    emit();

    return { success: true, booking };
  });
}

export function cancelBooking(bookingId: number): boolean {
  const booking = getSnapshot().find((b) => b.booking_id === bookingId);
  if (!booking || booking.status === "cancelled" || booking.status === "completed") {
    return false;
  }
  const ok = patchBooking(bookingId, { status: "cancelled" });
  if (ok) {
    refundBookingPayment(bookingId);
    syncVehicleAvailability(booking.vehicle_id);
    emit();
  }
  return ok;
}

/** Admin: approve a customer booking request. */
export function acceptBooking(bookingId: number): BookingActionResult {
  const booking = getSnapshot().find((b) => b.booking_id === bookingId);
  if (!booking) {
    return { success: false, message: "Booking not found." };
  }
  if (booking.status !== "pending") {
    return {
      success: false,
      message: `Only pending bookings can be accepted (current status: ${booking.status}).`,
    };
  }

  const conflicts = findBookingConflicts(getSnapshot(), {
    ...booking,
    status: "confirmed",
    booking_id: bookingId,
  });
  if (conflicts.length > 0) {
    return { success: false, message: conflicts[0].message };
  }

  const ok = patchBooking(bookingId, { status: "confirmed" });
  if (!ok) {
    return { success: false, message: "Could not update booking." };
  }

  captureBookingPayment(bookingId);
  syncVehicleAvailability(booking.vehicle_id);
  emit();

  const updated = getSnapshot().find((b) => b.booking_id === bookingId);
  return updated
    ? { success: true, booking: updated }
    : { success: false, message: "Booking not found after update." };
}

/** Admin: decline a pending booking request. */
export function rejectBooking(bookingId: number, reason?: string): BookingActionResult {
  const booking = getSnapshot().find((b) => b.booking_id === bookingId);
  if (!booking) {
    return { success: false, message: "Booking not found." };
  }
  if (booking.status !== "pending") {
    return {
      success: false,
      message: `Only pending bookings can be rejected (current status: ${booking.status}).`,
    };
  }

  const ok = patchBooking(bookingId, {
    status: "cancelled",
    ...(reason?.trim() ? { notes: reason.trim() } : {}),
  });
  if (!ok) {
    return { success: false, message: "Could not update booking." };
  }

  refundBookingPayment(bookingId);
  syncVehicleAvailability(booking.vehicle_id);
  emit();

  const updated = getSnapshot().find((b) => b.booking_id === bookingId);
  return updated
    ? { success: true, booking: updated }
    : { success: false, message: "Booking not found after update." };
}

export function updateBookingStatus(
  bookingId: number,
  status: Booking["status"]
): boolean {
  const booking = getSnapshot().find((b) => b.booking_id === bookingId);
  const ok = patchBooking(bookingId, { status });
  if (ok) {
    if (status === "cancelled") {
      refundBookingPayment(bookingId);
    }
    if (booking) syncVehicleAvailability(booking.vehicle_id);
    emit();
  }
  return ok;
}

export function updateBooking(bookingId: number, patch: Partial<Booking>): boolean {
  const ok = patchBooking(bookingId, patch);
  if (ok) emit();
  return ok;
}

/** Admin: remove a reservation */
export function deleteBooking(bookingId: number): boolean {
  const booking = getSnapshot().find((b) => b.booking_id === bookingId);
  const ok = removeBookingFromStore(bookingId);
  if (ok) {
    if (booking) syncVehicleAvailability(booking.vehicle_id);
    emit();
  }
  return ok;
}
