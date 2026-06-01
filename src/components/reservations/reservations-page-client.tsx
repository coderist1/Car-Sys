"use client";

import { useEffect, useMemo, useState } from "react";
import { Calendar, Plus, Eye, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { PageActionButton } from "@/components/shared/page-action-button";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { HydrationDateInput } from "@/components/shared/hydration-date-input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import type {
  BookingWithRelations,
  BookingStatus,
  CustomerInfo,
  DriverDetails,
  Vehicle,
} from "@/lib/db/types";
import { formatDateOnly } from "@/lib/format-date";
import { BookingConflictAlert } from "@/components/shared/booking-conflict-alert";
import { useBookingConflicts, useBookingSnapshot } from "@/hooks/use-booking-conflicts";
import {
  deleteBooking,
  resetBookings,
  tryCreateBooking,
  updateBooking,
} from "@/lib/booking/booking-registry";
import { findBookingConflicts } from "@/lib/booking/conflict-detection";

export function ReservationsPageClient({
  bookings,
  customers,
  vehicles,
  driverList,
}: {
  bookings: BookingWithRelations[];
  customers: CustomerInfo[];
  vehicles: Vehicle[];
  driverList: DriverDetails[];
}) {
  const [selected, setSelected] = useState<BookingWithRelations | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [clientReady, setClientReady] = useState(false);
  const [form, setForm] = useState({
    customer_user_id: "",
    vehicle_id: "",
    driver_id: "",
    pickup_date: "",
    return_date: "",
    total_amount: 0,
    status: "pending" as BookingStatus,
  });

  useEffect(() => {
    setClientReady(true);
    resetBookings(
      bookings.map((b) => ({
        booking_id: b.booking_id,
        customer_user_id: b.customer_user_id,
        vehicle_id: b.vehicle_id,
        driver_id: b.driver_id,
        pickup_date: b.pickup_date,
        return_date: b.return_date,
        status: b.status,
        total_amount: b.total_amount,
        payment_id: b.payment_id,
      }))
    );
  }, [bookings]);

  const registryBookings = useBookingSnapshot();

  const localBookings = useMemo(
    () =>
      registryBookings
        .map((b) => {
          const enriched = bookings.find((x) => x.booking_id === b.booking_id);
          if (enriched) return { ...enriched, ...b };
          const customer = customers.find((c) => c.user_id === b.customer_user_id);
          const vehicle = vehicles.find((v) => v.vehicle_id === b.vehicle_id);
          const driver = b.driver_id
            ? driverList.find((d) => d.driver_id === b.driver_id)
            : undefined;
          return {
            ...b,
            customer,
            vehicle,
            driver,
          } as BookingWithRelations;
        })
        .sort((a, b) => b.booking_id - a.booking_id),
    [registryBookings, bookings, customers, vehicles, driverList]
  );

  const draft = useMemo(() => {
    if (!form.vehicle_id || !form.customer_user_id || !form.pickup_date || !form.return_date) {
      return null;
    }
    return {
      vehicle_id: Number(form.vehicle_id),
      customer_user_id: Number(form.customer_user_id),
      driver_id:
        form.driver_id && form.driver_id !== "none" ? Number(form.driver_id) : undefined,
      pickup_date: form.pickup_date,
      return_date: form.return_date,
      status: form.status,
    };
  }, [form]);

  const { conflicts: liveConflicts, hasConflict } = useBookingConflicts(draft);

  const activeCount = localBookings.filter((b) => b.status === "active").length;
  const confirmedCount = localBookings.filter((b) => b.status === "confirmed").length;

  const handleCreate = async () => {
    setCreateError(null);
    const customer = customers.find((c) => c.user_id === Number(form.customer_user_id));
    const vehicle = vehicles.find((v) => v.vehicle_id === Number(form.vehicle_id));
    if (!customer || !vehicle || !form.pickup_date || !form.return_date) {
      setCreateError("Please complete all required fields.");
      return;
    }

    setIsCreating(true);
    const driverId =
      form.driver_id && form.driver_id !== "none" ? Number(form.driver_id) : undefined;

    const result = await tryCreateBooking({
      customer_user_id: customer.user_id,
      vehicle_id: vehicle.vehicle_id,
      driver_id: driverId,
      pickup_date: form.pickup_date,
      return_date: form.return_date,
      status: form.status,
      total_amount: form.total_amount,
    });
    setIsCreating(false);

    if (!result.success) {
      setCreateError(result.message);
      return;
    }

    setAddOpen(false);
    setForm({
      customer_user_id: "",
      vehicle_id: "",
      driver_id: "",
      pickup_date: "",
      return_date: "",
      total_amount: 0,
      status: "pending",
    });
  };

  const handleDriverAssign = (booking: BookingWithRelations, driverId: number | undefined) => {
    const conflicts = findBookingConflicts(registryBookings, {
      booking_id: booking.booking_id,
      vehicle_id: booking.vehicle_id,
      customer_user_id: booking.customer_user_id,
      driver_id: driverId,
      pickup_date: booking.pickup_date,
      return_date: booking.return_date,
      status: booking.status,
    }).filter((c) => c.type === "driver");

    if (conflicts.length > 0) {
      setCreateError(conflicts[0].message);
      return;
    }

    updateBooking(booking.booking_id, { driver_id: driverId });
    setCreateError(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reservations"
        description="Bookings linked to customer_info, vehicle, payment, and driver_details."
      >
        <PageActionButton type="button" onClick={() => setAddOpen(true)}>
          <Plus className="h-4 w-4 shrink-0" />
          <span className="truncate">New Reservation</span>
        </PageActionButton>
        <Dialog
          open={addOpen}
          onOpenChange={(open) => {
            setAddOpen(open);
            if (!open) {
              setCreateError(null);
            }
          }}
        >
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>New Reservation</DialogTitle>
              <DialogDescription>Create a booking linked to customer and vehicle</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-2">
              {!clientReady ? (
                <p className="text-sm text-muted-foreground py-4">Loading form…</p>
              ) : (
              <>
              <div className="space-y-2">
                <Label>Customer</Label>
                <Select
                  value={form.customer_user_id}
                  onValueChange={(v) => setForm({ ...form, customer_user_id: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((c) => (
                      <SelectItem key={c.user_id} value={String(c.user_id)}>
                        {c.customerFullName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Vehicle</Label>
                <Select
                  value={form.vehicle_id}
                  onValueChange={(v) => setForm({ ...form, vehicle_id: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select vehicle" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicles.map((v) => (
                      <SelectItem key={v.vehicle_id} value={String(v.vehicle_id)}>
                        {v.plateNumber} — {v.brand} {v.model}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Driver (optional)</Label>
                <Select
                  value={form.driver_id}
                  onValueChange={(v) => setForm({ ...form, driver_id: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Unassigned" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Unassigned</SelectItem>
                    {driverList
                      .filter((d) => d.employment_status === "active")
                      .map((d) => (
                        <SelectItem key={d.driver_id} value={String(d.driver_id)}>
                          {d.full_name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Pickup Date</Label>
                  <HydrationDateInput
                    value={form.pickup_date}
                    onChange={(e) => setForm({ ...form, pickup_date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Return Date</Label>
                  <HydrationDateInput
                    value={form.return_date}
                    onChange={(e) => setForm({ ...form, return_date: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Total Amount ($)</Label>
                  <Input
                    type="number"
                    value={form.total_amount}
                    onChange={(e) =>
                      setForm({ ...form, total_amount: +e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={form.status}
                    onValueChange={(v) =>
                      setForm({ ...form, status: v as BookingStatus })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <BookingConflictAlert conflicts={liveConflicts} />
              {createError && (
                <p className="text-sm text-destructive" role="alert">
                  {createError}
                </p>
              )}
              </>
              )}
            </div>
            <DialogFooter className="flex-col gap-2 sm:flex-row">
              <Button variant="outline" className="w-full sm:w-auto" onClick={() => setAddOpen(false)}>
                Cancel
              </Button>
              <Button
                className="w-full sm:w-auto"
                disabled={hasConflict || isCreating}
                onClick={handleCreate}
              >
                {isCreating ? "Checking availability…" : "Create Reservation"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-border/60">
          <CardHeader className="pb-2">
            <CardDescription>Active Rentals</CardDescription>
            <CardTitle className="text-2xl">{activeCount}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-border/60">
          <CardHeader className="pb-2">
            <CardDescription>Confirmed Upcoming</CardDescription>
            <CardTitle className="text-2xl">{confirmedCount}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-border/60">
          <CardHeader className="pb-2">
            <CardDescription>Utilization</CardDescription>
            <CardTitle className="text-2xl">68%</CardTitle>
            <Progress value={68} className="mt-2 h-1.5" />
          </CardHeader>
        </Card>
      </div>

      <Tabs defaultValue="table">
        <TabsList className="flex h-auto w-full flex-wrap gap-1 p-1 sm:w-auto">
          <TabsTrigger value="table" className="flex-1 sm:flex-none">Reservations</TabsTrigger>
          <TabsTrigger value="calendar" className="flex-1 sm:flex-none">Calendar</TabsTrigger>
          <TabsTrigger value="timeline" className="flex-1 sm:flex-none">Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="table" className="mt-4">
          <Card className="border-border/60 shadow-sm">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Reservation ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Vehicle</TableHead>
                      <TableHead>Pickup</TableHead>
                      <TableHead>Return</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Driver</TableHead>
                      <TableHead />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {localBookings.map((b) => (
                      <TableRow key={b.booking_id}>
                        <TableCell className="font-mono text-xs">#{b.booking_id}</TableCell>
                        <TableCell>{b.customer?.customerFullName ?? "—"}</TableCell>
                        <TableCell>
                          {b.vehicle
                            ? `${b.vehicle.brand} ${b.vehicle.model}`
                            : "—"}
                          <span className="block text-xs text-muted-foreground">
                            {b.vehicle?.plateNumber}
                          </span>
                        </TableCell>
                        <TableCell>{formatDateOnly(b.pickup_date, "MMM d, yyyy")}</TableCell>
                        <TableCell>{formatDateOnly(b.return_date, "MMM d, yyyy")}</TableCell>
                        <TableCell>
                          {b.payment ? (
                            <StatusBadge type="payment" status={b.payment.status} />
                          ) : (
                            <StatusBadge type="payment" status="pending" />
                          )}
                        </TableCell>
                        <TableCell>
                          <StatusBadge type="booking" status={b.status} />
                        </TableCell>
                        <TableCell>
                          {clientReady ? (
                            <Select
                              value={b.driver_id?.toString() ?? "none"}
                              onValueChange={(v) => {
                                const driverId = v === "none" ? undefined : +v;
                                handleDriverAssign(b, driverId);
                              }}
                            >
                              <SelectTrigger className="h-8 w-[140px] text-xs">
                                <SelectValue placeholder="Assign" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="none">Unassigned</SelectItem>
                                {driverList
                                  .filter((d) => d.employment_status === "active")
                                  .map((d) => (
                                    <SelectItem key={d.driver_id} value={String(d.driver_id)}>
                                      {d.full_name}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                          ) : (
                            <div className="h-8 w-[140px] rounded-lg bg-muted/50" />
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setSelected(b)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                            onClick={() => {
                              if (deleteBooking(b.booking_id)) setSelected(null);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar" className="mt-4">
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Reservation Calendar
              </CardTitle>
              <CardDescription>Pickup dates across active and confirmed bookings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {localBookings
                  .filter((b) => ["active", "confirmed", "pending"].includes(b.status))
                  .map((b) => (
                    <div
                      key={b.booking_id}
                      className="rounded-lg border p-3 text-sm hover:bg-muted/30 cursor-pointer"
                      onClick={() => setSelected(b)}
                    >
                      <p className="font-medium">#{b.booking_id} · {b.customer?.customerFullName}</p>
                      <p className="text-muted-foreground text-xs mt-1">
                        {formatDateOnly(b.pickup_date, "MMM d")} →{" "}
                        {formatDateOnly(b.return_date, "MMM d, yyyy")}
                      </p>
                      <p className="text-xs mt-2">{b.vehicle?.plateNumber}</p>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline" className="mt-4">
          <Card className="border-border/60">
            <CardContent className="py-6">
              <div className="relative space-y-6 before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-border">
                {localBookings.slice(0, 6).map((b, i) => (
                  <div key={b.booking_id} className="relative flex gap-4 pl-10">
                    <div className="absolute left-0 flex h-10 w-10 items-center justify-center rounded-full border bg-background text-xs font-bold">
                      {i + 1}
                    </div>
                    <div>
                      <p className="font-medium">
                        Booking #{b.booking_id} — {b.status}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {b.customer?.customerFullName} rented {b.vehicle?.brand} {b.vehicle?.model}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Payment: {b.payment?.status ?? "pending"} · Driver:{" "}
                        {b.driver?.full_name ?? "Unassigned"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="sm:max-w-lg">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle>Reservation #{selected.booking_id}</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 text-sm">
                <Row label="Customer (customer_info)" value={selected.customer?.customerFullName} />
                <Row label="Vehicle (vehicle)" value={`${selected.vehicle?.brand} ${selected.vehicle?.model}`} />
                <Row label="Driver (driver_details)" value={selected.driver?.full_name ?? "Unassigned"} />
                <Row label="Pickup" value={selected.pickup_date} />
                <Row label="Return" value={selected.return_date} />
                <Row label="Total" value={`$${selected.total_amount}`} />
                <Row
                  label="Payment (payment)"
                  value={
                    selected.payment
                      ? `${selected.payment.status} · $${selected.payment.amount} · ${selected.payment.payment_method}`
                      : "No payment linked"
                  }
                />
                <div className="flex gap-2 pt-2">
                  <StatusBadge type="booking" status={selected.status} />
                  {selected.payment && (
                    <StatusBadge type="payment" status={selected.payment.status} />
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Row({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-border/40 pb-2">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-right">{value ?? "—"}</span>
    </div>
  );
}
