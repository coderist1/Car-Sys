import { AlertTriangle, CalendarClock, CheckCircle, Wrench } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { MaintenanceDashboardStats } from "@/lib/db/types";

const cards = [
  {
    key: "highRiskVehicles" as const,
    label: "High-Risk Vehicles",
    icon: AlertTriangle,
    format: (v: number) => v.toString(),
    trend: "Predictive alerts",
  },
  {
    key: "pendingServices" as const,
    label: "Pending Services",
    icon: Wrench,
    format: (v: number) => v.toString(),
    trend: "Active work orders",
  },
  {
    key: "scheduledThisMonth" as const,
    label: "Scheduled This Month",
    icon: CalendarClock,
    format: (v: number) => v.toString(),
    trend: "Preventive pipeline",
  },
  {
    key: "completedYtd" as const,
    label: "Completed YTD",
    icon: CheckCircle,
    format: (v: number) => v.toString(),
    trend: "Preventive services done",
  },
];

export function MaintenanceStatCards({ stats }: { stats: MaintenanceDashboardStats }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <Card
          key={card.key}
          className="relative overflow-hidden border-border/60 shadow-sm transition-shadow hover:shadow-md"
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.label}
            </CardTitle>
            <div className="rounded-lg bg-primary/5 p-2">
              <card.icon className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight">{card.format(stats[card.key])}</div>
            <p className="mt-1 text-xs text-muted-foreground">{card.trend}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
