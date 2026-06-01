import { AlertTriangle, Wrench } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/status-badge";
import type { VehicleMaintenance } from "@/lib/db/types";
import { getVehicles } from "@/lib/db/data-store";
import { formatDateOnly } from "@/lib/format-date";
import { formatNumber } from "@/lib/format-number";

export function MaintenanceAlertsWidget({
  alerts,
}: {
  alerts: VehicleMaintenance[];
}) {
  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            Maintenance Alerts
          </CardTitle>
          <CardDescription>Upcoming and in-progress service records</CardDescription>
        </div>
        <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-400">
          {alerts.length} active
        </span>
      </CardHeader>
      <CardContent className="space-y-3">
        {alerts.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">All vehicles serviced</p>
        ) : (
          alerts.map((alert) => {
            const vehicle = getVehicles().find((v) => v.vehicle_id === alert.vehicle_id);
            return (
              <div
                key={alert.maintenance_id}
                className="flex items-start gap-3 rounded-lg border border-border/60 p-3 transition-colors hover:bg-muted/30"
              >
                <div className="rounded-md bg-muted p-2">
                  <Wrench className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-medium truncate">
                      {vehicle?.brand} {vehicle?.model} · {vehicle?.plateNumber}
                    </p>
                    <StatusBadge type="maintenance" status={alert.status} />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {alert.service_type} · {alert.assigned_mechanic}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDateOnly(alert.service_date, "MMM d, yyyy")} · $
                    {formatNumber(alert.cost)}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
