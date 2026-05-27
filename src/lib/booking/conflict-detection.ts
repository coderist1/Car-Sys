import { parseDateOnly } from "@/lib/format-date";
import type { Booking, BookingStatus } from "@/lib/db/types";

export type BookingConflictType = "vehicle" | "driver" | "customer" | "invalid_dates";

export type BookingConflict = {
  type: BookingConflictType;
  message: string;
  conflictingBookingId: number;
  resourceLabel: string;
};

export type BookingDraft = {
  vehicle_id: number;
  customer_user_id: number;
  driver_id?: number;
  pickup_date: string;
  return_date: string;
  status: BookingStatus;
  booking_id?: number;
};

const BLOCKING_STATUSES: BookingStatus[] = ["pending", "confirmed", "active"];

export function isBlockingBookingStatus(status: BookingStatus): boolean {
  return BLOCKING_STATUSES.includes(status);
}

/** Inclusive date-range overlap (yyyy-MM-dd). */
export function dateRangesOverlap(
  pickupA: string,
  returnA: string,
  pickupB: string,
  returnB: string
): boolean {
  const aStart = parseDateOnly(pickupA).getTime();
  const aEnd = parseDateOnly(returnA).getTime();
  const bStart = parseDateOnly(pickupB).getTime();
  const bEnd = parseDateOnly(returnB).getTime();
  return aStart <= bEnd && bStart <= aEnd;
}

export function validateDateRange(pickup: string, returnDate: string): string | null {
  if (!pickup || !returnDate) {
    return "Pickup and return dates are required.";
  }
  const start = parseDateOnly(pickup).getTime();
  const end = parseDateOnly(returnDate).getTime();
  if (start > end) {
    return "Return date must be on or after the pickup date.";
  }
  return null;
}

export function findBookingConflicts(
  existing: Booking[],
  draft: BookingDraft
): BookingConflict[] {
  const dateError = validateDateRange(draft.pickup_date, draft.return_date);
  if (dateError) {
    return [
      {
        type: "invalid_dates",
        message: dateError,
        conflictingBookingId: 0,
        resourceLabel: "Dates",
      },
    ];
  }

  const conflicts: BookingConflict[] = [];
  const active = existing.filter(
    (b) =>
      isBlockingBookingStatus(b.status) &&
      b.booking_id !== draft.booking_id
  );

  for (const b of active) {
    if (!dateRangesOverlap(draft.pickup_date, draft.return_date, b.pickup_date, b.return_date)) {
      continue;
    }

    if (b.vehicle_id === draft.vehicle_id) {
      conflicts.push({
        type: "vehicle",
        message: `This vehicle is already reserved (#${b.booking_id}) from ${b.pickup_date} to ${b.return_date}. Choose different dates or another vehicle.`,
        conflictingBookingId: b.booking_id,
        resourceLabel: `Vehicle #${draft.vehicle_id}`,
      });
    }

    if (
      draft.driver_id &&
      b.driver_id === draft.driver_id
    ) {
      conflicts.push({
        type: "driver",
        message: `This driver is assigned to booking #${b.booking_id} for overlapping dates (${b.pickup_date} – ${b.return_date}).`,
        conflictingBookingId: b.booking_id,
        resourceLabel: `Driver #${draft.driver_id}`,
      });
    }

    if (b.customer_user_id === draft.customer_user_id) {
      conflicts.push({
        type: "customer",
        message: `This customer already has booking #${b.booking_id} overlapping these dates.`,
        conflictingBookingId: b.booking_id,
        resourceLabel: `Customer #${draft.customer_user_id}`,
      });
    }
  }

  return conflicts;
}

export function isVehicleAvailableForRange(
  existing: Booking[],
  vehicleId: number,
  pickup: string,
  returnDate: string,
  excludeBookingId?: number
): boolean {
  const dateError = validateDateRange(pickup, returnDate);
  if (dateError) return false;

  return !findBookingConflicts(existing, {
    vehicle_id: vehicleId,
    customer_user_id: -1,
    pickup_date: pickup,
    return_date: returnDate,
    status: "pending",
    booking_id: excludeBookingId,
  }).some((c) => c.type === "vehicle");
}
