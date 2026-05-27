import { format, parse } from "date-fns";

/** Parse yyyy-MM-dd as local calendar date (avoids UTC timezone hydration shifts). */
export function parseDateOnly(dateStr: string): Date {
  return parse(dateStr, "yyyy-MM-dd", new Date());
}

export function formatDateOnly(dateStr: string, pattern: string): string {
  return format(parseDateOnly(dateStr), pattern);
}
