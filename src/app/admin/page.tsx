import Link from "next/link";
import { Sparkles } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { MaintenanceStatCards } from "@/components/dashboard/maintenance-stat-cards";
import { PreventiveMaintenanceTrend } from "@/components/dashboard/preventive-maintenance-trend";
import { MaintenanceAlertsWidget } from "@/components/dashboard/maintenance-alerts";
import { MaintenancePredictionsTable } from "@/components/dashboard/maintenance-predictions-table";
import {
  getMaintenanceAlerts,
  getMaintenanceDashboardStats,
  getMaintenancePredictions,
  getPreventiveMaintenanceTrend,
} from "@/lib/db/queries";
import { PageActionButton } from "@/components/shared/page-action-button";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const stats = getMaintenanceDashboardStats();
  const alerts = getMaintenanceAlerts();
  const maintenanceTrend = getPreventiveMaintenanceTrend();
  const predictions = getMaintenancePredictions().slice(0, 5);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        description="Fleet preventive maintenance overview — predictions, alerts, and service trends."
      >
        <PageActionButton asChild>
          <Link href="/admin/preventive-maintenance">
            <Sparkles className="h-4 w-4 shrink-0" />
            <span className="truncate">Preventive Maintenance</span>
          </Link>
        </PageActionButton>
      </PageHeader>

      <MaintenanceStatCards stats={stats} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <PreventiveMaintenanceTrend data={maintenanceTrend} />
        </div>
        <MaintenanceAlertsWidget alerts={alerts} />
      </div>

      <MaintenancePredictionsTable predictions={predictions} showViewAll />

      <div className="flex justify-center">
        <Button variant="outline" asChild>
          <Link href="/admin/preventive-maintenance">Open full predictive insights</Link>
        </Button>
      </div>
    </div>
  );
}
