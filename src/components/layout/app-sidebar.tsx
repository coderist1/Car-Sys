"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  FileText,
  Wrench,
  Sparkles,
  UserCircle,
  Settings,
  User,
  ChevronRight,
  Car,
  BarChart3,
  Fuel,
  Route,
  CreditCard,
  LogOut,
  UserCog,
  ClipboardList,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { IDriveCDOLogo } from "@/components/brand/idrive-cdo-logo";
import { cn } from "@/lib/utils";
import { clearSession, getSession, type AuthSession } from "@/lib/auth/session";
import { getActor } from "@/lib/auth/permissions";
import {
  getAdminNavGroupsForRole,
  type AdminNavIcon,
  type AdminNavItem,
} from "@/lib/use-cases";

const iconMap: Record<AdminNavIcon, React.ComponentType<{ className?: string }>> = {
  dashboard: LayoutDashboard,
  calendar: CalendarDays,
  payment: CreditCard,
  car: Car,
  registration: ClipboardList,
  wrench: Wrench,
  sparkles: Sparkles,
  fuel: Fuel,
  trip: Route,
  history: FileText,
  driver: UserCircle,
  users: Users,
  staff: UserCog,
  customers: Users,
  reports: BarChart3,
};

const bottomNav = [
  { id: "settings", title: "Settings", href: "/admin/settings", icon: Settings },
  { id: "profile", title: "Profile", href: "/admin/profile", icon: User },
];

function NavLink({ item, pathname }: { item: AdminNavItem; pathname: string }) {
  const Icon = iconMap[item.icon];
  const isActive =
    item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);

  return (
    <SidebarMenuItem key={item.id}>
      <SidebarMenuButton
        asChild
        isActive={isActive}
        tooltip={item.label}
        className={cn(isActive && "bg-sidebar-accent font-medium")}
      >
        <Link href={item.href}>
          <Icon className="h-4 w-4 shrink-0" />
          <span className="truncate">{item.label}</span>
          {isActive && (
            <ChevronRight className="ml-auto h-4 w-4 opacity-50 group-data-[collapsible=icon]:hidden" />
          )}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [session, setSession] = useState<AuthSession | null>(null);

  useEffect(() => {
    setSession(getSession());
  }, [pathname]);

  const navGroups = session ? getAdminNavGroupsForRole(session.role) : getAdminNavGroupsForRole("staff");
  const portalLabel = session && getActor(session) === "admin" ? "Admin" : "Staff";

  function handleLogout() {
    clearSession();
    router.push("/login");
  }

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border px-3 py-4">
        <Link
          href="/admin"
          className="flex flex-col gap-0.5 group-data-[collapsible=icon]:items-center"
        >
          <IDriveCDOLogo
            size="sm"
            showWordmark
            className="group-data-[collapsible=icon]:[&>div:last-child]:hidden"
          />
          <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground group-data-[collapsible=icon]:hidden">
            {portalLabel} portal
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        {navGroups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <NavLink key={item.id} item={item} pathname={pathname} />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          {bottomNav.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
                  <Link href={item.href}>
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Log Out" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              <span>Log Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
