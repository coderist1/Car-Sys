import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { forwardRef, type ComponentProps } from "react";

export const PageActionButton = forwardRef<
  HTMLButtonElement,
  ComponentProps<typeof Button> & { actionVariant?: "primary" | "outline" }
>(function PageActionButton(
  { className, children, type = "button", actionVariant = "primary", variant, ...props },
  ref
) {
  return (
    <Button
      ref={ref}
      type={type}
      variant={variant ?? "default"}
      size="sm"
      className={cn(
        "h-11 w-full min-h-[44px] cursor-pointer gap-2 rounded-xl px-4 text-sm font-semibold shadow-md sm:h-10 sm:w-auto",
        actionVariant === "primary" &&
          "bg-cta text-cta-foreground hover:bg-cta/90 border-transparent",
        actionVariant === "outline" &&
          "border-2 border-border bg-background text-foreground hover:bg-muted shadow-none",
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
});
