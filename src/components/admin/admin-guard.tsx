"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import {
  canAccessAdminPath,
  canAccessAdminPortal,
  getActor,
} from "@/lib/auth/permissions";
import { getPostLoginPath } from "@/lib/auth/session";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { session, ready } = useAuth(true);

  useEffect(() => {
    if (!ready || !session) return;

    if (!canAccessAdminPortal(session)) {
      router.replace(getPostLoginPath(session));
      return;
    }

    if (!canAccessAdminPath(session, pathname)) {
      router.replace("/admin");
    }
  }, [ready, session, pathname, router]);

  if (!ready || !session) {
    return (
      <div className="flex flex-1 items-center justify-center p-12 text-muted-foreground">
        Loading…
      </div>
    );
  }

  if (!canAccessAdminPortal(session)) {
    return null;
  }

  if (!canAccessAdminPath(session, pathname)) {
    return null;
  }

  const actor = getActor(session);

  return (
    <>
      {actor === "staff" && (
        <p className="sr-only" data-portal-role="staff">
          Staff portal
        </p>
      )}
      {children}
    </>
  );
}
