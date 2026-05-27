import { AlertCircle } from "lucide-react";
import type { BookingConflict } from "@/lib/booking/conflict-detection";

export function BookingConflictAlert({
  conflicts,
  title = "Scheduling conflict",
}: {
  conflicts: BookingConflict[];
  title?: string;
}) {
  if (conflicts.length === 0) return null;

  return (
    <div
      role="alert"
      className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 space-y-2"
    >
      <p className="flex items-center gap-2 text-sm font-semibold text-destructive">
        <AlertCircle className="h-4 w-4 shrink-0" />
        {title}
      </p>
      <ul className="space-y-1.5 text-sm text-destructive/90">
        {conflicts.map((c, i) => (
          <li key={`${c.type}-${c.conflictingBookingId}-${i}`}>
            <span className="font-medium capitalize">{c.type}:</span> {c.message}
          </li>
        ))}
      </ul>
    </div>
  );
}
