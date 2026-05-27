import { CustomerNavbar } from "@/components/customer/navbar";
import { CustomerFooter } from "@/components/customer/footer";
import { MobileBottomNav } from "@/components/customer/mobile-nav";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-svh flex-col">
      <CustomerNavbar />
      <main className="flex-1 pb-16 md:pb-0">{children}</main>
      <CustomerFooter />
      <MobileBottomNav />
    </div>
  );
}
