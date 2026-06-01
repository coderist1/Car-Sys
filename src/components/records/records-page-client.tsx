"use client";

import { useMemo, useState } from "react";
import { Download, FileText, Plus, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { PageActionButton } from "@/components/shared/page-action-button";
import { formatNumber } from "@/lib/format-number";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDataStoreVersion } from "@/hooks/use-data-store";
import {
  createFuelRecord,
  createPayment,
  deleteFuelRecord,
  deletePayment,
  getBookingsSnapshot,
  getCustomers,
  getFuelRecords,
  getPayments,
  getVehicles,
  updatePayment,
} from "@/lib/db/data-store";
import type { PaymentMethod, PaymentStatus } from "@/lib/db/types";

export function RecordsPageClient({
  auditLogs,
}: {
  payments: unknown[];
  fuelRecords: unknown[];
  auditLogs: { id: number; action: string; user: string; timestamp: string }[];
}) {
  const version = useDataStoreVersion();
  const customers = useMemo(() => getCustomers(), [version]);
  const bookings = useMemo(() => getBookingsSnapshot(), [version]);
  const vehicles = useMemo(() => getVehicles(), [version]);

  const payments = useMemo(
    () =>
      getPayments().map((p) => ({
        ...p,
        customer: customers.find(
          (c) =>
            c.user_id ===
            bookings.find((b) => b.booking_id === p.booking_id)?.customer_user_id
        ),
      })),
    [version, customers, bookings]
  );

  const fuelRecords = useMemo(
    () =>
      getFuelRecords().map((f) => ({
        ...f,
        vehicle: vehicles.find((v) => v.vehicle_id === f.vehicle_id),
      })),
    [version, vehicles]
  );

  const [paymentOpen, setPaymentOpen] = useState(false);
  const [fuelOpen, setFuelOpen] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    booking_id: "",
    amount: 0,
    payment_method: "card" as PaymentMethod,
    status: "paid" as PaymentStatus,
    payment_date: new Date().toISOString().slice(0, 10),
    transaction_ref: "",
  });
  const [fuelForm, setFuelForm] = useState({
    vehicle_id: "",
    booking_id: "",
    fuel_date: new Date().toISOString().slice(0, 10),
    liters: 0,
    cost: 0,
    odometer: 0,
    station: "",
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Records"
        description="Process payments, record fuel, and view transaction history."
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

        <TabsContent value="financial" className="mt-4 space-y-4">
          <PageActionButton type="button" onClick={() => setPaymentOpen(true)}>
            <Plus className="h-4 w-4" />
            Process Payment
          </PageActionButton>
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
                    <TableHead className="text-right">Actions</TableHead>
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
                      <TableCell className="text-right space-x-1">
                        <Select
                          value={p.status}
                          onValueChange={(v) =>
                            updatePayment(p.payment_id, { status: v as PaymentStatus })
                          }
                        >
                          <SelectTrigger className="h-8 w-[100px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="paid">Paid</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="partial">Partial</SelectItem>
                            <SelectItem value="failed">Failed</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => deletePayment(p.payment_id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fuel" className="mt-4 space-y-4">
          <PageActionButton type="button" onClick={() => setFuelOpen(true)}>
            <Plus className="h-4 w-4" />
            Record Fuel
          </PageActionButton>
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
                    <TableHead>Station</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
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
                      <TableCell>{f.station}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => deleteFuelRecord(f.fuel_id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
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
              <CardTitle>Rental Logs</CardTitle>
              <CardDescription>Completed bookings from the store</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {bookings
                  .filter((b) => b.status === "completed")
                  .map((b) => (
                    <div
                      key={b.booking_id}
                      className="flex justify-between rounded-lg border p-3 text-sm"
                    >
                      <div>
                        <p className="font-medium">Booking #{b.booking_id}</p>
                        <p className="text-muted-foreground text-xs">
                          {vehicles.find((v) => v.vehicle_id === b.vehicle_id)?.plateNumber} · $
                          {b.total_amount}
                        </p>
                      </div>
                      <StatusBadge type="booking" status={b.status} />
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

      <Dialog open={paymentOpen} onOpenChange={setPaymentOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Process Payment</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="space-y-2">
              <Label>Booking</Label>
              <Select
                value={paymentForm.booking_id}
                onValueChange={(v) => setPaymentForm({ ...paymentForm, booking_id: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select booking" />
                </SelectTrigger>
                <SelectContent>
                  {bookings.map((b) => (
                    <SelectItem key={b.booking_id} value={String(b.booking_id)}>
                      #{b.booking_id} · ${b.total_amount}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Amount</Label>
              <Input
                type="number"
                value={paymentForm.amount}
                onChange={(e) =>
                  setPaymentForm({ ...paymentForm, amount: +e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Method</Label>
              <Select
                value={paymentForm.payment_method}
                onValueChange={(v) =>
                  setPaymentForm({ ...paymentForm, payment_method: v as PaymentMethod })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="card">Card</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  <SelectItem value="online">Online</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPaymentOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (!paymentForm.booking_id) return;
                createPayment({
                  booking_id: Number(paymentForm.booking_id),
                  amount: paymentForm.amount,
                  payment_date: paymentForm.payment_date,
                  payment_method: paymentForm.payment_method,
                  status: paymentForm.status,
                  transaction_ref: paymentForm.transaction_ref || `TXN-${Date.now()}`,
                });
                setPaymentOpen(false);
              }}
            >
              Save Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={fuelOpen} onOpenChange={setFuelOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record Fuel</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="space-y-2">
              <Label>Vehicle</Label>
              <Select
                value={fuelForm.vehicle_id}
                onValueChange={(v) => setFuelForm({ ...fuelForm, vehicle_id: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select vehicle" />
                </SelectTrigger>
                <SelectContent>
                  {vehicles.map((v) => (
                    <SelectItem key={v.vehicle_id} value={String(v.vehicle_id)}>
                      {v.plateNumber}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Liters</Label>
              <Input
                type="number"
                value={fuelForm.liters}
                onChange={(e) => setFuelForm({ ...fuelForm, liters: +e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Cost</Label>
              <Input
                type="number"
                value={fuelForm.cost}
                onChange={(e) => setFuelForm({ ...fuelForm, cost: +e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Station</Label>
              <Input
                value={fuelForm.station}
                onChange={(e) => setFuelForm({ ...fuelForm, station: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFuelOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (!fuelForm.vehicle_id) return;
                createFuelRecord({
                  vehicle_id: Number(fuelForm.vehicle_id),
                  booking_id: fuelForm.booking_id ? Number(fuelForm.booking_id) : undefined,
                  fuel_date: fuelForm.fuel_date,
                  liters: fuelForm.liters,
                  cost: fuelForm.cost,
                  odometer: fuelForm.odometer,
                  station: fuelForm.station || "Fleet Depot",
                });
                setFuelOpen(false);
              }}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
