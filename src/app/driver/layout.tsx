import { DriverNavbar } from "@/components/driver/driver-navbar";
import { DriverGuard } from "@/components/driver/driver-guard";

export default function DriverLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-svh flex-col bg-background">
      <DriverNavbar />
      <main className="flex-1">
        <DriverGuard>{children}</DriverGuard>
      </main>
    </div>
  );
}
