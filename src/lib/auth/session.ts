import type { UserRole } from "@/lib/db/types";

export type AuthSession = {
  userId: number;
  email: string;
  role: UserRole;
  displayName: string;
  /** Driver portal: assigned driver_details id */
  driverId?: number;
};

const STORAGE_KEY = "brilliant_gem_session";

export function getSession(): AuthSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthSession;
  } catch {
    return null;
  }
}

export function setSession(session: AuthSession): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function clearSession(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function getPostLoginPath(session: AuthSession): string {
  if (session.driverId) return "/driver/trips";
  if (session.role === "admin" || session.role === "manager" || session.role === "staff") {
    return "/admin";
  }
  return "/dashboard";
}
