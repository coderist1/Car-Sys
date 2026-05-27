import { getAllMaintenance, getAllVehicles } from "@/lib/db/queries";
import { MaintenancePageClient } from "@/components/maintenance/maintenance-page-client";

export default function MaintenancePage() {
  return (
    <MaintenancePageClient
      initialRecords={getAllMaintenance()}
      vehicles={getAllVehicles()}
    />
  );
}
