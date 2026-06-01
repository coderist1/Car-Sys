"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import {
  Check,
  CreditCard,
  MapPin,
  Upload,
  Users,
} from "lucide-react";
import { CtaButton } from "@/components/customer/cta-button";
import { BookingServiceSelector } from "@/components/customer/booking-service-selector";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HydrationDateInput } from "@/components/shared/hydration-date-input";
import { BookingConflictAlert } from "@/components/shared/booking-conflict-alert";
import { useAuth } from "@/hooks/use-auth";
import { useBookingConflicts } from "@/hooks/use-booking-conflicts";
import { tryCreateBooking } from "@/lib/booking/booking-registry";
import { getConflictsBlockingStep } from "@/lib/booking/conflict-detection";
import { cn } from "@/lib/utils";
import { LeaseAgreement } from "@/components/customer/lease-agreement";
import { getCustomerVehicle } from "@/lib/customer-vehicles";
import { useDataStoreVersion } from "@/hooks/use-data-store";
import {
  calculateBookingTotal,
  getServiceConfig,
  parseServiceType,
  type BookingStepId,
  type ServiceType,
} from "@/lib/booking-service-config";

const INITIAL_FORM = {
  fullName: "",
  email: "",
  phone: "",
  license: "",
  payment: "card" as "card" | "paypal" | "gcash",
  promo: "",
  pickupLocation: "Miami International Airport",
  dropoffLocation: "",
  pickupDate: "2026-06-01",
  returnDate: "2026-06-07",
  pickupTime: "10:00",
  passengers: "2",
  chauffeurTierId: "standard",
  preferredDriverId: "",
  specialRequests: "",
  selectedAddOns: [] as string[],
  leaseAgreed: false,
};

export function BookingFlow() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const vehicleId = Number(searchParams.get("vehicle") ?? 2);
  const storeVersion = useDataStoreVersion();
  const vehicle = useMemo(
    () => getCustomerVehicle(vehicleId),
    [vehicleId, storeVersion]
  );

  const initialService = parseServiceType(searchParams.get("service"));
  const [serviceType, setServiceType] = useState<ServiceType | null>(initialService);
  const [stepIndex, setStepIndex] = useState(0);
  const [form, setForm] = useState(INITIAL_FORM);
  const [confirmError, setConfirmError] = useState<string | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const { session } = useAuth();

  const config = serviceType ? getServiceConfig(serviceType) : null;
  const steps = config?.steps ?? [];
  const currentStep = steps[stepIndex];
  const pricing = useMemo(() => {
    if (!vehicle || !config) return null;
    return calculateBookingTotal(config, vehicle.pricePerDay, {
      selectedAddOns: form.selectedAddOns,
      chauffeurTierId: form.chauffeurTierId,
    });
  }, [vehicle, config, form.selectedAddOns, form.chauffeurTierId]);

  const bookingDraft = useMemo(() => {
    if (!vehicle) return null;
    return {
      vehicle_id: vehicle.vehicle_id,
      customer_user_id: session?.userId ?? 0,
      driver_id:
        serviceType === "chauffeur" && form.preferredDriverId
          ? Number(form.preferredDriverId)
          : undefined,
      pickup_date: form.pickupDate,
      return_date: form.returnDate,
      status: "pending" as const,
    };
  }, [vehicle, session, serviceType, form.preferredDriverId, form.pickupDate, form.returnDate]);

  const { conflicts: bookingConflicts } = useBookingConflicts(bookingDraft);
  const blockingConflicts = getConflictsBlockingStep(
    bookingConflicts,
    currentStep?.id ?? "vehicle"
  );
  const hasBlockingConflict = blockingConflicts.length > 0;
  const mustAcceptLease = currentStep?.id === "lease" && !form.leaseAgreed;

  useEffect(() => {
    setConfirmError(null);
  }, [bookingDraft, form.pickupDate, form.returnDate, vehicleId]);

  const toggleAddOn = useCallback((id: string) => {
    setForm((f) => ({
      ...f,
      selectedAddOns: f.selectedAddOns.includes(id)
        ? f.selectedAddOns.filter((x) => x !== id)
        : [...f.selectedAddOns, id],
    }));
  }, []);

  if (!vehicle) {
    return <p className="p-8 text-center">Vehicle not found.</p>;
  }

  const selectService = (type: ServiceType) => {
    setServiceType(type);
    setStepIndex(0);
    setForm({ ...INITIAL_FORM });
  };

  const next = () => setStepIndex((i) => Math.min(steps.length - 1, i + 1));
  const back = () => {
    if (stepIndex === 0) {
      setServiceType(null);
      return;
    }
    const prevIndex = Math.max(0, stepIndex - 1);
    const leavingLease = steps[stepIndex]?.id === "lease";
    setStepIndex(prevIndex);
    if (leavingLease) {
      setForm((f) => ({ ...f, leaseAgreed: false }));
    }
  };

  const confirm = async () => {
    if (
      !pricing ||
      !serviceType ||
      !vehicle ||
      !bookingDraft ||
      getConflictsBlockingStep(bookingConflicts, "review").length > 0
    ) {
      return;
    }

    if (!session?.userId) {
      setConfirmError("Please sign in to complete your booking.");
      return;
    }

    setIsConfirming(true);
    setConfirmError(null);

    const result = await tryCreateBooking({
      ...bookingDraft,
      customer_user_id: session.userId,
      total_amount: pricing.total,
      payment_method: form.payment,
    });

    setIsConfirming(false);

    if (!result.success) {
      setConfirmError(result.message);
      return;
    }

    const params = new URLSearchParams({
      id: `BG-${result.booking.booking_id}`,
      total: String(pricing.total),
      service: serviceType,
    });
    router.push(`/book/confirmation?${params.toString()}`);
  };

  if (!serviceType || !config || !currentStep) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <BookingServiceSelector selected={serviceType} onSelect={selectService} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <span className="rounded-full bg-cta/10 px-3 py-1 text-xs font-semibold text-cta">
          {config.title}
        </span>
        <button
          type="button"
          onClick={() => setServiceType(null)}
          className="text-xs font-medium text-muted-foreground hover:text-cta"
        >
          Change service type
        </button>
      </div>

      <div className="mb-8 flex justify-between gap-2 overflow-x-auto pb-2">
        {steps.map((s, i) => (
          <div
            key={s.id}
            className={cn(
              "flex min-w-[64px] flex-1 flex-col items-center gap-1 text-center",
              stepIndex >= i ? "text-cta" : "text-muted-foreground"
            )}
          >
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-semibold",
                stepIndex >= i ? "border-cta bg-cta text-white" : "border-border bg-card"
              )}
            >
              {stepIndex > i ? <Check className="h-5 w-5" /> : i + 1}
            </div>
            <span className="text-[10px] sm:text-xs font-medium">{s.label}</span>
          </div>
        ))}
      </div>

      <Card className="rounded-2xl shadow-soft border-0 overflow-hidden">
        <div className="relative h-40 bg-[#111827] sm:h-48">
          <Image src={vehicle.image} alt="" fill sizes="(max-width: 640px) calc(100vw - 2rem), (max-width: 768px) calc(100vw - 3rem), 768px" className="object-cover opacity-60" />
          <div className="absolute bottom-4 left-4 text-white">
            <p className="font-bold text-lg">
              {vehicle.brand} {vehicle.model}
            </p>
            <p className="text-sm text-white/80">
              ${vehicle.pricePerDay}/day · {config.title}
            </p>
          </div>
        </div>
        <CardContent className="p-6 sm:p-8 space-y-6">
          <StepContent
            stepId={currentStep.id}
            config={config}
            vehicle={vehicle}
            form={form}
            setForm={setForm}
            toggleAddOn={toggleAddOn}
            pricing={pricing}
          />

          {blockingConflicts.length > 0 && (
            <BookingConflictAlert conflicts={blockingConflicts} />
          )}
          {confirmError && (
            <p className="text-sm text-destructive" role="alert">
              {confirmError}
            </p>
          )}

          <div className="flex flex-col-reverse gap-3 pt-4 sm:flex-row sm:justify-between">
            <CtaButton variant="outline" onClick={back} className="w-full sm:w-auto">
              Back
            </CtaButton>
            {stepIndex < steps.length - 1 ? (
              <CtaButton
                onClick={next}
                className="w-full sm:w-auto sm:ml-auto"
                disabled={hasBlockingConflict || mustAcceptLease}
              >
                Continue
              </CtaButton>
            ) : (
              <CtaButton
                onClick={confirm}
                className="w-full sm:w-auto sm:ml-auto"
                disabled={
                  getConflictsBlockingStep(bookingConflicts, "review").length > 0 ||
                  isConfirming
                }
              >
                {isConfirming ? "Reserving…" : "Confirm Booking"}
              </CtaButton>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StepContent({
  stepId,
  config,
  vehicle,
  form,
  setForm,
  toggleAddOn,
  pricing,
}: {
  stepId: BookingStepId;
  config: ReturnType<typeof getServiceConfig>;
  vehicle: NonNullable<ReturnType<typeof getCustomerVehicle>>;
  form: typeof INITIAL_FORM;
  setForm: React.Dispatch<React.SetStateAction<typeof INITIAL_FORM>>;
  toggleAddOn: (id: string) => void;
  pricing: ReturnType<typeof calculateBookingTotal> | null;
}) {
  switch (stepId) {
    case "vehicle":
      return (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-foreground">Selected Vehicle</h2>
          <p className="text-sm text-muted-foreground">
            {vehicle.type} · {vehicle.transmission} · {vehicle.capacity} seats
          </p>
          {config.type === "self-drive" && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Pickup date</Label>
                <HydrationDateInput
                  className="h-11 rounded-xl"
                  value={form.pickupDate}
                  onChange={(e) => setForm({ ...form, pickupDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Return date</Label>
                <HydrationDateInput
                  className="h-11 rounded-xl"
                  value={form.returnDate}
                  onChange={(e) => setForm({ ...form, returnDate: e.target.value })}
                />
              </div>
            </div>
          )}
          <div className="rounded-xl border border-border/60 bg-muted/30 p-4 space-y-2">
            <p className="text-sm font-semibold text-foreground">Included with {config.title}</p>
            <ul className="space-y-1">
              {config.features.map((f) => (
                <li key={f} className="text-xs text-muted-foreground flex gap-2">
                  <Check className="h-3.5 w-3.5 text-cta shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
          {config.type === "self-drive" && config.addOns && (
            <div className="space-y-3">
              <p className="text-sm font-semibold text-foreground">Optional add-ons</p>
              {config.addOns.map((addOn) => (
                <button
                  key={addOn.id}
                  type="button"
                  onClick={() => toggleAddOn(addOn.id)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-xl border-2 p-3 text-left transition cursor-pointer",
                    form.selectedAddOns.includes(addOn.id)
                      ? "border-cta bg-cta/5"
                      : "border-border"
                  )}
                >
                  <div>
                    <p className="font-medium text-sm">{addOn.label}</p>
                    <p className="text-xs text-muted-foreground">{addOn.description}</p>
                  </div>
                  <span className="text-sm font-semibold text-cta">
                    +${addOn.pricePerDay}/day
                  </span>
                </button>
              ))}
            </div>
          )}
          {config.type === "chauffeur" && (
            <div className="rounded-xl border border-cta/20 bg-cta/5 px-3 py-2 text-sm text-foreground">
              <strong>ID only:</strong> chauffeur service requires a valid government-issued ID — not
              a driver&apos;s license.
            </div>
          )}
        </div>
      );

    case "trip":
      return (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-foreground">Trip Details</h2>
          <p className="text-sm text-muted-foreground">
            Door-to-door chauffeur service — tell us where to pick you up.
          </p>
          <div className="space-y-2">
            <Label>Pickup location</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="h-11 rounded-xl pl-9"
                value={form.pickupLocation}
                onChange={(e) => setForm({ ...form, pickupLocation: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Drop-off location</Label>
            <Input
              className="h-11 rounded-xl"
              placeholder="Same as pickup or different address"
              value={form.dropoffLocation}
              onChange={(e) => setForm({ ...form, dropoffLocation: e.target.value })}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Pickup date</Label>
              <HydrationDateInput
                className="h-11 rounded-xl"
                value={form.pickupDate}
                onChange={(e) => setForm({ ...form, pickupDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Pickup time</Label>
              <Input
                type="time"
                className="h-11 rounded-xl"
                value={form.pickupTime}
                onChange={(e) => setForm({ ...form, pickupTime: e.target.value })}
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Return date</Label>
              <HydrationDateInput
                className="h-11 rounded-xl"
                value={form.returnDate}
                onChange={(e) => setForm({ ...form, returnDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Passengers</Label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="number"
                  min={1}
                  max={vehicle.capacity}
                  className="h-11 rounded-xl pl-9"
                  value={form.passengers}
                  onChange={(e) => setForm({ ...form, passengers: e.target.value })}
                />
              </div>
            </div>
          </div>
        </div>
      );

    case "personal":
      return (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-foreground">Personal Info</h2>
          {config.type === "self-drive" && (
            <p className="text-xs text-muted-foreground rounded-lg bg-muted/50 p-3">
              Primary driver details — must match your valid driver&apos;s license.
            </p>
          )}
          {config.type === "chauffeur" && (
            <p className="text-xs text-muted-foreground rounded-lg bg-muted/50 p-3">
              A valid government-issued ID is required. A driver&apos;s license is not needed for
              chauffeur-driven service.
            </p>
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label>Full name</Label>
              <Input
                className="h-11 rounded-xl"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                className="h-11 rounded-xl"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input
                className="h-11 rounded-xl"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
          </div>
        </div>
      );

    case "license":
      return (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-foreground">Driver&apos;s License</h2>
          <p className="text-sm text-muted-foreground">
            Self-drive rentals require a valid driver&apos;s license. Upload yours and enter your
            license number below.
          </p>
          <ul className="text-xs text-muted-foreground space-y-1 rounded-lg border border-border/60 p-3">
            {config.requirements.map((r) => (
              <li key={r}>• {r}</li>
            ))}
          </ul>
          <Label>Upload driver&apos;s license</Label>
          <div className="flex min-h-[140px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-muted/30 p-6 hover:border-cta">
            <Upload className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">Tap to upload or drag & drop</p>
          </div>
          <Input
            placeholder="License number"
            className="h-11 rounded-xl"
            value={form.license}
            onChange={(e) => setForm({ ...form, license: e.target.value })}
          />
        </div>
      );

    case "lease":
      return (
        <LeaseAgreement
          serviceType={config.type}
          vehicle={vehicle}
          lesseeName={form.fullName}
          lesseeEmail={form.email}
          licenseNumber={form.license}
          pickupDate={form.pickupDate}
          returnDate={form.returnDate}
          pickupLocation={form.pickupLocation}
          totalAmount={pricing?.total ?? 0}
          agreed={form.leaseAgreed}
          onAgreedChange={(leaseAgreed) => setForm({ ...form, leaseAgreed })}
        />
      );

    case "payment":
      return (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-foreground">Payment</h2>
          {pricing && (
            <div className="rounded-xl bg-muted/40 p-4 space-y-2 text-sm">
              {pricing.breakdown.map((line) => (
                <div key={line.label} className="flex justify-between">
                  <span className="text-muted-foreground">{line.label}</span>
                  <span>${line.amount}</span>
                </div>
              ))}
              <div className="flex justify-between font-bold text-foreground pt-2 border-t">
                <span>Total</span>
                <span className="text-cta">${pricing.total}</span>
              </div>
            </div>
          )}
          <div className="space-y-2">
            <Label>Promo code</Label>
            <Input
              placeholder="Enter code"
              className="h-11 rounded-xl"
              value={form.promo}
              onChange={(e) => setForm({ ...form, promo: e.target.value })}
            />
          </div>
          {(["card", "paypal", "gcash"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setForm({ ...form, payment: m })}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl border-2 p-4 text-left transition cursor-pointer",
                form.payment === m ? "border-cta bg-cta/5" : "border-border"
              )}
            >
              <CreditCard className="h-5 w-5 text-foreground" />
              <span className="font-medium capitalize text-foreground">
                {m === "card" ? "Credit / Debit Card" : m === "paypal" ? "PayPal" : "GCash"}
              </span>
            </button>
          ))}
        </div>
      );

    case "review":
      return (
        <div className="space-y-3 text-sm">
          <h2 className="text-xl font-bold text-foreground mb-4">Review Booking</h2>
          <Row label="Service" value={config.title} />
          <Row label="Vehicle" value={`${vehicle.brand} ${vehicle.model}`} />
          {config.type === "chauffeur" && (
            <>
              <Row label="Pickup" value={form.pickupLocation} />
              <Row
                label="Drop-off"
                value={form.dropoffLocation || "Same as pickup"}
              />
              <Row
                label="Schedule"
                value={`${form.pickupDate} ${form.pickupTime} → ${form.returnDate}`}
              />
              <Row
                label="Lease agreement"
                value={form.leaseAgreed ? "Accepted" : "Not accepted"}
              />
            </>
          )}
          {config.type === "self-drive" && (
            <>
              <Row
                label="Rental dates"
                value={`${form.pickupDate} → ${form.returnDate}`}
              />
              <Row
                label="Lease agreement"
                value={form.leaseAgreed ? "Accepted" : "Not accepted"}
              />
            </>
          )}
          {config.type === "self-drive" && form.selectedAddOns.length > 0 && (
            <Row
              label="Add-ons"
              value={form.selectedAddOns
                .map((id) => config.addOns?.find((a) => a.id === id)?.label)
                .filter(Boolean)
                .join(", ")}
            />
          )}
          {config.type === "self-drive" && (
            <Row label="License" value={form.license || "Uploaded"} />
          )}
          <Row label="Customer" value={form.fullName || "—"} />
          <Row label="Payment" value={form.payment} />
          <Row label="Total" value={`$${pricing?.total ?? 0}`} bold />
        </div>
      );

    default:
      return null;
  }
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div
      className={cn(
        "flex justify-between gap-4",
        bold && "text-lg font-bold text-foreground pt-2 border-t"
      )}
    >
      <span className="text-muted-foreground shrink-0">{label}</span>
      <span className={cn("capitalize text-right", bold && "text-cta")}>{value}</span>
    </div>
  );
}
