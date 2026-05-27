import {
  getAllBookings,
  getAllCustomers,
  getAllVehicles,
} from "@/lib/db/queries";
import { drivers } from "@/lib/db/mock-data";
import { ReservationsPageClient } from "@/components/reservations/reservations-page-client";

export default function ReservationsPage() {
  return (
    <ReservationsPageClient
      bookings={getAllBookings()}
      customers={getAllCustomers()}
      vehicles={getAllVehicles()}
      driverList={drivers}
    />
  );
}
