import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getDashboardStats, getPreventiveMaintenanceTrend } from "@/lib/db/queries";
import { Download, FileBarChart } from "lucide-react";

export default function ReportsPage() {
  const stats = getDashboardStats();
  const trend = getPreventiveMaintenanceTrend();

  return (
    <div className="space-y-8">
      <PageHeader
        title="Generate Reports"
        description="UML use case: fleet utilization, revenue, and maintenance summaries."
      >
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export PDF
        </Button>
      </PageHeader>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <FileBarChart className="h-4 w-4" />
              Fleet utilization
            </CardTitle>
            <CardDescription>Active vs available vehicles</CardDescription>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {stats.availableVehicles} / {stats.totalVehicles} available
          </CardContent>
        </Card>
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="text-base">Revenue (paid)</CardTitle>
            <CardDescription>payment table aggregate</CardDescription>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            ${stats.revenue.toLocaleString()}
          </CardContent>
        </Card>
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="text-base">Maintenance completed YTD</CardTitle>
            <CardDescription>vehicle_maintenance trend</CardDescription>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {trend.reduce((s, m) => s + m.completed, 0)}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
