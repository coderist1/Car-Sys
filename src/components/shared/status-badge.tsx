import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const variants = {
  vehicle: {
    available: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20 dark:text-emerald-400",
    reserved: "bg-amber-500/10 text-amber-700 border-amber-500/20 dark:text-amber-400",
    under_maintenance: "bg-rose-500/10 text-rose-700 border-rose-500/20 dark:text-rose-400",
  },
  booking: {
    confirmed: "bg-blue-500/10 text-blue-700 border-blue-500/20 dark:text-blue-400",
    active: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20 dark:text-emerald-400",
    completed: "bg-slate-500/10 text-slate-700 border-slate-500/20 dark:text-slate-400",
    cancelled: "bg-rose-500/10 text-rose-700 border-rose-500/20 dark:text-rose-400",
    pending: "bg-amber-500/10 text-amber-700 border-amber-500/20 dark:text-amber-400",
  },
  payment: {
    paid: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20 dark:text-emerald-400",
    pending: "bg-amber-500/10 text-amber-700 border-amber-500/20 dark:text-amber-400",
    partial: "bg-orange-500/10 text-orange-700 border-orange-500/20 dark:text-orange-400",
    refunded: "bg-slate-500/10 text-slate-600 border-slate-500/20",
    failed: "bg-rose-500/10 text-rose-700 border-rose-500/20 dark:text-rose-400",
  },
  maintenance: {
    pending: "bg-amber-500/10 text-amber-700 border-amber-500/20 dark:text-amber-400",
    in_progress: "bg-blue-500/10 text-blue-700 border-blue-500/20 dark:text-blue-400",
    completed: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20 dark:text-emerald-400",
  },
  verification: {
    verified: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20 dark:text-emerald-400",
    pending: "bg-amber-500/10 text-amber-700 border-amber-500/20 dark:text-amber-400",
    rejected: "bg-rose-500/10 text-rose-700 border-rose-500/20 dark:text-rose-400",
  },
  driver: {
    available: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20 dark:text-emerald-400",
    on_trip: "bg-blue-500/10 text-blue-700 border-blue-500/20 dark:text-blue-400",
    off_duty: "bg-slate-500/10 text-slate-600 border-slate-500/20",
  },
} as const;

type VariantMap = typeof variants;

export function StatusBadge<T extends keyof VariantMap>({
  type,
  status,
  className,
}: {
  type: T;
  status: keyof VariantMap[T] & string;
  className?: string;
}) {
  const style = variants[type][status as keyof VariantMap[T]] ?? "";
  const label = String(status).replace(/_/g, " ");

  return (
    <Badge variant="outline" className={cn("capitalize font-medium", style, className)}>
      {label}
    </Badge>
  );
}
