import {
  maintenancePredictions,
  preventiveMaintenanceTrend,
} from "./mock-data";
import {
  getBookingsSnapshot,
  getCustomers,
  getDrivers,
  getFuelRecords,
  getMaintenanceRecords,
  getPayments,
  getStaffInfo,
  getUsers,
  getVehicles,
  getVehiclesWithReg,
} from "./data-store";
import type {
  Booking,
  BookingWithRelations,
  CustomerInfo,
  DashboardStats,
  VehicleWithReg,
} from "./types";

export function getDashboardStats(): DashboardStats {
  const vehicles = getVehicles();
  const bookings = getBookingsSnapshot();
  const payments = getPayments();
  const customers = getCustomers();

  const available = vehicles.filter((v) => v.status === "available").length;
  const reserved = vehicles.filter((v) => v.status === "reserved").length;
  const maintenance = vehicles.filter((v) => v.status === "under_maintenance").length;
  const revenue = payments
    .filter((p) => p.status === "paid")
    .reduce((sum, p) => sum + p.amount, 0);

  return {
    totalVehicles: vehicles.length,
    availableVehicles: available,
    reservedVehicles: reserved,
    maintenanceVehicles: maintenance,
    revenue,
    activeBookings: bookings.filter((b) => b.status === "active").length,
    totalCustomers: customers.length,
  };
}

export function getPreventiveMaintenanceTrend() {
  return preventiveMaintenanceTrend;
}

export function getMaintenancePredictions() {
  return [...maintenancePredictions].sort((a, b) => a.due_in_days - b.due_in_days);
}

export function getMaintenanceDashboardStats() {
  const trend = preventiveMaintenanceTrend;
  const currentMonth = trend[trend.length - 1];
  const maintenanceRecords = getMaintenanceRecords();
  return {
    highRiskVehicles: maintenancePredictions.filter((p) => p.risk === "high").length,
    pendingServices: maintenanceRecords.filter(
      (m) => m.status === "pending" || m.status === "in_progress"
    ).length,
    scheduledThisMonth: currentMonth?.scheduled ?? 0,
    completedYtd: trend.reduce((sum, m) => sum + m.completed, 0),
  };
}

export function enrichBooking(booking: Booking): BookingWithRelations {
  const customers = getCustomers();
  const vehicles = getVehicles();
  const drivers = getDrivers();
  const payments = getPayments();

  return {
    ...booking,
    customer: customers.find((c) => c.user_id === booking.customer_user_id),
    vehicle: vehicles.find((v) => v.vehicle_id === booking.vehicle_id),
    driver: booking.driver_id
      ? drivers.find((d) => d.driver_id === booking.driver_id)
      : undefined,
    payment: booking.payment_id
      ? payments.find((p) => p.payment_id === booking.payment_id)
      : payments.find((p) => p.booking_id === booking.booking_id),
  };
}

export function getRecentBookings(limit = 5): BookingWithRelations[] {
  return [...getBookingsSnapshot()]
    .sort((a, b) => b.booking_id - a.booking_id)
    .slice(0, limit)
    .map(enrichBooking);
}

export function getMaintenanceAlerts() {
  return getMaintenanceRecords().filter(
    (m) => m.status === "pending" || m.status === "in_progress"
  );
}

export function getAllVehicles(): VehicleWithReg[] {
  return getVehiclesWithReg();
}

export function getVehicleById(id: number) {
  const vehicle = getVehiclesWithReg().find((v) => v.vehicle_id === id);
  if (!vehicle) return null;
  return {
    ...vehicle,
    maintenance: getMaintenanceRecords().filter((m) => m.vehicle_id === id),
    fuelRecords: getFuelRecords().filter((f) => f.vehicle_id === id),
  };
}

export function getAllBookings(): BookingWithRelations[] {
  return getBookingsSnapshot().map(enrichBooking);
}

export function getAllCustomers(): CustomerInfo[] {
  const users = getUsers();
  return getCustomers().map((c) => ({
    ...c,
    email: c.email ?? users.find((u) => u.user_id === c.user_id)?.email,
  }));
}

export function getCustomerRentalHistory(userId: number) {
  return getBookingsSnapshot()
    .filter((b) => b.customer_user_id === userId)
    .map(enrichBooking);
}

export function getAllPayments() {
  const bookings = getBookingsSnapshot();
  const customers = getCustomers();
  return getPayments().map((p) => ({
    ...p,
    booking: bookings.find((b) => b.booking_id === p.booking_id),
    customer: customers.find(
      (c) =>
        c.user_id ===
        bookings.find((b) => b.booking_id === p.booking_id)?.customer_user_id
    ),
  }));
}

export function getAllFuelRecords() {
  const vehicles = getVehicles();
  const bookings = getBookingsSnapshot();
  return getFuelRecords().map((f) => ({
    ...f,
    vehicle: vehicles.find((v) => v.vehicle_id === f.vehicle_id),
    booking: f.booking_id ? bookings.find((b) => b.booking_id === f.booking_id) : undefined,
  }));
}

export function getAllMaintenance() {
  const vehicles = getVehiclesWithReg();
  return getMaintenanceRecords().map((m) => ({
    ...m,
    vehicle: vehicles.find((v) => v.vehicle_id === m.vehicle_id),
    registration: vehicles.find((v) => v.vehicle_id === m.vehicle_id)?.registration,
  }));
}

export function getAllDrivers() {
  const vehicles = getVehicles();
  const bookings = getBookingsSnapshot();
  return getDrivers().map((d) => ({
    ...d,
    assignedVehicle: d.assigned_vehicle_id
      ? vehicles.find((v) => v.vehicle_id === d.assigned_vehicle_id)
      : undefined,
    activeBookings: bookings.filter(
      (b) => b.driver_id === d.driver_id && b.status === "active"
    ).length,
  }));
}

export function getCurrentStaff() {
  const staff = getStaffInfo();
  return staff.find((s) => s.user_id === 1) ?? staff[0];
}

export function getAuditLogs() {
  return [
    { id: 1, action: "Vehicle FPX-2847 status updated", user: "Sarah Chen", timestamp: "2026-05-27 09:14" },
    { id: 2, action: "Booking #1003 payment received (partial)", user: "Mike Johnson", timestamp: "2026-05-27 08:42" },
    { id: 3, action: "Maintenance #2 scheduled for FPX-8873", user: "Alex Rivera", timestamp: "2026-05-26 16:30" },
    { id: 4, action: "Customer David Kim account suspended", user: "Sarah Chen", timestamp: "2026-05-26 11:05" },
    { id: 5, action: "Driver Carlos Mendez assigned to booking #1001", user: "Mike Johnson", timestamp: "2026-05-25 14:22" },
  ];
}
