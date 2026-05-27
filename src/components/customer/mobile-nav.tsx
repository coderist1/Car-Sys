"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Car, Calendar, User } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/vehicles", icon: Car, label: "Select Vehicle" },
  { href: "/book", icon: Calendar, label: "Make Booking" },
  { href: "/dashboard", icon: User, label: "My Bookings" },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white/95 backdrop-blur-md pb-safe md:hidden">
      <div className="flex h-16 items-center justify-around">
        {items.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] font-medium transition",
                active ? "text-cta font-medium" : "text-muted-foreground"
              )}
            >
              <item.icon className={cn("h-5 w-5", active && "text-cta")} />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
