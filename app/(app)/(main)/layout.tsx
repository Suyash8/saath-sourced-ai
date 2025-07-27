import { AuthProvider } from "@/components/AuthProvider";
import { BottomNav } from "@/components/BottomNav";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { RealtimeNotifier } from "@/components/RealTimeNotifier";
import { SideNav } from "@/components/SideNav";
import { vendorNavItems } from "@/config/nav";
import { Toaster } from "sonner";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ProtectedRoute>
        <div className="flex min-h-screen">
          <SideNav navItems={vendorNavItems} />
          <div className="flex flex-col flex-1">
            <main className="flex-1 pb-20 md:pb-0">{children}</main>
            <BottomNav navItems={vendorNavItems} />
          </div>
          <Toaster richColors position="top-right" />
          <RealtimeNotifier />
        </div>
      </ProtectedRoute>
    </AuthProvider>
  );
}
