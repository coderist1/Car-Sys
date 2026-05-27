import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDateOnly } from "@/lib/format-date";
import { formatNumber } from "@/lib/format-number";
import type { MaintenancePrediction } from "@/lib/db/types";
import { cn } from "@/lib/utils";

const riskStyles = {
  high: "bg-red-500/10 text-red-700 border-0",
  medium: "bg-amber-500/10 text-amber-700 border-0",
  low: "bg-emerald-500/10 text-emerald-700 border-0",
};

export function MaintenancePredictionsTable({
  predictions,
  showViewAll = false,
}: {
  predictions: MaintenancePrediction[];
  showViewAll?: boolean;
}) {
  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <Sparkles className="h-4 w-4 text-primary" />
            Maintenance Predictions
          </CardTitle>
          <CardDescription>
            AI-assisted preventive insights by vehicle (mileage, wear, and service history)
          </CardDescription>
        </div>
        {showViewAll && (
          <Button variant="outline" size="sm" className="shrink-0" asChild>
            <Link href="/admin/preventive-maintenance">View all predictions</Link>
          </Button>
        )}
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vehicle</TableHead>
              <TableHead>Predicted service</TableHead>
              <TableHead>Risk</TableHead>
              <TableHead className="hidden md:table-cell">Due</TableHead>
              <TableHead className="hidden lg:table-cell">Recommended</TableHead>
              <TableHead className="text-right">Confidence</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {predictions.map((p) => (
              <TableRow key={p.prediction_id}>
                <TableCell>
                  <p className="font-medium text-sm">
                    {p.brand} {p.model}
                  </p>
                  <p className="text-xs text-muted-foreground font-mono">{p.plateNumber}</p>
                </TableCell>
                <TableCell>
                  <p className="text-sm">{p.predicted_service}</p>
                  <p className="text-xs text-muted-foreground hidden sm:block">
                    {formatNumber(p.mileage)} mi
                  </p>
                </TableCell>
                <TableCell>
                  <Badge className={cn("capitalize text-xs", riskStyles[p.risk])}>{p.risk}</Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell text-sm">
                  {p.due_in_days} days
                </TableCell>
                <TableCell className="hidden lg:table-cell text-sm">
                  {formatDateOnly(p.recommended_date, "MMM d, yyyy")}
                </TableCell>
                <TableCell className="text-right text-sm font-medium tabular-nums">
                  {p.confidence}%
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
