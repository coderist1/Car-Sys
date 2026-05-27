"use client";

import { Bell, Menu, Moon, Sun } from "lucide-react";
import { useRouter } from "next/navigation";
import { BrilliantGemLogo } from "@/components/brand/brilliant-gem-logo";
import { useSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { clearSession, getSession } from "@/lib/auth/session";
import { getActor } from "@/lib/auth/permissions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";

export function AppHeader() {
  const router = useRouter();
  const { toggleSidebar } = useSidebar();
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);
  const session = mounted ? getSession() : null;
  const actor = session ? getActor(session) : "admin";
  const portalTitle =
    actor === "admin" ? "Brilliant Gem Admin" : actor === "staff" ? "Brilliant Gem Staff" : "Brilliant Gem";
  const initials =
    session?.displayName
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() ?? "BG";

  useEffect(() => {
    setMounted(true);
  }, []);

  function handleLogout() {
    clearSession();
    router.push("/login");
  }

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.classList.toggle("dark", dark);
  }, [dark, mounted]);

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-3 border-b bg-background/80 px-4 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 sm:gap-4 lg:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9 shrink-0"
        onClick={toggleSidebar}
        aria-label="Toggle sidebar menu"
      >
        <Menu className="h-5 w-5" />
      </Button>

      <div className="flex min-w-0 flex-1 items-center md:hidden">
        <BrilliantGemLogo size="sm" showWordmark />
      </div>
      <div className="hidden min-w-0 flex-1 items-center md:flex">
        <span className="truncate text-sm font-medium text-muted-foreground">
          Brilliant Gem Admin
        </span>
      </div>

      <div className="flex shrink-0 items-center gap-1 sm:gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9"
          onClick={() => setDark(!dark)}
          aria-label="Toggle theme"
        >
          {mounted ? (
            dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </Button>
        <Button variant="ghost" size="icon" className="relative h-9 w-9">
          <Bell className="h-4 w-4" />
          <Badge className="absolute -right-0.5 -top-0.5 h-4 w-4 rounded-full p-0 text-[10px] flex items-center justify-center">
            3
          </Badge>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 gap-2 px-2">
              <Avatar className="h-7 w-7">
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <span className="hidden text-sm font-medium lg:inline">
                {session?.displayName ?? "User"}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span>{session?.displayName ?? "Admin"}</span>
                <span className="text-xs font-normal text-muted-foreground">
                  {session?.email ?? "admin@fleetpro.io"}
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>Log Out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
