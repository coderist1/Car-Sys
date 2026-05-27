import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppHeader } from "@/components/layout/app-header";
import { AdminGuard } from "@/components/admin/admin-guard";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TooltipProvider>
      <SidebarProvider defaultOpen>
        <AppSidebar />
        <SidebarInset className="flex flex-col min-h-svh">
          <AppHeader />
          <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
            <AdminGuard>{children}</AdminGuard>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
