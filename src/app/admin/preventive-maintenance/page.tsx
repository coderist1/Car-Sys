import { PreventiveMaintenancePageClient } from "@/components/preventive-maintenance/preventive-maintenance-page-client";
import {
  getMaintenanceAlerts,
  getMaintenanceDashboardStats,
  getMaintenancePredictions,
  getPreventiveMaintenanceTrend,
} from "@/lib/db/queries";

export default function PreventiveMaintenancePage() {
  return (
    <PreventiveMaintenancePageClient
      stats={getMaintenanceDashboardStats()}
      trend={getPreventiveMaintenanceTrend()}
      alerts={getMaintenanceAlerts()}
      predictions={getMaintenancePredictions()}
    />
  );
}
