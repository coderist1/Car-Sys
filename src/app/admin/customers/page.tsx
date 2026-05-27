import { getAllCustomers, getCustomerRentalHistory } from "@/lib/db/queries";
import { CustomersPageClient } from "@/components/customers/customers-page-client";
import type { BookingWithRelations } from "@/lib/db/types";

export default function CustomersPage() {
  const customers = getAllCustomers();
  const rentalHistory: Record<number, BookingWithRelations[]> = {};
  for (const c of customers) {
    rentalHistory[c.user_id] = getCustomerRentalHistory(c.user_id);
  }
  return (
    <CustomersPageClient customers={customers} rentalHistory={rentalHistory} />
  );
}
