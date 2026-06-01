/** ERD-aligned entity types for Car Rental Management System */

export type UserRole = "admin" | "manager" | "staff" | "customer";

export interface User {
  user_id: number;
  email: string;
  password_hash?: string;
  role: UserRole;
  created_at: string;
  is_active: boolean;
}

export interface StaffInfo {
  staff_id: number;
  user_id: number;
  fullName: string;
  department: string;
  phone: string;
  hire_date: string;
}

export interface CustomerInfo {
  user_id: number;
  customerFullName: string;
  address: string;
  driverLicense: string;
  verification_status: "verified" | "pending" | "rejected";
  is_suspended: boolean;
  phone?: string;
  email?: string;
}

export type VehicleStatus = "available" | "reserved" | "under_maintenance";

export interface Vehicle {
  vehicle_id: number;
  plateNumber: string;
  mileage: number;
  brand: string;
  model: string;
  type: string;
  capacity: number;
  year_model: number;
  year_purchased: number;
  status: VehicleStatus;
}

export interface VehicleRegDetails {
  reg_id: number;
  vehicle_id: number;
  registration_number: string;
  insurance_provider: string;
  insurance_expiry: string;
  registration_expiry: string;
}

export type MaintenanceStatus = "pending" | "in_progress" | "completed";

export interface VehicleMaintenance {
  maintenance_id: number;
  vehicle_id: number;
  service_type: string;
  assigned_mechanic: string;
  service_date: string;
  cost: number;
  status: MaintenanceStatus;
  notes: string;
}

export interface FuelRecord {
  fuel_id: number;
  vehicle_id: number;
  booking_id?: number;
  fuel_date: string;
  liters: number;
  cost: number;
  odometer: number;
  station: string;
}

export type PaymentStatus = "paid" | "pending" | "partial" | "refunded" | "failed";
export type PaymentMethod =
  | "card"
  | "cash"
  | "bank_transfer"
  | "online"
  | "paypal"
  | "gcash";

export interface Payment {
  payment_id: number;
  booking_id: number;
  amount: number;
  payment_date: string;
  payment_method: PaymentMethod;
  status: PaymentStatus;
  transaction_ref?: string;
}

export type BookingStatus =
  | "confirmed"
  | "active"
  | "completed"
  | "cancelled"
  | "pending";

export interface Booking {
  booking_id: number;
  customer_user_id: number;
  vehicle_id: number;
  driver_id?: number;
  pickup_date: string;
  return_date: string;
  status: BookingStatus;
  total_amount: number;
  payment_id?: number;
  notes?: string;
}

export type DriverAvailability = "available" | "on_trip" | "off_duty";
export type EmploymentStatus = "active" | "on_leave" | "terminated";

export type RenewalStatus = "valid" | "expiring_soon" | "expired";

export interface DriverDetails {
  driver_id: number;
  full_name: string;
  license_number: string;
  contact_number: string;
  assigned_vehicle_id?: number;
  availability: DriverAvailability;
  experience_years: number;
  rating: number;
  employment_status: EmploymentStatus;
  license_expiry: string;
  registration_expiry: string;
  license_renewal_status: RenewalStatus;
  registration_renewal_status: RenewalStatus;
}

/** Enriched view models for UI */
export interface BookingWithRelations extends Booking {
  customer?: CustomerInfo;
  vehicle?: Vehicle;
  driver?: DriverDetails;
  payment?: Payment;
}

export interface VehicleWithReg extends Vehicle {
  registration?: VehicleRegDetails;
  maintenance_count?: number;
}

export interface DashboardStats {
  totalVehicles: number;
  availableVehicles: number;
  reservedVehicles: number;
  maintenanceVehicles: number;
  revenue: number;
  activeBookings: number;
  totalCustomers: number;
}

export type MaintenanceRiskLevel = "low" | "medium" | "high";

export interface MaintenancePrediction {
  prediction_id: number;
  vehicle_id: number;
  plateNumber: string;
  brand: string;
  model: string;
  predicted_service: string;
  risk: MaintenanceRiskLevel;
  due_in_days: number;
  recommended_date: string;
  mileage: number;
  confidence: number;
  notes?: string;
}

export interface MaintenanceDashboardStats {
  highRiskVehicles: number;
  pendingServices: number;
  scheduledThisMonth: number;
  completedYtd: number;
}
