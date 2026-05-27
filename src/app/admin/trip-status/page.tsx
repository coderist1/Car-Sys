import { getAllBookings, getAllFuelRecords } from "@/lib/db/queries";
import { TripStatusPageClient } from "@/components/admin/trip-status-page-client";

export default function TripStatusPage() {
  return (
    <TripStatusPageClient
      bookings={getAllBookings()}
      fuelRecords={getAllFuelRecords()}
    />
  );
}
