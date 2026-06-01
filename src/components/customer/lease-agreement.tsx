"use client";

import { ScrollText } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type { ServiceType } from "@/lib/booking-service-config";
import type { CustomerVehicle } from "@/lib/customer-vehicles";
import { formatDateOnly } from "@/lib/format-date";

type LeaseAgreementProps = {
  serviceType: ServiceType;
  vehicle: CustomerVehicle;
  lesseeName: string;
  lesseeEmail: string;
  licenseNumber?: string;
  pickupDate: string;
  returnDate: string;
  pickupLocation: string;
  totalAmount: number;
  agreed: boolean;
  onAgreedChange: (agreed: boolean) => void;
};

export function LeaseAgreement({
  serviceType,
  vehicle,
  lesseeName,
  lesseeEmail,
  licenseNumber,
  pickupDate,
  returnDate,
  pickupLocation,
  totalAmount,
  agreed,
  onAgreedChange,
}: LeaseAgreementProps) {
  const isSelfDrive = serviceType === "self-drive";
  const lessee = lesseeName.trim() || "[Lessee name]";
  const effectiveDate = formatDateOnly(new Date().toISOString().slice(0, 10), "MMMM d, yyyy");
  const checkboxId = `lease-agree-${serviceType}`;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <ScrollText className="h-5 w-5 text-cta shrink-0" />
        <h2 className="text-xl font-bold text-foreground">Contract of Lease — Motor Vehicle</h2>
      </div>
      <p className="text-sm text-muted-foreground">
        Please read the agreement below. You must accept before continuing to payment.
      </p>

      <div className="max-h-[min(420px,50vh)] overflow-y-auto rounded-xl border border-border/60 bg-muted/20 p-4 sm:p-5 text-sm text-foreground leading-relaxed space-y-4">
        <p className="text-center font-semibold uppercase tracking-wide text-xs text-muted-foreground">
          Contract of Lease of Motor Vehicle —{" "}
          {isSelfDrive ? "Self-Drive Rental" : "Chauffeur-Driven Rental"}
        </p>

        <p>
          This Contract of Lease of Motor Vehicle (&quot;Agreement&quot;) is entered into on{" "}
          <strong>{effectiveDate}</strong>, by and between:
        </p>

        <div className="space-y-2 pl-2 border-l-2 border-cta/40">
          <p>
            <strong>LESSOR:</strong> iDriveCDO Car Rental (&quot;iDriveCDO&quot;), a car rental
            operator engaged in the business of leasing motor vehicles to qualified lessees in
            Cagayan de Oro and surrounding areas.
          </p>
          <p>
            <strong>LESSEE:</strong> {lessee}
            {lesseeEmail.trim() ? ` (${lesseeEmail.trim()})` : ""}, an individual of legal age
            and capacity to contract.
          </p>
        </div>

        <p className="font-semibold">1. Subject of the Lease</p>
        <p>
          The Lessor hereby leases to the Lessee, and the Lessee hereby accepts on lease, the
          following motor vehicle under a{" "}
          <strong>{isSelfDrive ? "self-drive" : "chauffeur-driven"}</strong> arrangement:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            <strong>Vehicle:</strong> {vehicle.brand} {vehicle.model} ({vehicle.type})
          </li>
          <li>
            <strong>Transmission:</strong> {vehicle.transmission} · <strong>Capacity:</strong>{" "}
            {vehicle.capacity} passengers
          </li>
          <li>
            <strong>Service:</strong>{" "}
            {isSelfDrive
              ? "Self-drive rental — Lessee is the authorized operator of the vehicle"
              : "Chauffeur-driven rental — professional driver provided by iDriveCDO"}
          </li>
          {isSelfDrive && licenseNumber?.trim() && (
            <li>
              <strong>Driver&apos;s license (Lessee):</strong> {licenseNumber.trim()}
            </li>
          )}
        </ul>

        <p className="font-semibold">2. Term of Lease</p>
        <p>
          The lease period shall commence on{" "}
          <strong>{formatDateOnly(pickupDate, "MMMM d, yyyy")}</strong> and end on{" "}
          <strong>{formatDateOnly(returnDate, "MMMM d, yyyy")}</strong>, unless extended in writing
          by both parties or terminated earlier as provided herein.
        </p>

        <p className="font-semibold">3. Pickup, Return, and Use</p>
        <p>
          {isSelfDrive ? (
            <>
              Pickup and return at iDriveCDO designated locations or as stated in the booking
              confirmation. The Lessee shall operate the vehicle only for lawful personal or
              business use within the Philippines and agreed service area, in compliance with all
              traffic laws. The Lessee must hold a valid driver&apos;s license (minimum 2 years held,
              age 25+) matching the vehicle class.
            </>
          ) : (
            <>
              Primary pickup location:{" "}
              <strong>{pickupLocation || "As specified in booking"}</strong>. The Lessee shall use
              the vehicle only for lawful personal or business transportation within the agreed
              service area. The Lessee shall not operate the vehicle; operation remains the sole
              responsibility of the Lessor&apos;s licensed chauffeur.
            </>
          )}
        </p>

        <p className="font-semibold">4. Rental Consideration</p>
        <p>
          Total lease consideration for the term:{" "}
          <strong>${totalAmount.toLocaleString()} USD</strong> (inclusive of vehicle rental
          {isSelfDrive ? ", optional add-ons," : ", chauffeur service,"} and insurance package as
          quoted), payable upon confirmation of this booking subject to Lessor approval.
        </p>

        <p className="font-semibold">5. Lessee Obligations</p>
        <ul className="list-disc pl-5 space-y-1">
          {isSelfDrive ? (
            <>
              <li>Present valid government-issued ID and driver&apos;s license at pickup.</li>
              <li>Return the vehicle on time, in substantially the same condition, fuel level per policy.</li>
            </>
          ) : (
            <>
              <li>Present valid government-issued identification at pickup.</li>
              <li>Ensure passenger count does not exceed vehicle capacity.</li>
            </>
          )}
          <li>Report accidents, theft, or mechanical issues to iDriveCDO immediately.</li>
          <li>Do not smoke in the vehicle unless permitted; no illegal cargo or passengers over capacity.</li>
          {!isSelfDrive && <li>Treat the chauffeur with reasonable care and respect.</li>}
        </ul>

        <p className="font-semibold">6. Lessor Obligations</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Provide a roadworthy, registered, and insured vehicle at the agreed pickup time.</li>
          <li>Maintain comprehensive insurance coverage as stated in the booking summary.</li>
          {!isSelfDrive && (
            <li>Provide a licensed, professional chauffeur for the duration of the lease.</li>
          )}
          {isSelfDrive && <li>Provide 24/7 roadside assistance per the rental package.</li>}
        </ul>

        <p className="font-semibold">7. Prohibited Acts</p>
        <p>
          The Lessee shall not sublease the vehicle, use it for racing, off-road use (unless
          authorized), illegal activity, or permit unauthorized drivers{isSelfDrive ? "" : " to operate the vehicle"}
          . Self-drive Lessees must not allow unlisted drivers except as covered by an authorized
          additional-driver add-on.
        </p>

        <p className="font-semibold">8. Security Deposit and Damage</p>
        <p>
          A security deposit may be required by credit card at pickup. The Lessee is responsible
          for damage, loss, fines, and tolls arising during the lease term, subject to insurance
          terms and deductible.
        </p>

        <p className="font-semibold">9. Cancellation and Default</p>
        <p>
          Cancellations are subject to iDriveCDO&apos;s cancellation policy. Failure to pay, fraud,
          or material breach may result in cancellation and forfeiture of fees as permitted by law.
        </p>

        <p className="font-semibold">10. Limitation of Liability</p>
        <p>
          Except where prohibited by law, iDriveCDO&apos;s liability is limited to direct damages
          arising from proven negligence, and shall not exceed the rental fees paid for the
          affected period.
        </p>

        <p className="font-semibold">11. Governing Law</p>
        <p>
          This Agreement shall be governed by the laws of the Republic of the Philippines. Any
          dispute shall be brought before the proper courts of Cagayan de Oro City.
        </p>

        <p className="font-semibold">12. Entire Agreement</p>
        <p>
          This document, together with the booking confirmation and payment receipt, constitutes
          the entire agreement between the parties. Electronic acceptance via the iDriveCDO
          platform is binding upon the Lessee.
        </p>

        <p className="text-xs text-muted-foreground pt-2 border-t border-border/40">
          By checking the box below, the Lessee acknowledges that they have read, understood, and
          agree to be bound by this Contract of Lease of Motor Vehicle.
        </p>
      </div>

      <div className="flex items-start gap-3 rounded-xl border-2 border-border p-4 has-[[data-state=checked]]:border-cta has-[[data-state=checked]]:bg-cta/5">
        <Checkbox
          id={checkboxId}
          checked={agreed}
          onCheckedChange={(v) => onAgreedChange(v === true)}
        />
        <Label htmlFor={checkboxId} className="text-sm font-medium leading-snug cursor-pointer">
          I have read and agree to the Contract of Lease of Motor Vehicle, and I authorize
          iDriveCDO to process my booking upon approval.
        </Label>
      </div>
    </div>
  );
}
