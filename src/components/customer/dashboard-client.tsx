"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Calendar, History, Heart, Settings, Download, X, CreditCard } from "lucide-react";
import { useMemo } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useBookingSnapshot } from "@/hooks/use-booking-conflicts";
import { useDataStoreVersion } from "@/hooks/use-data-store";
import { cancelBooking } from "@/lib/booking/booking-registry";
import { getPayments, getVehicles } from "@/lib/db/data-store";
import { CtaButton } from "@/components/customer/cta-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatDateOnly } from "@/lib/format-date";

export function DashboardClient() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const defaultTab =
    tabParam === "history"
      ? "history"
      : tabParam === "payments"
        ? "payments"
        : "upcoming";
  const { session, ready } = useAuth(true);
  const allBookings = useBookingSnapshot();
  const storeVersion = useDataStoreVersion();

  const { upcoming, history } = useMemo(() => {
    if (!session) return { upcoming: [], history: [] };
    const fleet = getVehicles();
    const mine = allBookings
      .filter((b) => b.customer_user_id === session.userId)
      .map((b) => ({
        ...b,
        vehicle: fleet.find((v) => v.vehicle_id === b.vehicle_id),
      }));
    return {
      upcoming: mine.filter((b) =>
        ["pending", "confirmed", "active"].includes(b.status)
      ),
      history: mine.filter((b) =>
        ["completed", "cancelled"].includes(b.status)
      ),
    };
  }, [allBookings, session, storeVersion]);

  const paymentHistory = useMemo(() => {
    if (!session) return [];
    const myBookingIds = new Set(
      allBookings
        .filter((b) => b.customer_user_id === session.userId)
        .map((b) => b.booking_id)
    );
    return getPayments()
      .filter((p) => myBookingIds.has(p.booking_id))
      .map((p) => ({
        ...p,
        booking: allBookings.find((b) => b.booking_id === p.booking_id),
      }))
      .sort((a, b) => b.payment_date.localeCompare(a.payment_date));
  }, [allBookings, session, storeVersion]);

  if (!ready || !session) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 text-center text-muted-foreground">
        Loading…
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 pb-24 sm:px-6 md:pb-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy sm:text-3xl">View Booking Status</h1>
          <p className="text-muted-foreground">
            Welcome back, {session.displayName}
          </p>
        </div>
        <CtaButton href="/vehicles" className="sm:w-auto">
          Make Booking
        </CtaButton>
      </div>

      <Tabs defaultValue={defaultTab} className="space-y-6">
        <TabsList className="flex h-auto w-full flex-wrap gap-1 rounded-xl p-1 bg-muted/50">
          <TabsTrigger value="upcoming" className="flex-1 rounded-lg sm:flex-none">
            Upcoming
          </TabsTrigger>
          <TabsTrigger value="history" className="flex-1 rounded-lg sm:flex-none">
            History
          </TabsTrigger>
          <TabsTrigger value="payments" className="flex-1 rounded-lg sm:flex-none">
            Payments
          </TabsTrigger>
          <TabsTrigger value="saved" className="flex-1 rounded-lg sm:flex-none">
            Saved
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex-1 rounded-lg sm:flex-none">
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {upcoming.length === 0 ? (
            <Card className="rounded-2xl border-dashed">
              <CardContent className="py-12 text-center text-muted-foreground">
                No upcoming bookings.{" "}
                <Link href="/vehicles" className="text-cta hover:underline">
                  Select Vehicle
                </Link>
              </CardContent>
            </Card>
          ) : (
            upcoming.map((b) => (
              <Card key={b.booking_id} className="rounded-2xl shadow-soft border-0">
                <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cta/10">
                      <Calendar className="h-6 w-6 text-cta" />
                    </div>
                    <div>
                      <p className="font-semibold text-navy">
                        {b.vehicle?.brand} {b.vehicle?.model}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatDateOnly(b.pickup_date, "MMM d")} –{" "}
                        {formatDateOnly(b.return_date, "MMM d, yyyy")}
                      </p>
                      <p className="text-xs font-mono text-muted-foreground mt-1">
                        #{b.booking_id}
                      </p>
                      {b.status === "pending" && (
                        <p className="text-xs text-amber-700 mt-1">
                          Awaiting admin approval
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge type="booking" status={b.status} />
                    <Button variant="outline" size="sm" className="rounded-lg h-9 gap-1">
                      <Download className="h-3.5 w-3.5" /> Invoice
                    </Button>
                    {["pending", "confirmed"].includes(b.status) && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-lg h-9 text-destructive gap-1"
                        onClick={() => cancelBooking(b.booking_id)}
                      >
                        <X className="h-3.5 w-3.5" /> Cancel Booking
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="history">
          {history.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No past bookings yet.</p>
          ) : (
            history.map((b) => (
              <Card key={b.booking_id} className="rounded-2xl shadow-soft border-0 mb-4">
                <CardContent className="flex flex-col gap-3 p-5 sm:flex-row sm:justify-between">
                  <div className="flex gap-4">
                    <History className="h-10 w-10 text-muted-foreground shrink-0" />
                    <div>
                      <p className="font-semibold text-navy">
                        {b.vehicle?.brand} {b.vehicle?.model}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatDateOnly(b.pickup_date, "MMM d")} –{" "}
                        {formatDateOnly(b.return_date, "MMM d, yyyy")}
                      </p>
                      <StatusBadge type="booking" status={b.status} />
                    </div>
                  </div>
                  <p className="font-bold text-navy">${b.total_amount}</p>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <Card className="rounded-2xl shadow-soft border-0">
            <CardHeader>
              <CardTitle className="text-navy flex items-center gap-2 text-base">
                <CreditCard className="h-5 w-5" /> View Payment History
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {paymentHistory.length === 0 ? (
                <p className="text-sm text-muted-foreground">No payments yet.</p>
              ) : (
                paymentHistory.map((p) => (
                  <div
                    key={p.payment_id}
                    className="flex flex-col gap-1 border-b pb-3 last:border-0 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-medium text-navy">
                        Booking #{p.booking_id}
                        {p.transaction_ref ? ` · ${p.transaction_ref}` : ""}
                      </p>
                      <p className="text-sm text-muted-foreground capitalize">
                        {p.payment_method} · {p.payment_date}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">${p.amount}</span>
                      <StatusBadge type="payment" status={p.status} />
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="saved">
          <Card className="rounded-2xl border-dashed">
            <CardContent className="flex flex-col items-center py-12 text-center">
              <Heart className="h-10 w-10 text-muted-foreground mb-3" />
              <p className="text-muted-foreground">No saved vehicles yet</p>
              <CtaButton href="/vehicles" variant="outline" className="mt-4">
                Select Vehicle
              </CtaButton>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card className="rounded-2xl shadow-soft border-0">
            <CardHeader>
              <CardTitle className="text-navy flex items-center gap-2">
                <Settings className="h-5 w-5" /> Account Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p>Payment methods: Visa •••• 4242, PayPal linked</p>
              <p>
                <Link href="/dashboard?tab=payments" className="text-cta hover:underline">
                  View Payment History
                </Link>
              </p>
              <CtaButton variant="outline" className="w-full sm:w-auto">
                Edit Profile
              </CtaButton>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
