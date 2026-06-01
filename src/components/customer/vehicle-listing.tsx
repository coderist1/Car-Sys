"use client";

import { useMemo, useState } from "react";
import { useDataStoreVersion } from "@/hooks/use-data-store";
import { getCustomerVehicles, type CustomerVehicle } from "@/lib/customer-vehicles";
import { SlidersHorizontal } from "lucide-react";
import { VehicleCard } from "@/components/customer/vehicle-card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
export function VehicleListing() {
  const storeVersion = useDataStoreVersion();
  const vehicles = useMemo(() => getCustomerVehicles(), [storeVersion]);
  const [type, setType] = useState("all");
  const [transmission, setTransmission] = useState("all");
  const [fuel, setFuel] = useState("all");
  const [maxPrice, setMaxPrice] = useState(200);
  const [minSeats, setMinSeats] = useState(0);

  const types = useMemo(() => [...new Set(vehicles.map((v) => v.type))], [vehicles]);

  const filtered = useMemo(() => {
    return vehicles.filter((v) => {
      if (type !== "all" && v.type !== type) return false;
      if (transmission !== "all" && v.transmission !== transmission) return false;
      if (fuel !== "all" && v.fuel !== fuel) return false;
      if (v.pricePerDay > maxPrice) return false;
      if (minSeats > 0 && v.capacity < minSeats) return false;
      return true;
    });
  }, [vehicles, type, transmission, fuel, maxPrice, minSeats]);

  const Filters = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Vehicle type</Label>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="rounded-xl">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            {types.map((t) => (
              <SelectItem key={t} value={t}>{t}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Max price / day (${maxPrice})</Label>
        <Input
          type="range"
          min={50}
          max={200}
          value={maxPrice}
          onChange={(e) => setMaxPrice(+e.target.value)}
          className="w-full"
        />
      </div>
      <div className="space-y-2">
        <Label>Transmission</Label>
        <Select value={transmission} onValueChange={setTransmission}>
          <SelectTrigger className="rounded-xl">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any</SelectItem>
            <SelectItem value="Automatic">Automatic</SelectItem>
            <SelectItem value="Manual">Manual</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Fuel type</Label>
        <Select value={fuel} onValueChange={setFuel}>
          <SelectTrigger className="rounded-xl">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any</SelectItem>
            <SelectItem value="Gasoline">Gasoline</SelectItem>
            <SelectItem value="Electric">Electric</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Min. seating</Label>
        <Select value={String(minSeats)} onValueChange={(v) => setMinSeats(+v)}>
          <SelectTrigger className="rounded-xl">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">Any</SelectItem>
            <SelectItem value="5">5+</SelectItem>
            <SelectItem value="7">7+</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="section-label">Browse</p>
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl mt-1">Available Vehicles</h1>
        <p className="text-muted-foreground mt-1">{filtered.length} cars available</p>
      </div>

      <div className="flex gap-8">
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-24 rounded-2xl border bg-card p-6 shadow-soft">
            <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4" /> Filters
            </h2>
            <Filters />
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="mb-6 w-full rounded-xl lg:hidden h-11">
                <SlidersHorizontal className="h-4 w-4 mr-2" /> Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full sm:max-w-sm">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <Filters />
              </div>
            </SheetContent>
          </Sheet>

          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((v) => (
              <VehicleCard key={v.vehicle_id} vehicle={v} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
