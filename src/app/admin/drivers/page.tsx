import { getAllDrivers } from "@/lib/db/queries";
import { DriversPageClient } from "@/components/drivers/drivers-page-client";

export default function DriversPage() {
  return <DriversPageClient initialDrivers={getAllDrivers()} />;
}
