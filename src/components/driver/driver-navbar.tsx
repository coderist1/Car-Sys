"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { IDriveCDOLogo } from "@/components/brand/idrive-cdo-logo";
import { Button } from "@/components/ui/button";
import { clearSession, getSession } from "@/lib/auth/session";
import { driverNavLinks } from "@/lib/use-cases";

export function DriverNavbar() {
  const router = useRouter();
  const session = getSession();

  return (
    <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
        <Link href="/driver/trips">
          <IDriveCDOLogo size="sm" variant="dark" />
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
          {driverNavLinks.map((u) => (
            <Link key={u.id} href={u.href} className="hover:text-cta">
              {u.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <span className="hidden sm:text-sm text-muted-foreground">
            {session?.displayName ?? "Driver"}
          </span>
          <Button
            variant="outline"
            size="sm"
            className="gap-1"
            onClick={() => {
              clearSession();
              router.push("/login");
            }}
          >
            <LogOut className="h-4 w-4" />
            Log Out
          </Button>
        </div>
      </div>
    </header>
  );
}
