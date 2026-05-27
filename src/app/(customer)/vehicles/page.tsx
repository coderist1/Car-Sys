import { VehicleListing } from "@/components/customer/vehicle-listing";
import { getCustomerVehicles } from "@/lib/customer-vehicles";

export default function VehiclesPage() {
  return <VehicleListing vehicles={getCustomerVehicles()} />;
}
