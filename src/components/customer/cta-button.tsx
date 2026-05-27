import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { forwardRef, type ComponentProps } from "react";

type CtaButtonProps = ComponentProps<typeof Button> & {
  href?: string;
  variant?: "primary" | "outline" | "ghost";
};

export const CtaButton = forwardRef<HTMLButtonElement, CtaButtonProps>(
  function CtaButton({ className, children, href, variant = "primary", ...props }, ref) {
    const styles = cn(
      "h-11 w-full min-h-[44px] cursor-pointer rounded-full px-6 text-sm font-semibold transition-all sm:h-10 sm:w-auto",
      variant === "primary" &&
        "bg-cta text-cta-foreground shadow-md hover:bg-cta/90 hover:shadow-lg active:scale-[0.98] border-transparent",
      variant === "outline" &&
        "border-2 border-cta bg-white text-cta hover:bg-cta/5 shadow-none",
      variant === "ghost" && "text-foreground hover:bg-muted border-transparent",
      className
    );

    if (href) {
      return (
        <Button ref={ref} asChild className={styles} {...props}>
          <Link href={href}>{children}</Link>
        </Button>
      );
    }

    return (
      <Button ref={ref} type="button" className={styles} {...props}>
        {children}
      </Button>
    );
  }
);
