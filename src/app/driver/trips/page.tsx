"use client";

import { useMemo, useState } from "react";
import { MapPin, Check, X } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useBookingSnapshot } from "@/hooks/use-booking-conflicts";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatDateOnly } from "@/lib/format-date";
import { updateBookingStatus } from "@/lib/booking/booking-registry";
import { vehicles, customers } from "@/lib/db/mock-data";

export default function DriverTripsPage() {
  const { session } = useAuth(true);
  const bookings = useBookingSnapshot();
  const [accepted, setAccepted] = useState<number[]>([]);

  const myTrips = useMemo(() => {
    if (!session?.driverId) return [];
    return bookings
      .filter((b) => b.driver_id === session.driverId && b.status !== "cancelled")
      .map((b) => ({
        ...b,
        customer: customers.find((c) => c.user_id === b.customer_user_id),
        vehicle: vehicles.find((v) => v.vehicle_id === b.vehicle_id),
      }));
  }, [bookings, session?.driverId]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 space-y-6">
      <PageHeader
        title="View Assigned Trips"
        description="Driver UML: View Assigned Trips · Update Trip / Fuel Status"
      />

      <div className="space-y-4">
        {myTrips.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              No trips assigned yet.
            </CardContent>
          </Card>
        ) : (
          myTrips.map((b) => (
            <Card key={b.booking_id} className="border-border/60">
              <CardContent className="p-5 space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold">Booking #{b.booking_id}</p>
                    <p className="text-sm text-muted-foreground">
                      {b.customer?.customerFullName} · {b.vehicle?.brand} {b.vehicle?.model}
                    </p>
                    <p className="text-sm flex items-center gap-1 mt-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {formatDateOnly(b.pickup_date, "MMM d")} –{" "}
                      {formatDateOnly(b.return_date, "MMM d, yyyy")}
                    </p>
                  </div>
                  <StatusBadge type="booking" status={b.status} />
                </div>

                {b.status === "confirmed" && !accepted.includes(b.booking_id) && (
                  <div className="rounded-lg bg-cta/5 border border-cta/20 p-3 space-y-2">
                    <p className="text-sm font-medium">Choose Driver Option</p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="gap-1"
                        onClick={() => {
                          updateBookingStatus(b.booking_id, "active");
                          setAccepted((prev) => [...prev, b.booking_id]);
                        }}
                      >
                        <Check className="h-4 w-4" /> Accept trip
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1 text-destructive"
                        onClick={() => updateBookingStatus(b.booking_id, "cancelled")}
                      >
                        <X className="h-4 w-4" /> Decline
                      </Button>
                    </div>
                  </div>
                )}

                {accepted.includes(b.booking_id) && (
                  <Badge className="bg-emerald-500/10 text-emerald-700 border-0">
                    Trip accepted — status active
                  </Badge>
                )}

                {b.status === "active" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      updateBookingStatus(b.booking_id, "completed");
                    }}
                  >
                    Mark trip completed
                  </Button>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
