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
  checkBookingAvailability,
  getBookingSnapshot,
  resetBookings,
  subscribeBookings,
  tryCreateBooking,
  type CreateBookingInput,
  type CreateBookingResult,
} from "./booking-registry";
