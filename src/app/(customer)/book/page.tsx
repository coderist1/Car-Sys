import { Suspense } from "react";
import { BookingFlow } from "@/components/customer/booking-flow";

export default function BookPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <BookingFlow />
    </Suspense>
  );
}
