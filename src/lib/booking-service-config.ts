import type { LucideIcon } from "lucide-react";
import {
  Car,
  Check,
  CreditCard,
  MapPin,
  Shield,
  Upload,
  User,
  ScrollText,
} from "lucide-react";

export type ServiceType = "self-drive" | "chauffeur";

export type BookingStepId =
  | "vehicle"
  | "trip"
  | "personal"
  | "license"
  | "lease"
  | "payment"
  | "review";

export type BookingStep = {
  id: BookingStepId;
  label: string;
  icon: LucideIcon;
};

export type ServiceAddOn = {
  id: string;
  label: string;
  description: string;
  pricePerDay: number;
};

export type ChauffeurTier = {
  id: string;
  label: string;
  description: string;
  feePerDay: number;
  highlights: string[];
};

export type ServiceConfig = {
  type: ServiceType;
  title: string;
  subtitle: string;
  badge: string;
  steps: BookingStep[];
  features: string[];
  requirements: string[];
  insurancePerBooking: number;
  rentalDays: number;
  addOns?: ServiceAddOn[];
  chauffeurTiers?: ChauffeurTier[];
};

export const SELF_DRIVE_CONFIG: ServiceConfig = {
  type: "self-drive",
  title: "Self-Drive Rental",
  subtitle: "You drive — full control of your trip",
  badge: "Most popular",
  rentalDays: 7,
  insurancePerBooking: 49,
  steps: [
    { id: "vehicle", label: "Vehicle", icon: Car },
    { id: "personal", label: "Personal Info", icon: User },
    { id: "license", label: "License", icon: Upload },
    { id: "lease", label: "Lease Agreement", icon: ScrollText },
    { id: "payment", label: "Payment", icon: CreditCard },
    { id: "review", label: "Review", icon: Check },
  ],
  features: [
    "Unlimited mileage on select vehicles",
    "Comprehensive insurance package",
    "24/7 roadside assistance",
    "Free cancellation up to 24 hours before pickup",
  ],
  requirements: [
    "Valid driver's license required (held 2+ years)",
    "Minimum age 25",
    "Credit card for security deposit",
  ],
  addOns: [
    {
      id: "gps",
      label: "GPS navigation",
      description: "Turn-by-turn navigation device",
      pricePerDay: 8,
    },
    {
      id: "child-seat",
      label: "Child seat",
      description: "Infant or booster seat",
      pricePerDay: 12,
    },
    {
      id: "extra-driver",
      label: "Additional driver",
      description: "Add one authorized driver",
      pricePerDay: 15,
    },
  ],
};

export const CHAUFFEUR_CONFIG: ServiceConfig = {
  type: "chauffeur",
  title: "Chauffeur-Driven Service",
  subtitle: "Professional driver — sit back and relax",
  badge: "Premium service",
  rentalDays: 7,
  insurancePerBooking: 49,
  steps: [
    { id: "vehicle", label: "Vehicle", icon: Car },
    { id: "trip", label: "Trip Details", icon: MapPin },
    { id: "personal", label: "Personal Info", icon: User },
    { id: "lease", label: "Lease Agreement", icon: ScrollText },
    { id: "payment", label: "Payment", icon: CreditCard },
    { id: "review", label: "Review", icon: Check },
  ],
  features: [
    "Licensed professional chauffeur",
    "Door-to-door pickup & drop-off",
    "Flight monitoring for airport transfers",
    "Complimentary bottled water",
  ],
  requirements: [
    "Valid government-issued ID only (passport or national ID)",
    "Driver's license not required — chauffeur operates the vehicle",
    "Passenger count within vehicle capacity",
  ],
  chauffeurTiers: [
    {
      id: "standard",
      label: "Standard Chauffeur",
      description: "Experienced driver for daily travel and airport runs",
      feePerDay: 95,
      highlights: ["5+ years experience", "Business attire", "Local route expertise"],
    },
    {
      id: "premium",
      label: "Premium Chauffeur",
      description: "Top-rated driver for executive and luxury service",
      feePerDay: 145,
      highlights: ["8+ years experience", "Luxury protocol training", "Priority scheduling"],
    },
  ],
};

export const SERVICE_CONFIGS: Record<ServiceType, ServiceConfig> = {
  "self-drive": SELF_DRIVE_CONFIG,
  chauffeur: CHAUFFEUR_CONFIG,
};

export function getServiceConfig(type: ServiceType): ServiceConfig {
  return SERVICE_CONFIGS[type];
}

export function parseServiceType(value: string | null): ServiceType | null {
  if (value === "self-drive" || value === "chauffeur") return value;
  return null;
}

export function calculateBookingTotal(
  config: ServiceConfig,
  vehiclePricePerDay: number,
  options: {
    selectedAddOns?: string[];
    chauffeurTierId?: string;
  }
): { subtotal: number; extras: number; insurance: number; total: number; breakdown: { label: string; amount: number }[] } {
  const days = config.rentalDays;
  const vehicleSubtotal = vehiclePricePerDay * days;
  const breakdown: { label: string; amount: number }[] = [
    { label: `Vehicle (${days} days)`, amount: vehicleSubtotal },
  ];

  let extras = 0;

  if (config.type === "self-drive" && config.addOns && options.selectedAddOns?.length) {
    for (const addOnId of options.selectedAddOns) {
      const addOn = config.addOns.find((a) => a.id === addOnId);
      if (addOn) {
        const amount = addOn.pricePerDay * days;
        extras += amount;
        breakdown.push({ label: addOn.label, amount });
      }
    }
  }

  if (config.type === "chauffeur" && config.chauffeurTiers && options.chauffeurTierId) {
    const tier = config.chauffeurTiers.find((t) => t.id === options.chauffeurTierId);
    if (tier) {
      const amount = tier.feePerDay * days;
      extras += amount;
      breakdown.push({ label: tier.label, amount });
    }
  }

  const insurance = config.insurancePerBooking;
  breakdown.push({ label: "Insurance & protection", amount: insurance });

  const total = vehicleSubtotal + extras + insurance;
  return { subtotal: vehicleSubtotal, extras, insurance, total, breakdown };
}

/** Shield icon used in service selector cards */
export { Shield };
