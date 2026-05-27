"use client";

import Image from "next/image";
import { Star, Users, Fuel, Cog, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CtaButton } from "@/components/customer/cta-button";
import type { CustomerVehicle } from "@/lib/customer-vehicles";
import { cn } from "@/lib/utils";

const tagStyles: Record<string, string> = {
  Premium: "bg-cta/15 text-cta border-0",
  Popular: "bg-blue-500/15 text-blue-600 border-0",
  New: "bg-emerald-500/15 text-emerald-600 border-0",
  Bestseller: "bg-orange-500/15 text-orange-600 border-0",
  Luxury: "bg-violet-500/15 text-violet-600 border-0",
  Reserved: "bg-red-500/15 text-red-600 border-0",
};

export function VehicleCard({ vehicle }: { vehicle: CustomerVehicle }) {
  const displayName =
    vehicle.brand === "BMW" && vehicle.model === "X5"
      ? "BMW 5 Series"
      : vehicle.brand === "Mercedes"
        ? "Mercedes E-Class"
        : `${vehicle.brand} ${vehicle.model}`;

  return (
    <Card className="group overflow-hidden rounded-2xl border border-border/60 bg-card shadow-soft transition hover:shadow-lg">
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        <Image
          src={vehicle.image}
          alt={displayName}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {vehicle.tag && (
          <Badge
            className={cn(
              "absolute left-3 top-3 text-xs font-medium",
              tagStyles[vehicle.tag] ?? tagStyles.Premium
            )}
          >
            {vehicle.tag}
          </Badge>
        )}
        <button
          type="button"
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-md transition hover:scale-105"
          aria-label="Save to favorites"
        >
          <Heart className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-bold text-foreground truncate">{displayName}</h3>
            <p className="text-xs text-muted-foreground">
              {vehicle.year_model} · {vehicle.type}
            </p>
          </div>
          <p className="shrink-0 text-right font-bold text-cta">
            ${vehicle.pricePerDay}
            <span className="block text-xs font-normal text-muted-foreground">/ day</span>
          </p>
        </div>

        <div className="mt-2 flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={cn(
                "h-3.5 w-3.5",
                i < Math.floor(vehicle.rating)
                  ? "fill-amber-400 text-amber-400"
                  : "fill-muted text-muted"
              )}
            />
          ))}
          <span className="ml-1 text-xs text-muted-foreground">
            {vehicle.rating.toFixed(1)} ({vehicle.reviewCount})
          </span>
        </div>

        <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" /> {vehicle.capacity} seats
          </span>
          <span className="flex items-center gap-1">
            <Fuel className="h-3.5 w-3.5" /> {vehicle.fuel}
          </span>
          <span className="flex items-center gap-1">
            <Cog className="h-3.5 w-3.5" /> {vehicle.transmission}
          </span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <CtaButton href={`/vehicles/${vehicle.vehicle_id}`} variant="outline" className="!text-xs">
            View Details
          </CtaButton>
          <CtaButton
            href={`/book?vehicle=${vehicle.vehicle_id}`}
            className="!text-xs"
            disabled={vehicle.status === "reserved" && vehicle.tag === "Reserved"}
          >
            Book
          </CtaButton>
        </div>
      </CardContent>
    </Card>
  );
}
