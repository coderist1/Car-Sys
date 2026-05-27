"use client";

import { Download, FileText } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { formatNumber } from "@/lib/format-number";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type PaymentRow = ReturnType<typeof import("@/lib/db/queries").getAllPayments>[0];
type FuelRow = ReturnType<typeof import("@/lib/db/queries").getAllFuelRecords>[0];

export function RecordsPageClient({
  payments,
  fuelRecords,
  auditLogs,
}: {
  payments: PaymentRow[];
  fuelRecords: FuelRow[];
  auditLogs: { id: number; action: string; user: string; timestamp: string }[];
}) {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Records"
        description="Financial, fuel, and rental logs across payment, booking, and fuel_record tables."
      >
        <Button variant="outline" size="sm" className="gap-2">
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
        <Button variant="outline" size="sm" className="gap-2">
          <FileText className="h-4 w-4" />
          Export PDF
        </Button>
      </PageHeader>

      <Tabs defaultValue="financial">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="fuel">Fuel Records</TabsTrigger>
          <TabsTrigger value="rental">Rental Logs</TabsTrigger>
          <TabsTrigger value="audit">Audit Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="financial" className="mt-4">
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>payment → booking relationship</CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto p-0 pb-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Payment ID</TableHead>
                    <TableHead>Booking</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ref</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((p) => (
                    <TableRow key={p.payment_id}>
                      <TableCell className="font-mono text-xs">#{p.payment_id}</TableCell>
                      <TableCell>#{p.booking_id}</TableCell>
                      <TableCell>{p.customer?.customerFullName ?? "—"}</TableCell>
                      <TableCell className="font-medium">${p.amount}</TableCell>
                      <TableCell className="capitalize">{p.payment_method}</TableCell>
                      <TableCell>{p.payment_date}</TableCell>
                      <TableCell>
                        <StatusBadge type="payment" status={p.status} />
                      </TableCell>
                      <TableCell className="font-mono text-xs">{p.transaction_ref}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fuel" className="mt-4">
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle>Fuel Consumption</CardTitle>
              <CardDescription>fuel_record → vehicle (optional booking)</CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto p-0 pb-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Booking</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Liters</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead>Odometer</TableHead>
                    <TableHead>Station</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fuelRecords.map((f) => (
                    <TableRow key={f.fuel_id}>
                      <TableCell className="font-mono text-xs">#{f.fuel_id}</TableCell>
                      <TableCell>{f.vehicle?.plateNumber}</TableCell>
                      <TableCell>{f.booking_id ? `#${f.booking_id}` : "—"}</TableCell>
                      <TableCell>{f.fuel_date}</TableCell>
                      <TableCell>{f.liters} L</TableCell>
                      <TableCell>${f.cost.toFixed(2)}</TableCell>
                      <TableCell>{formatNumber(f.odometer)}</TableCell>
                      <TableCell>{f.station}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rental" className="mt-4">
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle>Rental Logs & Damage Reports</CardTitle>
              <CardDescription>Aggregated booking completion records</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { id: "DR-001", booking: 1004, note: "Minor scratch — rear bumper", severity: "Low" },
                  { id: "DR-002", booking: 1006, note: "Interior stain — resolved", severity: "Resolved" },
                ].map((d) => (
                  <div key={d.id} className="flex justify-between rounded-lg border p-3 text-sm">
                    <div>
                      <p className="font-medium">{d.id} · Booking #{d.booking}</p>
                      <p className="text-muted-foreground text-xs">{d.note}</p>
                    </div>
                    <span className="text-xs font-medium text-amber-600">{d.severity}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="mt-4">
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle>Audit Logs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {auditLogs.map((log) => (
                <div
                  key={log.id}
                  className="flex flex-col sm:flex-row sm:justify-between gap-1 rounded-lg border p-3 text-sm"
                >
                  <span>{log.action}</span>
                  <span className="text-xs text-muted-foreground">
                    {log.user} · {log.timestamp}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
