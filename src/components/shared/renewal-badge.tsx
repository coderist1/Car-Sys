import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { RenewalStatus } from "@/lib/db/types";

const styles: Record<RenewalStatus, string> = {
  valid: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20 dark:text-emerald-400",
  expiring_soon: "bg-amber-500/10 text-amber-700 border-amber-500/20 dark:text-amber-400",
  expired: "bg-rose-500/10 text-rose-700 border-rose-500/20 dark:text-rose-400",
};

const labels: Record<RenewalStatus, string> = {
  valid: "Valid",
  expiring_soon: "Expiring soon",
  expired: "Expired",
};

export function RenewalBadge({ status }: { status: RenewalStatus }) {
  return (
    <Badge variant="outline" className={cn("text-xs font-medium", styles[status])}>
      {labels[status]}
    </Badge>
  );
}
