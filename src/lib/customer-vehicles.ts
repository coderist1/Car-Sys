import { getVehicles } from "@/lib/db/data-store";
import type { Vehicle } from "@/lib/db/types";

export type VehicleTag = "Premium" | "Popular" | "New" | "Bestseller" | "Luxury" | "Reserved";

export type CustomerVehicle = Vehicle & {
  image: string;
  pricePerDay: number;
  rating: number;
  reviewCount: number;
  transmission: string;
  fuel: string;
  features: string[];
  tag?: VehicleTag;
};

const images: Record<string, string> = {
  Sedan: "/vehicles/sedan.jpg",
  SUV: "/vehicles/suv.jpg",
  Electric: "/vehicles/electric.jpg",
  Van: "/vehicles/van.jpg",
  "Luxury SUV": "/vehicles/luxury-suv.jpg",
  "Luxury Sedan": "/vehicles/luxury-sedan.jpg",
};

const priceMap: Record<string, number> = {
  Sedan: 65,
  SUV: 85,
  Electric: 95,
  Van: 110,
  "Luxury SUV": 145,
  "Luxury Sedan": 135,
};

export function getCustomerVehicles(): CustomerVehicle[] {
  return getVehicles()
    .filter((v) => v.status === "available" || v.status === "reserved")
    .map((v) => {
      const transmission =
        v.type === "Electric" ? "Automatic" : v.vehicle_id % 2 ? "Automatic" : "Manual";
      const tags: VehicleTag[] = ["Premium", "Popular", "New", "Bestseller", "Luxury"];
      return {
        ...v,
        image: images[v.type] ?? images.Sedan,
        pricePerDay: priceMap[v.type] ?? 75,
        rating: 4.2 + (v.vehicle_id % 8) / 10,
        reviewCount: 80 + v.vehicle_id * 12,
        transmission,
        fuel: v.type === "Electric" ? "Electric" : v.type === "Van" ? "Diesel" : "Gasoline",
        tag:
          v.status === "reserved"
            ? "Reserved"
            : tags[v.vehicle_id % tags.length],
        features: [
          "Air conditioning",
          "GPS",
          "Bluetooth",
          transmission === "Automatic" ? "Automatic transmission" : "Manual transmission",
        ],
      };
    });
}

export function getCustomerVehicle(id: number) {
  return getCustomerVehicles().find((v) => v.vehicle_id === id);
}
