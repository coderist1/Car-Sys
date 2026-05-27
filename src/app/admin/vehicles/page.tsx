import { getAllVehicles } from "@/lib/db/queries";
import { VehiclesPageClient } from "@/components/vehicles/vehicles-page-client";

export default function VehiclesPage() {
  const vehicles = getAllVehicles();
  return <VehiclesPageClient initialVehicles={vehicles} />;
}
