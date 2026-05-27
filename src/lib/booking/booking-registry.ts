import { bookings as seedBookings } from "@/lib/db/mock-data";
import type { Booking } from "@/lib/db/types";
import {
  findBookingConflicts,
  type BookingConflict,
  type BookingDraft,
} from "@/lib/booking/conflict-detection";

export type CreateBookingInput = Omit<BookingDraft, "booking_id"> & {
  total_amount: number;
};

export type CreateBookingResult =
  | { success: true; booking: Booking }
  | { success: false; conflicts: BookingConflict[]; message: string };

type Listener = () => void;

let snapshot: Booking[] = [...seedBookings];
const listeners = new Set<Listener>();
const lockTail = new Map<string, Promise<void>>();

function emit() {
  listeners.forEach((l) => l());
}

function nextBookingId(): number {
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
  return [...snapshot];
}

export function subscribeBookings(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function resetBookings(bookings: Booking[]): void {
  snapshot = [...bookings];
  emit();
}

/** Live validation without mutating state. */
export function checkBookingAvailability(draft: BookingDraft): BookingConflict[] {
  return findBookingConflicts(snapshot, draft);
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
    const conflicts = findBookingConflicts(snapshot, input);
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

    snapshot = [...snapshot, booking];
    emit();

    return { success: true, booking };
  });
}

export function cancelBooking(bookingId: number): boolean {
  const booking = snapshot.find((b) => b.booking_id === bookingId);
  if (!booking || booking.status === "cancelled" || booking.status === "completed") {
    return false;
  }
  snapshot = snapshot.map((b) =>
    b.booking_id === bookingId ? { ...b, status: "cancelled" as const } : b
  );
  emit();
  return true;
}

export function updateBookingStatus(
  bookingId: number,
  status: Booking["status"]
): boolean {
  const idx = snapshot.findIndex((b) => b.booking_id === bookingId);
  if (idx === -1) return false;
  snapshot = snapshot.map((b) => (b.booking_id === bookingId ? { ...b, status } : b));
  emit();
  return true;
}
