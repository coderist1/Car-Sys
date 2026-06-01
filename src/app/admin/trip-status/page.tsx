import { getAllFuelRecords } from "@/lib/db/queries";
import { TripStatusPageClient } from "@/components/admin/trip-status-page-client";

export default function TripStatusPage() {
  return <TripStatusPageClient fuelRecords={getAllFuelRecords()} />;
}
