"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { getPostLoginPath } from "@/lib/auth/session";

export function DriverGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { session, ready } = useAuth(true);

  useEffect(() => {
    if (!ready || !session) return;
    if (!session.driverId) {
      router.replace(getPostLoginPath(session));
    }
  }, [ready, session, router]);

  if (!ready || !session?.driverId) {
    return (
      <div className="flex flex-1 items-center justify-center p-12 text-muted-foreground">
        Loading…
      </div>
    );
  }

  return children;
}
