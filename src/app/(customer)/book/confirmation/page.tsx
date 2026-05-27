import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { CtaButton } from "@/components/customer/cta-button";
import { Card, CardContent } from "@/components/ui/card";

import { getServiceConfig, parseServiceType } from "@/lib/booking-service-config";

export default async function ConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string; total?: string; service?: string }>;
}) {
  const params = await searchParams;
  const reservationId = params.id ?? "BG-00000000";
  const total = params.total ?? "0";
  const serviceType = parseServiceType(params.service ?? null);
  const serviceLabel = serviceType ? getServiceConfig(serviceType).title : "Car rental";

  return (
    <div className="mx-auto max-w-lg px-4 py-16 sm:py-24">
      <Card className="rounded-2xl border-0 shadow-soft text-center">
        <CardContent className="p-8 sm:p-10">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10">
            <CheckCircle className="h-12 w-12 text-emerald-500" />
          </div>
          <h1 className="text-2xl font-bold text-navy sm:text-3xl">Booking Confirmed!</h1>
          <p className="mt-2 text-muted-foreground">
            Your reservation has been successfully placed.
          </p>
          <div className="mt-8 rounded-2xl bg-muted/50 p-6 space-y-2">
            <p className="text-sm text-muted-foreground">Service</p>
            <p className="font-semibold text-navy">{serviceLabel}</p>
            <p className="text-sm text-muted-foreground pt-2">Reservation ID</p>
            <p className="text-2xl font-mono font-bold text-cta">{reservationId}</p>
            <p className="text-sm text-muted-foreground pt-2">Total paid</p>
            <p className="text-xl font-bold text-navy">${total}</p>
          </div>
          <div className="mt-8 flex flex-col gap-3">
            <CtaButton href="/dashboard" className="w-full">
              View Dashboard
            </CtaButton>
            <CtaButton href="/vehicles" variant="outline" className="w-full">
              Book Another Vehicle
            </CtaButton>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
