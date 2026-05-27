import { Suspense } from "react";
import { DashboardClient } from "@/components/customer/dashboard-client";

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-5xl px-4 py-16 text-center text-muted-foreground">
          Loading…
        </div>
      }
    >
      <DashboardClient />
    </Suspense>
  );
}
