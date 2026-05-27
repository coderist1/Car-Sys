/**
 * Routes and permissions aligned with the Brilliant Gem UML use case diagram.
 */

import type { UserRole } from "@/lib/db/types";

/** Customer actor (UML) */
export const customerUseCases = [
  { id: "login-register", label: "Login / Register", href: "/login" },
  { id: "select-vehicle", label: "Select Vehicle", href: "/vehicles" },
  { id: "make-booking", label: "Make Booking", href: "/book" },
  { id: "choose-driver", label: "Choose Driver Option", href: "/book" },
  { id: "view-status", label: "View Booking Status", href: "/dashboard" },
  { id: "cancel-booking", label: "Cancel Booking", href: "/dashboard?tab=upcoming" },
  { id: "process-payment", label: "Process Payment", href: "/book" },
  { id: "view-payment", label: "View Payment History", href: "/dashboard?tab=payments" },
  { id: "logout", label: "Log Out", href: "/" },
] as const;

/** Unique customer nav (one link per route). */
export const customerNavLinks = [
  { id: "home", label: "Home", href: "/" },
  { id: "select-vehicle", label: "Select Vehicle", href: "/vehicles" },
  { id: "make-booking", label: "Make Booking", href: "/book" },
  { id: "view-status", label: "View Booking Status", href: "/dashboard" },
] as const;

/** Driver actor (UML) */
export const driverUseCases = [
  { id: "login", label: "Login / Register", href: "/login" },
  { id: "view-trips", label: "View Assigned Trips", href: "/driver/trips" },
  { id: "update-status", label: "Update Trip / Fuel Status", href: "/driver/trips" },
  { id: "logout", label: "Log Out", href: "/" },
] as const;

export const driverNavLinks = [
  { id: "view-trips", label: "View Assigned Trips", href: "/driver/trips" },
] as const;

/** Staff actor (UML) — shared admin portal routes */
export const staffUseCaseIds = [
  "login",
  "manage-vehicles",
  "manage-registration",
  "schedule-maintenance",
  "record-fuel",
  "manage-drivers",
  "approve-booking",
  "generate-reports",
  "view-payment-history",
  "process-payment",
  "update-trip-status",
  "logout",
] as const;

/** Admin-only UML use cases */
export const adminOnlyUseCaseIds = ["manage-users", "manage-staff"] as const;

export type AdminNavIcon =
  | "dashboard"
  | "calendar"
  | "payment"
  | "car"
  | "registration"
  | "wrench"
  | "sparkles"
  | "fuel"
  | "trip"
  | "history"
  | "driver"
  | "users"
  | "staff"
  | "customers"
  | "reports";

export type AdminNavItem = {
  id: string;
  label: string;
  href: string;
  icon: AdminNavIcon;
  /** Hidden from staff; admin + manager only */
  adminOnly?: boolean;
};

export type AdminNavGroup = {
  label: string;
  items: AdminNavItem[];
};

/** Admin + Staff sidebar (filtered by role at runtime) */
export const adminNavGroups: AdminNavGroup[] = [
  {
    label: "Overview",
    items: [{ id: "dashboard", label: "Dashboard", href: "/admin", icon: "dashboard" }],
  },
  {
    label: "Bookings",
    items: [
      {
        id: "approve-booking",
        label: "Approve / Manage Booking",
        href: "/admin/reservations",
        icon: "calendar",
      },
      {
        id: "process-payment",
        label: "Process Payment",
        href: "/admin/records",
        icon: "payment",
      },
    ],
  },
  {
    label: "Fleet",
    items: [
      { id: "manage-vehicles", label: "Manage Vehicles", href: "/admin/vehicles", icon: "car" },
      {
        id: "manage-registration",
        label: "Manage Vehicle Registration",
        href: "/admin/vehicles",
        icon: "registration",
      },
    ],
  },
  {
    label: "Maintenance",
    items: [
      {
        id: "schedule-maintenance",
        label: "Schedule Vehicle Maintenance",
        href: "/admin/maintenance",
        icon: "wrench",
      },
      {
        id: "preventive-maintenance",
        label: "Preventive Maintenance",
        href: "/admin/preventive-maintenance",
        icon: "sparkles",
      },
    ],
  },
  {
    label: "Operations",
    items: [
      { id: "record-fuel", label: "Record Fuel", href: "/admin/records", icon: "fuel" },
      {
        id: "update-trip-status",
        label: "Update Trip / Fuel Status",
        href: "/admin/trip-status",
        icon: "trip",
      },
      {
        id: "view-payment-history",
        label: "View Payment History",
        href: "/admin/records",
        icon: "history",
      },
    ],
  },
  {
    label: "People",
    items: [
      {
        id: "manage-drivers",
        label: "Manage Driver Details",
        href: "/admin/drivers",
        icon: "driver",
      },
      {
        id: "manage-users",
        label: "Manage Users",
        href: "/admin/users",
        icon: "users",
        adminOnly: true,
      },
      {
        id: "manage-staff",
        label: "Manage Staff",
        href: "/admin/staff",
        icon: "staff",
        adminOnly: true,
      },
      {
        id: "customers",
        label: "Customers",
        href: "/admin/customers",
        icon: "customers",
      },
    ],
  },
  {
    label: "Reports",
    items: [
      { id: "generate-reports", label: "Generate Reports", href: "/admin/reports", icon: "reports" },
    ],
  },
];

export function getAdminNavGroupsForRole(role: UserRole): AdminNavGroup[] {
  const isAdmin = role === "admin" || role === "manager";
  return adminNavGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => isAdmin || !item.adminOnly),
    }))
    .filter((group) => group.items.length > 0);
}

/** @deprecated Use adminNavGroups */
export const adminUseCaseGroups = adminNavGroups;
