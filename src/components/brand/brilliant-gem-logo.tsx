import { cn } from "@/lib/utils";

interface BrilliantGemLogoProps {
  size?: "sm" | "md" | "lg";
  showWordmark?: boolean;
  className?: string;
  variant?: "light" | "dark";
}

const sizes = {
  sm: { box: "h-8 w-8 text-sm", title: "text-sm", sub: "text-[10px]" },
  md: { box: "h-9 w-9 text-base", title: "text-sm", sub: "text-xs" },
  lg: { box: "h-11 w-11 text-lg", title: "text-base", sub: "text-xs" },
};

export function BrilliantGemLogo({
  size = "md",
  showWordmark = true,
  className,
  variant = "dark",
}: BrilliantGemLogoProps) {
  const s = sizes[size];

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div
        className={cn(
          "flex shrink-0 items-center justify-center rounded-lg bg-cta font-bold text-white shadow-sm",
          s.box
        )}
      >
        B
      </div>
      {showWordmark && (
        <div className="flex min-w-0 flex-col leading-tight">
          <span
            className={cn(
              "font-bold tracking-tight",
              s.title,
              variant === "dark" ? "text-foreground" : "text-white"
            )}
          >
            Brilliant Gem
          </span>
          <span
            className={cn(
              s.sub,
              variant === "dark" ? "text-muted-foreground" : "text-white/70"
            )}
          >
            Car Rental
          </span>
        </div>
      )}
    </div>
  );
}
