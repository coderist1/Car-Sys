import { customers, staffInfo, users } from "@/lib/db/mock-data";
import type { AuthSession } from "@/lib/auth/session";
import type { UserRole } from "@/lib/db/types";

const ROLE_PASSWORDS: Record<UserRole, string> = {
  admin: "admin123",
  manager: "admin123",
  staff: "admin123",
  customer: "customer123",
};

export type AuthResult =
  | { success: true; session: AuthSession }
  | { success: false; error: string };

export function authenticate(email: string, password: string): AuthResult {
  const normalized = email.trim().toLowerCase();
  if (!normalized || !password) {
    return { success: false, error: "Email and password are required." };
  }

  const user = users.find((u) => u.email.toLowerCase() === normalized);
  if (!user) {
    return { success: false, error: "Invalid email or password." };
  }

  if (!user.is_active) {
    return { success: false, error: "This account is inactive. Contact support." };
  }

  const expected = ROLE_PASSWORDS[user.role];
  if (password !== expected) {
    return { success: false, error: "Invalid email or password." };
  }

  if (user.role === "customer") {
    const customer = customers.find((c) => c.user_id === user.user_id);
    if (customer?.is_suspended) {
      return { success: false, error: "Your account is suspended. Contact support." };
    }
  }

  const driverPortalEmail = "jennifer.walsh@fleetpro.io";
  const staff = staffInfo.find((s) => s.user_id === user.user_id);
  const customer = customers.find((c) => c.user_id === user.user_id);
  const displayName =
    normalized === driverPortalEmail
      ? "Jennifer Walsh"
      : (staff?.fullName ?? customer?.customerFullName ?? user.email.split("@")[0]);

  return {
    success: true,
    session: {
      userId: user.user_id,
      email: user.email,
      role: user.role,
      displayName,
      driverId: normalized === driverPortalEmail ? 2 : undefined,
    },
  };
}

export type RegisterInput = {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
};

const registeredCustomers: { user: (typeof users)[0]; customer: (typeof customers)[0] }[] = [];

export function registerCustomer(input: RegisterInput): AuthResult {
  const normalized = input.email.trim().toLowerCase();
  if (!normalized || !input.password || !input.fullName.trim()) {
    return { success: false, error: "All fields are required." };
  }
  if (input.password.length < 8) {
    return { success: false, error: "Password must be at least 8 characters." };
  }
  if (users.some((u) => u.email.toLowerCase() === normalized)) {
    return { success: false, error: "An account with this email already exists." };
  }

  const userId = 900 + registeredCustomers.length + 1;
  const user = {
    user_id: userId,
    email: normalized,
    role: "customer" as const,
    created_at: new Date().toISOString().slice(0, 10),
    is_active: true,
  };
  const customer = {
    user_id: userId,
    customerFullName: input.fullName.trim(),
    address: "",
    driverLicense: "",
    verification_status: "pending" as const,
    is_suspended: false,
    phone: input.phone ?? "",
    email: normalized,
  };
  registeredCustomers.push({ user, customer });
  users.push(user);
  customers.push(customer);

  return {
    success: true,
    session: {
      userId: user.user_id,
      email: user.email,
      role: "customer",
      displayName: customer.customerFullName,
    },
  };
}

/** Demo accounts shown on the login page. */
export const DEMO_ACCOUNTS = [
  { label: "Customer", email: "james.wilson@email.com", password: "customer123" },
  { label: "Admin", email: "admin@fleetpro.io", password: "admin123" },
  { label: "Staff", email: "mike.ops@fleetpro.io", password: "admin123" },
  { label: "Driver", email: "jennifer.walsh@fleetpro.io", password: "admin123" },
] as const;
