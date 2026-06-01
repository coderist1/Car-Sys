export {
  dateRangesOverlap,
  findBookingConflicts,
  isBlockingBookingStatus,
  isVehicleAvailableForRange,
  validateDateRange,
  type BookingConflict,
  type BookingDraft,
} from "./conflict-detection";

export {
  acceptBooking,
  checkBookingAvailability,
  getBookingSnapshot,
  rejectBooking,
  resetBookings,
  subscribeBookings,
  tryCreateBooking,
  type BookingActionResult,
  type CreateBookingInput,
  type CreateBookingResult,
} from "./booking-registry";
