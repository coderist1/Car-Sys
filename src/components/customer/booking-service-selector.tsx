"use client";

import { Car, Shield, UserCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  CHAUFFEUR_CONFIG,
  SELF_DRIVE_CONFIG,
  type ServiceType,
} from "@/lib/booking-service-config";

type Props = {
  selected: ServiceType | null;
  onSelect: (type: ServiceType) => void;
};

export function BookingServiceSelector({ selected, onSelect }: Props) {
  const options = [
    {
      type: "self-drive" as const,
      config: SELF_DRIVE_CONFIG,
      icon: Car,
    },
    {
      type: "chauffeur" as const,
      config: CHAUFFEUR_CONFIG,
      icon: UserCircle,
    },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-foreground">Choose Driver Option</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Self-drive (you drive) or chauffeur-driven — each path has its own booking steps.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {options.map(({ type, config, icon: Icon }) => {
          const isSelected = selected === type;
          return (
            <button
              key={type}
              type="button"
              onClick={() => onSelect(type)}
              className={cn(
                "flex flex-col rounded-2xl border-2 p-5 text-left transition cursor-pointer",
                isSelected
                  ? "border-cta bg-cta/5 shadow-md"
                  : "border-border bg-card hover:border-cta/40"
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-xl",
                    isSelected ? "bg-cta text-white" : "bg-muted text-muted-foreground"
                  )}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <span
                  className={cn(
                    "rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                    isSelected ? "bg-cta text-white" : "bg-muted text-muted-foreground"
                  )}
                >
                  {config.badge}
                </span>
              </div>
              <h3 className="mt-4 font-bold text-foreground">{config.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{config.subtitle}</p>
              <ul className="mt-4 space-y-1.5">
                {config.features.slice(0, 3).map((f) => (
                  <li key={f} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <Shield className="h-3.5 w-3.5 shrink-0 text-cta mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs font-medium text-cta">
                {config.steps.length} steps · {config.steps.map((s) => s.label).join(" → ")}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
