"use client";

import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type ClientOnlySelectProps = {
  value: string;
  onValueChange: (value: string) => void;
  placeholder: string;
  triggerClassName?: string;
  items: { value: string; label: string }[];
};

/** Radix Select can mismatch SSR markup; render after mount. */
export function ClientOnlySelect({
  value,
  onValueChange,
  placeholder,
  triggerClassName,
  items,
}: ClientOnlySelectProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className={cn(
          "flex h-8 w-full items-center rounded-lg border border-input bg-muted/40 px-2.5 text-sm text-muted-foreground",
          triggerClassName
        )}
      >
        {placeholder}
      </div>
    );
  }

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={cn("w-full", triggerClassName)}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {items.map((item) => (
          <SelectItem key={item.value} value={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
