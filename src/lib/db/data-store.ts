import {
  bookings as seedBookings,
  customers as seedCustomers,
  drivers as seedDrivers,
  fuelRecords as seedFuel,
  maintenanceRecords as seedMaintenance,
  payments as seedPayments,
  staffInfo as seedStaff,
  users as seedUsers,
  vehicleRegDetails as seedRegs,
  vehicles as seedVehicles,
} from "@/lib/db/mock-data";
import type {
  Booking,
  CustomerInfo,
  DriverDetails,
  FuelRecord,
  Payment,
  StaffInfo,
  User,
  UserRole,
  Vehicle,
  VehicleMaintenance,
  VehicleRegDetails,
  VehicleWithReg,
} from "@/lib/db/types";

type Listener = () => void;
const listeners = new Set<Listener>();

function emit() {
  listeners.forEach((l) => l());
}

export function subscribeDataStore(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function nextIdFrom<T>(items: T[], selector: (item: T) => number): number {
  if (items.length === 0) return 1;
  return Math.max(...items.map(selector)) + 1;
}

// ——— In-memory snapshots ———
let users: User[] = [...seedUsers];
let staffInfo: StaffInfo[] = [...seedStaff];
let customers: CustomerInfo[] = [...seedCustomers];
let vehicles: Vehicle[] = [...seedVehicles];
let vehicleRegDetails: VehicleRegDetails[] = [...seedRegs];
let drivers: DriverDetails[] = [...seedDrivers];
let bookings: Booking[] = [...seedBookings];
let payments: Payment[] = [...seedPayments];
let maintenanceRecords: VehicleMaintenance[] = [...seedMaintenance];
let fuelRecords: FuelRecord[] = [...seedFuel];

// ——— Bookings (used by booking-registry) ———
export function getBookingsSnapshot(): Booking[] {
  return [...bookings];
}

export function setBookingsSnapshot(next: Booking[]): void {
  bookings = [...next];
  emit();
}

export function appendBooking(booking: Booking): void {
  bookings = [...bookings, booking];
  emit();
}

export function patchBooking(
  bookingId: number,
  patch: Partial<Booking>
): boolean {
  const idx = bookings.findIndex((b) => b.booking_id === bookingId);
  if (idx === -1) return false;
  bookings = bookings.map((b) =>
    b.booking_id === bookingId ? { ...b, ...patch } : b
  );
  emit();
  return true;
}

export function deleteBooking(bookingId: number): boolean {
  if (!bookings.some((b) => b.booking_id === bookingId)) return false;
  bookings = bookings.filter((b) => b.booking_id !== bookingId);
  emit();
  return true;
}

// ——— Users ———
export function getUsers(): User[] {
  return [...users];
}

export function createUser(input: {
  email: string;
  role: UserRole;
  is_active?: boolean;
}): User {
  const user: User = {
    user_id: nextIdFrom(users, (u) => u.user_id),
    email: input.email.trim().toLowerCase(),
    role: input.role,
    created_at: new Date().toISOString().slice(0, 10),
    is_active: input.is_active ?? true,
  };
  users = [...users, user];
  emit();
  return user;
}

export function updateUser(userId: number, patch: Partial<User>): User | null {
  const existing = users.find((u) => u.user_id === userId);
  if (!existing) return null;
  const updated = { ...existing, ...patch };
  users = users.map((u) => (u.user_id === userId ? updated : u));
  emit();
  return updated;
}

export function deleteUser(userId: number): boolean {
  if (staffInfo.some((s) => s.user_id === userId)) return false;
  if (customers.some((c) => c.user_id === userId)) return false;
  users = users.filter((u) => u.user_id !== userId);
  emit();
  return true;
}

// ——— Staff ———
export function getStaffInfo(): StaffInfo[] {
  return [...staffInfo];
}

export function createStaff(input: Omit<StaffInfo, "staff_id">): StaffInfo {
  const row: StaffInfo = { ...input, staff_id: nextIdFrom(staffInfo, (s) => s.staff_id) };
  staffInfo = [...staffInfo, row];
  emit();
  return row;
}

export function updateStaff(staffId: number, patch: Partial<StaffInfo>): StaffInfo | null {
  const existing = staffInfo.find((s) => s.staff_id === staffId);
  if (!existing) return null;
  const updated = { ...existing, ...patch };
  staffInfo = staffInfo.map((s) => (s.staff_id === staffId ? updated : s));
  emit();
  return updated;
}

export function deleteStaff(staffId: number): boolean {
  staffInfo = staffInfo.filter((s) => s.staff_id !== staffId);
  emit();
  return true;
}

// ——— Customers ———
export function getCustomers(): CustomerInfo[] {
  return [...customers];
}

export function createCustomer(input: {
  customerFullName: string;
  address: string;
  driverLicense: string;
  phone?: string;
  email?: string;
  verification_status?: CustomerInfo["verification_status"];
}): CustomerInfo {
  const user = createUser({
    email: input.email?.trim().toLowerCase() || `customer${Date.now()}@guest.local`,
    role: "customer",
  });
  const customer: CustomerInfo = {
    user_id: user.user_id,
    customerFullName: input.customerFullName,
    address: input.address,
    driverLicense: input.driverLicense,
    verification_status: input.verification_status ?? "pending",
    is_suspended: false,
    phone: input.phone,
    email: input.email ?? user.email,
  };
  customers = [...customers, customer];
  emit();
  return customer;
}

export function updateCustomer(
  userId: number,
  patch: Partial<CustomerInfo>
): CustomerInfo | null {
  const existing = customers.find((c) => c.user_id === userId);
  if (!existing) return null;
  const updated = { ...existing, ...patch };
  customers = customers.map((c) => (c.user_id === userId ? updated : c));
  emit();
  return updated;
}

export function deleteCustomer(userId: number): boolean {
  if (bookings.some((b) => b.customer_user_id === userId)) return false;
  customers = customers.filter((c) => c.user_id !== userId);
  users = users.filter((u) => u.user_id !== userId);
  emit();
  return true;
}

// ——— Vehicles ———
export function getVehicles(): Vehicle[] {
  return [...vehicles];
}

export function getVehiclesWithReg(): VehicleWithReg[] {
  return vehicles.map((v) => ({
    ...v,
    registration: vehicleRegDetails.find((r) => r.vehicle_id === v.vehicle_id),
    maintenance_count: maintenanceRecords.filter((m) => m.vehicle_id === v.vehicle_id)
      .length,
  }));
}

export function createVehicle(
  input: Omit<Vehicle, "vehicle_id">,
  reg?: Omit<VehicleRegDetails, "reg_id" | "vehicle_id">
): VehicleWithReg {
  const vehicle: Vehicle = { ...input, vehicle_id: nextIdFrom(vehicles, (v) => v.vehicle_id) };
  vehicles = [...vehicles, vehicle];
  let registration: VehicleRegDetails | undefined;
  if (reg) {
    registration = {
      ...reg,
      reg_id: nextIdFrom(vehicleRegDetails, (r) => r.reg_id),
      vehicle_id: vehicle.vehicle_id,
    };
    vehicleRegDetails = [...vehicleRegDetails, registration];
  }
  emit();
  return {
    ...vehicle,
    registration,
    maintenance_count: 0,
  };
}

export function updateVehicle(
  vehicleId: number,
  patch: Partial<Vehicle>
): VehicleWithReg | null {
  const existing = vehicles.find((v) => v.vehicle_id === vehicleId);
  if (!existing) return null;
  const updated = { ...existing, ...patch };
  vehicles = vehicles.map((v) => (v.vehicle_id === vehicleId ? updated : v));
  emit();
  return getVehiclesWithReg().find((v) => v.vehicle_id === vehicleId) ?? null;
}

export function deleteVehicle(vehicleId: number): boolean {
  if (bookings.some((b) => b.vehicle_id === vehicleId && b.status !== "cancelled")) {
    return false;
  }
  vehicles = vehicles.filter((v) => v.vehicle_id !== vehicleId);
  vehicleRegDetails = vehicleRegDetails.filter((r) => r.vehicle_id !== vehicleId);
  maintenanceRecords = maintenanceRecords.filter((m) => m.vehicle_id !== vehicleId);
  fuelRecords = fuelRecords.filter((f) => f.vehicle_id !== vehicleId);
  emit();
  return true;
}

// ——— Drivers ———
export function getDrivers(): DriverDetails[] {
  return [...drivers];
}

export function createDriver(input: Omit<DriverDetails, "driver_id">): DriverDetails {
  const row: DriverDetails = {
    ...input,
    driver_id: nextIdFrom(drivers, (d) => d.driver_id),
  };
  drivers = [...drivers, row];
  emit();
  return row;
}

export function updateDriver(
  driverId: number,
  patch: Partial<DriverDetails>
): DriverDetails | null {
  const existing = drivers.find((d) => d.driver_id === driverId);
  if (!existing) return null;
  const updated = { ...existing, ...patch };
  drivers = drivers.map((d) => (d.driver_id === driverId ? updated : d));
  emit();
  return updated;
}

export function deleteDriver(driverId: number): boolean {
  if (bookings.some((b) => b.driver_id === driverId && b.status !== "cancelled")) {
    return false;
  }
  drivers = drivers.filter((d) => d.driver_id !== driverId);
  emit();
  return true;
}

// ——— Maintenance ———
export function getMaintenanceRecords(): VehicleMaintenance[] {
  return [...maintenanceRecords];
}

export function createMaintenance(
  input: Omit<VehicleMaintenance, "maintenance_id">
): VehicleMaintenance {
  const row: VehicleMaintenance = {
    ...input,
    maintenance_id: nextIdFrom(maintenanceRecords, (m) => m.maintenance_id),
  };
  maintenanceRecords = [...maintenanceRecords, row];
  emit();
  return row;
}

export function updateMaintenance(
  id: number,
  patch: Partial<VehicleMaintenance>
): VehicleMaintenance | null {
  const existing = maintenanceRecords.find((m) => m.maintenance_id === id);
  if (!existing) return null;
  const updated = { ...existing, ...patch };
  maintenanceRecords = maintenanceRecords.map((m) =>
    m.maintenance_id === id ? updated : m
  );
  emit();
  return updated;
}

export function deleteMaintenance(id: number): boolean {
  maintenanceRecords = maintenanceRecords.filter((m) => m.maintenance_id !== id);
  emit();
  return true;
}

// ——— Payments ———
export function getPayments(): Payment[] {
  return [...payments];
}

export function createPayment(input: Omit<Payment, "payment_id">): Payment {
  const row: Payment = { ...input, payment_id: nextIdFrom(payments, (p) => p.payment_id) };
  payments = [...payments, row];
  const booking = bookings.find((b) => b.booking_id === input.booking_id);
  if (booking) {
    patchBooking(input.booking_id, { payment_id: row.payment_id });
  }
  emit();
  return row;
}

export function updatePayment(
  paymentId: number,
  patch: Partial<Payment>
): Payment | null {
  const existing = payments.find((p) => p.payment_id === paymentId);
  if (!existing) return null;
  const updated = { ...existing, ...patch };
  payments = payments.map((p) => (p.payment_id === paymentId ? updated : p));
  emit();
  return updated;
}

export function deletePayment(paymentId: number): boolean {
  payments = payments.filter((p) => p.payment_id !== paymentId);
  emit();
  return true;
}

// ——— Fuel ———
export function getFuelRecords(): FuelRecord[] {
  return [...fuelRecords];
}

export function createFuelRecord(input: Omit<FuelRecord, "fuel_id">): FuelRecord {
  const row: FuelRecord = { ...input, fuel_id: nextIdFrom(fuelRecords, (f) => f.fuel_id) };
  fuelRecords = [...fuelRecords, row];
  emit();
  return row;
}

export function updateFuelRecord(
  fuelId: number,
  patch: Partial<FuelRecord>
): FuelRecord | null {
  const existing = fuelRecords.find((f) => f.fuel_id === fuelId);
  if (!existing) return null;
  const updated = { ...existing, ...patch };
  fuelRecords = fuelRecords.map((f) => (f.fuel_id === fuelId ? updated : f));
  emit();
  return updated;
}

export function deleteFuelRecord(fuelId: number): boolean {
  fuelRecords = fuelRecords.filter((f) => f.fuel_id !== fuelId);
  emit();
  return true;
}
