import { NextResponse } from "next/server";
import {
  checkBookingAvailability,
  getBookingSnapshot,
  tryCreateBooking,
} from "@/lib/booking/booking-registry";
import type { BookingStatus } from "@/lib/db/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const vehicleId = Number(searchParams.get("vehicle_id"));
  const pickup = searchParams.get("pickup_date");
  const returnDate = searchParams.get("return_date");
  const customerId = Number(searchParams.get("customer_user_id") || 0);
  const driverId = searchParams.get("driver_id");
  const excludeId = searchParams.get("exclude_booking_id");

  if (!vehicleId || !pickup || !returnDate) {
    return NextResponse.json(
      { error: "vehicle_id, pickup_date, and return_date are required" },
      { status: 400 }
    );
  }

  const conflicts = checkBookingAvailability({
    vehicle_id: vehicleId,
    customer_user_id: customerId || -1,
    driver_id: driverId && driverId !== "none" ? Number(driverId) : undefined,
    pickup_date: pickup,
    return_date: returnDate,
    status: "pending",
    booking_id: excludeId ? Number(excludeId) : undefined,
  });

  return NextResponse.json({
    available: conflicts.length === 0,
    conflicts,
    bookings: getBookingSnapshot(),
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      customer_user_id,
      vehicle_id,
      driver_id,
      pickup_date,
      return_date,
      total_amount,
      status = "pending",
    } = body;

    if (!customer_user_id || !vehicle_id || !pickup_date || !return_date) {
      return NextResponse.json(
        { error: "Missing required booking fields." },
        { status: 400 }
      );
    }

    const result = await tryCreateBooking({
      customer_user_id: Number(customer_user_id),
      vehicle_id: Number(vehicle_id),
      driver_id: driver_id ? Number(driver_id) : undefined,
      pickup_date,
      return_date,
      total_amount: Number(total_amount) || 0,
      status: status as BookingStatus,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.message, conflicts: result.conflicts },
        { status: 409 }
      );
    }

    return NextResponse.json({ booking: result.booking }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
}
