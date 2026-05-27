import type {
  Booking,
  CustomerInfo,
  DriverDetails,
  FuelRecord,
  Payment,
  StaffInfo,
  User,
  Vehicle,
  VehicleMaintenance,
  VehicleRegDetails,
} from "./types";

export const users: User[] = [
  { user_id: 1, email: "admin@fleetpro.io", role: "admin", created_at: "2023-01-15", is_active: true },
  { user_id: 2, email: "sarah.chen@fleetpro.io", role: "manager", created_at: "2023-03-20", is_active: true },
  { user_id: 3, email: "mike.ops@fleetpro.io", role: "staff", created_at: "2023-06-10", is_active: true },
  { user_id: 201, email: "jennifer.walsh@fleetpro.io", role: "staff", created_at: "2023-08-01", is_active: true },
  { user_id: 101, email: "james.wilson@email.com", role: "customer", created_at: "2024-02-01", is_active: true },
  { user_id: 102, email: "emma.thompson@email.com", role: "customer", created_at: "2024-03-15", is_active: true },
  { user_id: 103, email: "robert.garcia@email.com", role: "customer", created_at: "2024-04-22", is_active: true },
  { user_id: 104, email: "lisa.anderson@email.com", role: "customer", created_at: "2024-05-08", is_active: true },
  { user_id: 105, email: "david.kim@email.com", role: "customer", created_at: "2024-06-30", is_active: true },
  { user_id: 106, email: "maria.santos@email.com", role: "customer", created_at: "2024-08-12", is_active: true },
];

export const staffInfo: StaffInfo[] = [
  { staff_id: 1, user_id: 1, fullName: "Alex Rivera", department: "Operations", phone: "+1 (555) 100-0001", hire_date: "2023-01-15" },
  { staff_id: 2, user_id: 2, fullName: "Sarah Chen", department: "Fleet Management", phone: "+1 (555) 100-0002", hire_date: "2023-03-20" },
  { staff_id: 3, user_id: 3, fullName: "Mike Johnson", department: "Customer Service", phone: "+1 (555) 100-0003", hire_date: "2023-06-10" },
];

export const customers: CustomerInfo[] = [
  { user_id: 101, customerFullName: "James Wilson", address: "742 Evergreen Terrace, Springfield", driverLicense: "DL-8847291", verification_status: "verified", is_suspended: false, phone: "+1 (555) 201-0101", email: "james.wilson@email.com" },
  { user_id: 102, customerFullName: "Emma Thompson", address: "128 Oak Street, Portland, OR", driverLicense: "DL-9921045", verification_status: "verified", is_suspended: false, phone: "+1 (555) 201-0102", email: "emma.thompson@email.com" },
  { user_id: 103, customerFullName: "Robert Garcia", address: "456 Maple Ave, Austin, TX", driverLicense: "DL-7738291", verification_status: "pending", is_suspended: false, phone: "+1 (555) 201-0103", email: "robert.garcia@email.com" },
  { user_id: 104, customerFullName: "Lisa Anderson", address: "89 Pine Road, Denver, CO", driverLicense: "DL-6612048", verification_status: "verified", is_suspended: false, phone: "+1 (555) 201-0104", email: "lisa.anderson@email.com" },
  { user_id: 105, customerFullName: "David Kim", address: "2100 Sunset Blvd, Los Angeles, CA", driverLicense: "DL-5549102", verification_status: "verified", is_suspended: true, phone: "+1 (555) 201-0105", email: "david.kim@email.com" },
  { user_id: 106, customerFullName: "Maria Santos", address: "33 Harbor View, Miami, FL", driverLicense: "DL-4482910", verification_status: "rejected", is_suspended: false, phone: "+1 (555) 201-0106", email: "maria.santos@email.com" },
];

export const vehicles: Vehicle[] = [
  { vehicle_id: 1, plateNumber: "FPX-2847", mileage: 45230, brand: "Toyota", model: "Camry", type: "Sedan", capacity: 5, year_model: 2023, year_purchased: 2023, status: "reserved" },
  { vehicle_id: 2, plateNumber: "FPX-9102", mileage: 32100, brand: "Honda", model: "CR-V", type: "SUV", capacity: 5, year_model: 2024, year_purchased: 2024, status: "available" },
  { vehicle_id: 3, plateNumber: "FPX-5531", mileage: 67800, brand: "Ford", model: "Explorer", type: "SUV", capacity: 7, year_model: 2022, year_purchased: 2022, status: "under_maintenance" },
  { vehicle_id: 4, plateNumber: "FPX-7720", mileage: 18900, brand: "Tesla", model: "Model 3", type: "Electric", capacity: 5, year_model: 2024, year_purchased: 2024, status: "available" },
  { vehicle_id: 5, plateNumber: "FPX-3389", mileage: 89400, brand: "Chevrolet", model: "Suburban", type: "Van", capacity: 8, year_model: 2021, year_purchased: 2021, status: "reserved" },
  { vehicle_id: 6, plateNumber: "FPX-6614", mileage: 23400, brand: "BMW", model: "X5", type: "Luxury SUV", capacity: 5, year_model: 2023, year_purchased: 2023, status: "available" },
  { vehicle_id: 7, plateNumber: "FPX-4492", mileage: 56700, brand: "Mercedes", model: "E-Class", type: "Luxury Sedan", capacity: 5, year_model: 2022, year_purchased: 2022, status: "available" },
  { vehicle_id: 8, plateNumber: "FPX-2201", mileage: 11200, brand: "Hyundai", model: "Tucson", type: "SUV", capacity: 5, year_model: 2024, year_purchased: 2024, status: "reserved" },
  { vehicle_id: 9, plateNumber: "FPX-8873", mileage: 72100, brand: "Nissan", model: "Altima", type: "Sedan", capacity: 5, year_model: 2021, year_purchased: 2021, status: "under_maintenance" },
  { vehicle_id: 10, plateNumber: "FPX-1156", mileage: 8900, brand: "Kia", model: "Sportage", type: "SUV", capacity: 5, year_model: 2024, year_purchased: 2024, status: "available" },
];

export const vehicleRegDetails: VehicleRegDetails[] = [
  { reg_id: 1, vehicle_id: 1, registration_number: "REG-2023-001", insurance_provider: "StateFarm", insurance_expiry: "2026-03-15", registration_expiry: "2026-01-20" },
  { reg_id: 2, vehicle_id: 2, registration_number: "REG-2024-002", insurance_provider: "Geico", insurance_expiry: "2026-06-01", registration_expiry: "2026-04-10" },
  { reg_id: 3, vehicle_id: 3, registration_number: "REG-2022-003", insurance_provider: "Progressive", insurance_expiry: "2025-12-30", registration_expiry: "2025-11-15" },
  { reg_id: 4, vehicle_id: 4, registration_number: "REG-2024-004", insurance_provider: "Allstate", insurance_expiry: "2026-08-22", registration_expiry: "2026-07-01" },
  { reg_id: 5, vehicle_id: 5, registration_number: "REG-2021-005", insurance_provider: "Liberty Mutual", insurance_expiry: "2025-09-10", registration_expiry: "2025-08-20" },
];

export const drivers: DriverDetails[] = [
  { driver_id: 1, full_name: "Carlos Mendez", license_number: "CDL-7829104", contact_number: "+1 (555) 301-0001", assigned_vehicle_id: 1, availability: "on_trip", experience_years: 8, rating: 4.9, employment_status: "active", license_expiry: "2026-08-15", registration_expiry: "2026-06-30", license_renewal_status: "valid", registration_renewal_status: "expiring_soon" },
  { driver_id: 2, full_name: "Jennifer Walsh", license_number: "CDL-6610293", contact_number: "+1 (555) 301-0002", availability: "available", experience_years: 5, rating: 4.7, employment_status: "active", license_expiry: "2026-03-10", registration_expiry: "2027-01-20", license_renewal_status: "expired", registration_renewal_status: "valid" },
  { driver_id: 3, full_name: "Thomas Brooks", license_number: "CDL-4492018", contact_number: "+1 (555) 301-0003", assigned_vehicle_id: 5, availability: "on_trip", experience_years: 12, rating: 4.8, employment_status: "active", license_expiry: "2027-02-28", registration_expiry: "2026-11-05", license_renewal_status: "valid", registration_renewal_status: "valid" },
  { driver_id: 4, full_name: "Angela Price", license_number: "CDL-3389102", contact_number: "+1 (555) 301-0004", availability: "available", experience_years: 3, rating: 4.5, employment_status: "active", license_expiry: "2026-06-18", registration_expiry: "2026-05-28", license_renewal_status: "expiring_soon", registration_renewal_status: "expiring_soon" },
  { driver_id: 5, full_name: "Kevin O'Brien", license_number: "CDL-2291047", contact_number: "+1 (555) 301-0005", availability: "off_duty", experience_years: 6, rating: 4.6, employment_status: "on_leave", license_expiry: "2026-12-01", registration_expiry: "2026-09-14", license_renewal_status: "valid", registration_renewal_status: "valid" },
];

export const bookings: Booking[] = [
  { booking_id: 1001, customer_user_id: 101, vehicle_id: 1, driver_id: 1, pickup_date: "2026-05-20", return_date: "2026-05-27", status: "active", total_amount: 840, payment_id: 2001 },
  { booking_id: 1002, customer_user_id: 102, vehicle_id: 5, driver_id: 3, pickup_date: "2026-05-22", return_date: "2026-05-29", status: "active", total_amount: 1260, payment_id: 2002 },
  { booking_id: 1003, customer_user_id: 104, vehicle_id: 8, pickup_date: "2026-05-25", return_date: "2026-06-01", status: "confirmed", total_amount: 720, payment_id: 2003 },
  { booking_id: 1004, customer_user_id: 101, vehicle_id: 2, pickup_date: "2026-04-10", return_date: "2026-04-17", status: "completed", total_amount: 560, payment_id: 2004 },
  { booking_id: 1005, customer_user_id: 103, vehicle_id: 6, pickup_date: "2026-06-01", return_date: "2026-06-08", status: "pending", total_amount: 980 },
  { booking_id: 1006, customer_user_id: 105, vehicle_id: 4, pickup_date: "2026-03-15", return_date: "2026-03-22", status: "completed", total_amount: 910, payment_id: 2006 },
  { booking_id: 1007, customer_user_id: 102, vehicle_id: 7, pickup_date: "2026-02-01", return_date: "2026-02-08", status: "completed", total_amount: 1120, payment_id: 2007 },
  { booking_id: 1008, customer_user_id: 104, vehicle_id: 10, pickup_date: "2026-05-28", return_date: "2026-06-04", status: "confirmed", total_amount: 630, payment_id: 2008 },
  { booking_id: 1009, customer_user_id: 106, vehicle_id: 7, pickup_date: "2026-06-05", return_date: "2026-06-12", status: "pending", total_amount: 1050 },
  { booking_id: 1010, customer_user_id: 101, vehicle_id: 2, pickup_date: "2026-06-08", return_date: "2026-06-15", status: "confirmed", total_amount: 595, payment_id: 2009 },
  { booking_id: 1011, customer_user_id: 102, vehicle_id: 6, driver_id: 2, pickup_date: "2026-06-10", return_date: "2026-06-15", status: "confirmed", total_amount: 700 },
];

export const payments: Payment[] = [
  { payment_id: 2001, booking_id: 1001, amount: 840, payment_date: "2026-05-19", payment_method: "card", status: "paid", transaction_ref: "TXN-8847291" },
  { payment_id: 2002, booking_id: 1002, amount: 1260, payment_date: "2026-05-21", payment_method: "online", status: "paid", transaction_ref: "TXN-9921045" },
  { payment_id: 2003, booking_id: 1003, amount: 360, payment_date: "2026-05-24", payment_method: "card", status: "partial", transaction_ref: "TXN-7738291" },
  { payment_id: 2004, booking_id: 1004, amount: 560, payment_date: "2026-04-09", payment_method: "card", status: "paid", transaction_ref: "TXN-6612048" },
  { payment_id: 2006, booking_id: 1006, amount: 910, payment_date: "2026-03-14", payment_method: "bank_transfer", status: "paid", transaction_ref: "TXN-5549102" },
  { payment_id: 2007, booking_id: 1007, amount: 1120, payment_date: "2026-01-31", payment_method: "card", status: "paid", transaction_ref: "TXN-4482910" },
  { payment_id: 2008, booking_id: 1008, amount: 630, payment_date: "2026-05-27", payment_method: "online", status: "pending", transaction_ref: "TXN-2291047" },
  { payment_id: 2009, booking_id: 1010, amount: 595, payment_date: "2026-06-07", payment_method: "card", status: "paid", transaction_ref: "TXN-1010001" },
];

export const preventiveMaintenanceTrend = [
  { month: "Jan", scheduled: 6, completed: 5 },
  { month: "Feb", scheduled: 7, completed: 7 },
  { month: "Mar", scheduled: 8, completed: 6 },
  { month: "Apr", scheduled: 9, completed: 8 },
  { month: "May", scheduled: 10, completed: 9 },
  { month: "Jun", scheduled: 8, completed: 4 },
];

export const maintenanceRecords: VehicleMaintenance[] = [
  { maintenance_id: 1, vehicle_id: 3, service_type: "Engine Overhaul", assigned_mechanic: "Tony Richards", service_date: "2026-05-18", cost: 2450, status: "in_progress", notes: "Timing belt replacement included" },
  { maintenance_id: 2, vehicle_id: 9, service_type: "Brake System", assigned_mechanic: "Lisa Park", service_date: "2026-05-20", cost: 680, status: "pending", notes: "Front and rear pads" },
  { maintenance_id: 3, vehicle_id: 1, service_type: "Oil Change", assigned_mechanic: "Tony Richards", service_date: "2026-04-15", cost: 89, status: "completed", notes: "Synthetic 5W-30" },
  { maintenance_id: 4, vehicle_id: 5, service_type: "Tire Rotation", assigned_mechanic: "Mike Torres", service_date: "2026-05-10", cost: 120, status: "completed", notes: "All-season tires" },
  { maintenance_id: 5, vehicle_id: 2, service_type: "AC Service", assigned_mechanic: "Lisa Park", service_date: "2026-06-02", cost: 350, status: "pending", notes: "Scheduled pre-summer" },
  { maintenance_id: 6, vehicle_id: 4, service_type: "Battery Check", assigned_mechanic: "Tony Richards", service_date: "2026-05-25", cost: 0, status: "pending", notes: "EV battery health diagnostic" },
];

export const fuelRecords: FuelRecord[] = [
  { fuel_id: 1, vehicle_id: 1, booking_id: 1001, fuel_date: "2026-05-21", liters: 42.5, cost: 68.00, odometer: 45100, station: "Shell Downtown" },
  { fuel_id: 2, vehicle_id: 5, booking_id: 1002, fuel_date: "2026-05-23", liters: 65.0, cost: 104.00, odometer: 89200, station: "Chevron Highway 101" },
  { fuel_id: 3, vehicle_id: 2, fuel_date: "2026-04-12", liters: 38.0, cost: 60.80, odometer: 31800, station: "BP Central" },
  { fuel_id: 4, vehicle_id: 3, fuel_date: "2026-05-15", liters: 55.0, cost: 88.00, odometer: 67500, station: "Exxon Fleet Depot" },
  { fuel_id: 5, vehicle_id: 6, fuel_date: "2026-05-01", liters: 48.0, cost: 76.80, odometer: 23000, station: "Mobil Premium" },
];

export const maintenancePredictions = [
  { prediction_id: 1, vehicle_id: 3, plateNumber: "FPX-5531", brand: "Ford", model: "Explorer", predicted_service: "Engine Overhaul", risk: "high" as const, due_in_days: 5, recommended_date: "2026-06-01", mileage: 67800, confidence: 92, notes: "Mileage threshold exceeded; timing belt due" },
  { prediction_id: 2, vehicle_id: 9, plateNumber: "FPX-8873", brand: "Nissan", model: "Altima", predicted_service: "Brake System Service", risk: "high" as const, due_in_days: 8, recommended_date: "2026-06-04", mileage: 72100, confidence: 88, notes: "Wear pattern indicates pad replacement" },
  { prediction_id: 3, vehicle_id: 1, plateNumber: "FPX-2847", brand: "Toyota", model: "Camry", predicted_service: "Oil Change", risk: "medium" as const, due_in_days: 14, recommended_date: "2026-06-10", mileage: 45230, confidence: 85, notes: "Interval-based preventive schedule" },
  { prediction_id: 4, vehicle_id: 5, plateNumber: "FPX-3389", brand: "Chevrolet", model: "Suburban", predicted_service: "Tire Rotation", risk: "low" as const, due_in_days: 21, recommended_date: "2026-06-17", mileage: 89400, confidence: 79, notes: "Routine rotation cycle" },
  { prediction_id: 5, vehicle_id: 2, plateNumber: "FPX-9102", brand: "Honda", model: "CR-V", predicted_service: "AC Service", risk: "medium" as const, due_in_days: 10, recommended_date: "2026-06-06", mileage: 32100, confidence: 81, notes: "Pre-summer cooling system check" },
  { prediction_id: 6, vehicle_id: 4, plateNumber: "FPX-7720", brand: "Tesla", model: "Model 3", predicted_service: "Battery Health Diagnostic", risk: "medium" as const, due_in_days: 12, recommended_date: "2026-06-08", mileage: 18900, confidence: 90, notes: "EV quarterly diagnostic" },
  { prediction_id: 7, vehicle_id: 6, plateNumber: "FPX-6614", brand: "BMW", model: "X5", predicted_service: "Fluid Flush", risk: "low" as const, due_in_days: 28, recommended_date: "2026-06-24", mileage: 23400, confidence: 74, notes: "Luxury fleet preventive interval" },
];

