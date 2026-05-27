"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Calendar, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { HydrationDateInput } from "@/components/shared/hydration-date-input";
import { Label } from "@/components/ui/label";
import { CtaButton } from "@/components/customer/cta-button";

export function SearchHero() {
  const router = useRouter();
  const [location, setLocation] = useState("Miami International Airport");

  return (
    <div className="w-full max-w-3xl rounded-2xl bg-white p-5 shadow-2xl sm:p-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-1.5 sm:col-span-1">
          <Label className="text-xs font-medium text-muted-foreground">Pickup location</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="h-11 rounded-xl border-border bg-gray-50 pl-9"
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground">Pickup date</Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <HydrationDateInput className="h-11 rounded-xl border-border bg-gray-50 pl-9" defaultValue="2026-06-01" />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground">Return date</Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <HydrationDateInput className="h-11 rounded-xl border-border bg-gray-50 pl-9" defaultValue="2026-06-08" />
          </div>
        </div>
      </div>
      <CtaButton
        className="mt-4 w-full !rounded-xl !h-12"
        onClick={() => router.push("/vehicles")}
      >
        <Search className="h-4 w-4 mr-2" />
        Search Available Vehicles
      </CtaButton>
    </div>
  );
}
