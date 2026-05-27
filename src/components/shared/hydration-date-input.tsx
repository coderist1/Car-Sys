"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type HydrationDateInputProps = Omit<React.ComponentProps<typeof Input>, "type">;

/** Renders native date input only on client to avoid SSR hydration mismatches. */
export function HydrationDateInput({
  defaultValue,
  value,
  className,
  onChange,
  ...props
}: HydrationDateInputProps) {
  const [mounted, setMounted] = useState(false);
  const isControlled = value !== undefined;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        aria-hidden
        className={cn(
          "h-11 w-full rounded-lg border border-input bg-muted/40 animate-pulse",
          className
        )}
      />
    );
  }

  if (isControlled) {
    return (
      <Input
        type="date"
        value={value}
        onChange={onChange}
        className={className}
        suppressHydrationWarning
        {...props}
      />
    );
  }

  return (
    <Input
      type="date"
      defaultValue={defaultValue}
      onChange={onChange}
      className={className}
      suppressHydrationWarning
      {...props}
    />
  );
}
