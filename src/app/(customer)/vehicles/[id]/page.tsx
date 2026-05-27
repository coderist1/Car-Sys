import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Star, Check, MapPin } from "lucide-react";
import { getCustomerVehicle } from "@/lib/customer-vehicles";
import { CtaButton } from "@/components/customer/cta-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HydrationDateInput } from "@/components/shared/hydration-date-input";
import { formatNumber } from "@/lib/format-number";

export default async function VehicleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const vehicle = getCustomerVehicle(Number(id));
  if (!vehicle) notFound();

  const days = 7;
  const subtotal = vehicle.pricePerDay * days;
  const insurance = 49;
  const total = subtotal + insurance;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-muted shadow-soft">
            <Image src={vehicle.image} alt={vehicle.model} fill className="object-cover" priority />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {vehicle.brand} {vehicle.model}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                {vehicle.rating.toFixed(1)} (128 reviews)
              </span>
              <span>{vehicle.type}</span>
              <span>{vehicle.plateNumber}</span>
            </div>
          </div>

          <Card className="rounded-2xl shadow-soft border-0">
            <CardHeader>
              <CardTitle className="text-foreground">Specifications</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2 text-sm">
              <Spec label="Transmission" value={vehicle.transmission} />
              <Spec label="Fuel" value={vehicle.fuel} />
              <Spec label="Seats" value={`${vehicle.capacity} passengers`} />
              <Spec label="Year" value={String(vehicle.year_model)} />
              <Spec label="Mileage" value={`${formatNumber(vehicle.mileage)} mi`} />
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-soft border-0">
            <CardHeader>
              <CardTitle className="text-foreground">Features</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2 sm:grid-cols-2">
              {vehicle.features.map((f) => (
                <div key={f} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-cta shrink-0" />
                  {f}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-24 rounded-2xl shadow-soft border-0">
            <CardHeader>
              <CardTitle className="text-foreground">Reserve Now</CardTitle>
              <p className="text-2xl font-bold text-cta">
                ${vehicle.pricePerDay}
                <span className="text-sm font-normal text-muted-foreground">/day</span>
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Pickup location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input className="pl-9 rounded-xl h-11" defaultValue="Miami Airport" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Pickup</Label>
                  <HydrationDateInput className="rounded-xl h-11" defaultValue="2026-06-01" />
                </div>
                <div className="space-y-2">
                  <Label>Return</Label>
                  <HydrationDateInput className="rounded-xl h-11" defaultValue="2026-06-08" />
                </div>
              </div>
              <div className="rounded-xl bg-muted/50 p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>${vehicle.pricePerDay} × {days} days</span>
                  <span>${subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Insurance</span>
                  <span>${insurance}</span>
                </div>
                <div className="flex justify-between font-bold text-foreground pt-2 border-t">
                  <span>Total</span>
                  <span>${total}</span>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">Choose service</p>
                <CtaButton
                  href={`/book?vehicle=${vehicle.vehicle_id}&service=self-drive`}
                  className="w-full"
                >
                  Self-Drive Rental
                </CtaButton>
                <CtaButton
                  href={`/book?vehicle=${vehicle.vehicle_id}&service=chauffeur`}
                  variant="outline"
                  className="w-full"
                >
                  Chauffeur-Driven
                </CtaButton>
              </div>
              <CtaButton href={`/vehicles`} variant="outline" className="w-full">
                Back to listings
              </CtaButton>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-muted-foreground">{label}</p>
      <p className="font-medium text-foreground">{value}</p>
    </div>
  );
}
