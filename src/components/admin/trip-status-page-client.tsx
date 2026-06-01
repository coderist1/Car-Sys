"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusBadge } from "@/components/shared/status-badge";
import { useBookingSnapshot } from "@/hooks/use-booking-conflicts";
import { useDataStoreVersion } from "@/hooks/use-data-store";
import { updateBookingStatus } from "@/lib/booking/booking-registry";
import { enrichBooking, getAllFuelRecords } from "@/lib/db/queries";
import { formatDateOnly } from "@/lib/format-date";

type FuelRecordRow = ReturnType<typeof getAllFuelRecords>[number];

export function TripStatusPageClient({
  fuelRecords,
}: {
  fuelRecords: FuelRecordRow[];
}) {
  const [message, setMessage] = useState<string | null>(null);
  const registryBookings = useBookingSnapshot();
  const storeVersion = useDataStoreVersion();

  const bookings = useMemo(
    () => registryBookings.map(enrichBooking),
    [registryBookings, storeVersion]
  );

  const activeTrips = bookings.filter((b) =>
    ["active", "confirmed", "pending"].includes(b.status)
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Update Trip / Fuel Status"
        description="UML use case: update booking trip status and review fuel_record entries."
      />

      {message && (
        <p className="text-sm text-emerald-700 bg-emerald-500/10 rounded-lg px-3 py-2">
          {message}
        </p>
      )}

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="text-base">Active & upcoming trips</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {activeTrips.map((b) => (
            <div
              key={b.booking_id}
              className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-medium">
                  #{b.booking_id} · {b.customer?.customerFullName}
                </p>
                <p className="text-sm text-muted-foreground">
                  {b.vehicle?.brand} {b.vehicle?.model} ·{" "}
                  {formatDateOnly(b.pickup_date, "MMM d")} –{" "}
                  {formatDateOnly(b.return_date, "MMM d, yyyy")}
                </p>
                <StatusBadge type="booking" status={b.status} />
              </div>
              <Select
                value={b.status}
                onValueChange={(v) => {
                  updateBookingStatus(b.booking_id, v as typeof b.status);
                  setMessage(`Booking #${b.booking_id} updated to ${v}.`);
                }}
              >
                <SelectTrigger className="w-[160px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          ))}
          {activeTrips.length === 0 && (
            <p className="text-sm text-muted-foreground">No active trips.</p>
          )}
        </CardContent>
      </Card>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="text-base">Recent fuel records</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {fuelRecords.slice(0, 8).map((f) => (
            <div
              key={f.fuel_id}
              className="flex flex-col gap-1 border-b pb-3 last:border-0 sm:flex-row sm:justify-between"
            >
              <div>
                <p className="font-medium text-sm">
                  {f.vehicle?.brand} {f.vehicle?.model} · {f.station}
                </p>
                <p className="text-xs text-muted-foreground">
                  {f.fuel_date} · {f.liters}L · odometer {f.odometer}
                </p>
              </div>
              <p className="font-semibold text-sm">${f.cost.toFixed(2)}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Button variant="outline" className="rounded-lg" asChild>
        <a href="/admin/reservations">Manage reservations</a>
      </Button>
    </div>
  );
}
