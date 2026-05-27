import type { AuthSession } from "@/lib/auth/session";
import type { UserRole } from "@/lib/db/types";

/** UML actors */
export type Actor = "admin" | "staff" | "customer" | "driver";

export function getActor(session: AuthSession): Actor {
  if (session.driverId) return "driver";
  if (session.role === "customer") return "customer";
  if (session.role === "admin" || session.role === "manager") return "admin";
  return "staff";
}

export function isAdminActor(session: AuthSession): boolean {
  return getActor(session) === "admin";
}

export function canAccessAdminPortal(session: AuthSession): boolean {
  const actor = getActor(session);
  return actor === "admin" || actor === "staff";
}

/** Admin-only UML use cases: Manage Users, Manage Staff */
const ADMIN_ONLY_PREFIXES = ["/admin/users", "/admin/staff"];

export function canAccessAdminPath(session: AuthSession, pathname: string): boolean {
  if (!canAccessAdminPortal(session)) return false;
  if (isAdminActor(session)) return true;
  return !ADMIN_ONLY_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export function getAdminPortalRoles(): UserRole[] {
  return ["admin", "manager", "staff"];
}
