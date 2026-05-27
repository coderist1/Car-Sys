"use client";

import Link from "next/link";
import { Download, Wrench } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { PageActionButton } from "@/components/shared/page-action-button";
import { MaintenanceStatCards } from "@/components/dashboard/maintenance-stat-cards";
import { PreventiveMaintenanceTrend } from "@/components/dashboard/preventive-maintenance-trend";
import { MaintenanceAlertsWidget } from "@/components/dashboard/maintenance-alerts";
import { MaintenancePredictionsTable } from "@/components/dashboard/maintenance-predictions-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { MaintenancePrediction, VehicleMaintenance } from "@/lib/db/types";
import type { MaintenanceDashboardStats } from "@/lib/db/types";

export function PreventiveMaintenancePageClient({
  stats,
  trend,
  alerts,
  predictions,
}: {
  stats: MaintenanceDashboardStats;
  trend: { month: string; scheduled: number; completed: number }[];
  alerts: VehicleMaintenance[];
  predictions: MaintenancePrediction[];
}) {
  const byRisk = {
    high: predictions.filter((p) => p.risk === "high"),
    medium: predictions.filter((p) => p.risk === "medium"),
    low: predictions.filter((p) => p.risk === "low"),
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Preventive Maintenance"
        description="Predictive maintenance insights, scheduled services, and fleet health alerts."
      >
        <PageActionButton actionVariant="outline">
          <Download className="h-4 w-4 shrink-0" />
          <span className="truncate">Export report</span>
        </PageActionButton>
        <PageActionButton asChild>
          <Link href="/admin/maintenance">
            <Wrench className="h-4 w-4 shrink-0" />
            <span className="truncate">Manage records</span>
          </Link>
        </PageActionButton>
      </PageHeader>

      <MaintenanceStatCards stats={stats} />

      <div className="grid gap-4 sm:grid-cols-3">
        {(["high", "medium", "low"] as const).map((risk) => (
          <Card key={risk} className="border-border/60 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium capitalize text-muted-foreground">
                {risk} risk
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <span className="text-3xl font-bold tabular-nums">{byRisk[risk].length}</span>
              <Badge
                variant="outline"
                className={
                  risk === "high"
                    ? "border-red-200 text-red-700"
                    : risk === "medium"
                      ? "border-amber-200 text-amber-700"
                      : "border-emerald-200 text-emerald-700"
                }
              >
                vehicles
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      <PreventiveMaintenanceTrend data={trend} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <MaintenancePredictionsTable predictions={predictions} />
        </div>
        <MaintenanceAlertsWidget alerts={alerts} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {byRisk.high.map((p) => (
          <Card key={p.prediction_id} className="border-red-200/60 bg-red-500/5">
            <CardContent className="p-4 space-y-1">
              <p className="font-semibold text-sm">
                {p.brand} {p.model} · {p.plateNumber}
              </p>
              <p className="text-sm text-muted-foreground">{p.predicted_service}</p>
              <p className="text-xs text-red-700 font-medium">
                Due in {p.due_in_days} days · {p.confidence}% confidence
              </p>
              {p.notes && <p className="text-xs text-muted-foreground pt-1">{p.notes}</p>}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
