import { BottomNav } from "@/components/BottomNav";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { vendorNavItems } from "@/config/nav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen">
        <main className="flex-1 pb-20 md:pb-0">{children}</main>
        <BottomNav navItems={vendorNavItems} />
      </div>
    </ProtectedRoute>
  );
}
