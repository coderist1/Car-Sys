"use client";

import { ClientOnly } from "@/components/shared/client-only";
import { Skeleton } from "@/components/ui/skeleton";

export function ChartShell({
  children,
  className = "h-[280px] w-full",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <ClientOnly
      fallback={<Skeleton className={className} />}
    >
      {children}
    </ClientOnly>
  );
}
