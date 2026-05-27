"use client";

import { useEffect, useMemo, useState } from "react";
import { bookings as seedBookings } from "@/lib/db/mock-data";
import {
  checkBookingAvailability,
  getBookingSnapshot,
  subscribeBookings,
} from "@/lib/booking/booking-registry";
import type { BookingDraft } from "@/lib/booking/conflict-detection";

/** Client-only store subscription — avoids useSyncExternalStore SSR mismatches. */
export function useBookingSnapshot() {
  const [bookings, setBookings] = useState(seedBookings);

  useEffect(() => {
    setBookings(getBookingSnapshot());
    return subscribeBookings(() => {
      setBookings(getBookingSnapshot());
    });
  }, []);

  return bookings;
}

export function useBookingConflicts(draft: BookingDraft | null) {
  const bookings = useBookingSnapshot();

  return useMemo(() => {
    if (!draft?.pickup_date || !draft?.return_date || !draft.vehicle_id) {
      return { conflicts: [], hasConflict: false, bookings };
    }
    const conflicts = checkBookingAvailability(draft);
    return { conflicts, hasConflict: conflicts.length > 0, bookings };
  }, [draft, bookings]);
}
