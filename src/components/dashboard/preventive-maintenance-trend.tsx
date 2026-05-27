"use client";

import { Line, LineChart, CartesianGrid, XAxis, YAxis, Legend } from "recharts";
import { Wrench } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { ChartShell } from "@/components/shared/chart-shell";

const chartConfig = {
  scheduled: { label: "Scheduled", color: "hsl(var(--chart-1))" },
  completed: { label: "Completed", color: "hsl(var(--chart-3))" },
} satisfies ChartConfig;

export function PreventiveMaintenanceTrend({
  data,
}: {
  data: { month: string; scheduled: number; completed: number }[];
}) {
  const totalCompleted = data.reduce((s, d) => s + d.completed, 0);

  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <Wrench className="h-4 w-4 text-primary" />
              Preventive Maintenance Trend
            </CardTitle>
            <CardDescription>
              Scheduled vs completed preventive services (vehicle_maintenance)
            </CardDescription>
          </div>
          <div className="rounded-lg bg-muted/60 px-3 py-1.5 text-center sm:text-right">
            <p className="text-xs text-muted-foreground">YTD completed</p>
            <p className="text-lg font-bold tabular-nums">{totalCompleted}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartShell className="h-[260px] w-full">
          <ChartContainer config={chartConfig} className="h-[260px] w-full">
            <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted/40" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis tickLine={false} axisLine={false} fontSize={12} allowDecimals={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line
                type="monotone"
                dataKey="scheduled"
                stroke="var(--color-scheduled)"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="completed"
                stroke="var(--color-completed)"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ChartContainer>
        </ChartShell>
      </CardContent>
    </Card>
  );
}
