"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { clearSession, getSession, type AuthSession } from "@/lib/auth/session";
import { BrilliantGemLogo } from "@/components/brand/brilliant-gem-logo";
import { CtaButton } from "@/components/customer/cta-button";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { customerNavLinks } from "@/lib/use-cases";

export function CustomerNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [session, setSession] = useState<AuthSession | null>(null);
  const isHome = pathname === "/";

  useEffect(() => {
    setSession(getSession());
  }, [pathname]);

  function handleSignOut() {
    clearSession();
    setSession(null);
    setOpen(false);
    router.push("/");
    router.refresh();
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b backdrop-blur-md",
        isHome
          ? "border-transparent bg-white/90"
          : "border-border bg-white/95"
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="shrink-0">
          <BrilliantGemLogo size="sm" variant="dark" />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {customerNavLinks.map((l) => {
            const active =
              l.href === "/"
                ? pathname === "/"
                : pathname.startsWith(l.href);
            return (
              <Link
                key={l.id}
                href={l.href}
                className={cn(
                  "text-sm font-medium text-muted-foreground transition-colors hover:text-cta",
                  active && "text-cta"
                )}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-4 sm:flex">
          {session ? (
            <>
              <Link
                href="/dashboard"
                className="text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                {session.displayName.split(" ")[0]}
              </Link>
              <button
                type="button"
                onClick={handleSignOut}
                className="text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                Login / Register
              </Link>
              <CtaButton href="/login" className="!min-w-[100px] !rounded-full">
                Login / Register
              </CtaButton>
            </>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {open && (
        <div className="border-t border-border bg-white px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-1">
            {customerNavLinks.map((l) => (
              <Link
                key={l.id}
                href={l.href}
                className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-muted"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            {session ? (
              <>
                <Link
                  href="/dashboard"
                  className="rounded-lg px-3 py-2.5 text-sm font-medium"
                  onClick={() => setOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  type="button"
                  className="mt-3 w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium hover:bg-muted"
                  onClick={handleSignOut}
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="rounded-lg px-3 py-2.5 text-sm" onClick={() => setOpen(false)}>
                  Login
                </Link>
                <CtaButton href="/login" className="mt-3">
                  Sign Up
                </CtaButton>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
