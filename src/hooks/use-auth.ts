"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession, type AuthSession } from "@/lib/auth/session";

export function useAuth(requireAuth = false) {
  const router = useRouter();
  const [session, setSessionState] = useState<AuthSession | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const current = getSession();
    setSessionState(current);
    setReady(true);
    if (requireAuth && !current) {
      router.replace("/login");
    }
  }, [requireAuth, router]);

  return { session, ready, isLoggedIn: !!session };
}
