import Link from "next/link";
import { ArrowRight, Car } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatDateOnly } from "@/lib/format-date";
import type { BookingWithRelations } from "@/lib/db/types";

export function RecentBookings({ bookings }: { bookings: BookingWithRelations[] }) {
  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle className="text-base font-semibold">Recent Bookings</CardTitle>
          <CardDescription>Latest reservations from the booking table</CardDescription>
        </div>
        <Button variant="ghost" size="sm" className="gap-1 text-primary" asChild>
          <Link href="/reservations">
            View all
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border/60">
          {bookings.map((b) => (
            <div
              key={b.booking_id}
              className="flex flex-col gap-3 px-6 py-4 transition-colors hover:bg-muted/30 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-start gap-3 min-w-0">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Car className="h-5 w-5 text-primary" />
                </div>
                <div className="min-w-0 space-y-0.5">
                  <p className="font-medium text-sm truncate">
                    {b.customer?.customerFullName ?? "Unknown customer"}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {b.vehicle
                      ? `${b.vehicle.brand} ${b.vehicle.model} · ${b.vehicle.plateNumber}`
                      : "No vehicle"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDateOnly(b.pickup_date, "MMM d")} –{" "}
                    {formatDateOnly(b.return_date, "MMM d, yyyy")}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 sm:justify-end shrink-0">
                <span className="font-mono text-xs text-muted-foreground">#{b.booking_id}</span>
                <StatusBadge type="booking" status={b.status} />
                {b.payment && (
                  <StatusBadge type="payment" status={b.payment.status} />
                )}
                <span className="text-sm font-semibold tabular-nums">${b.total_amount}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
