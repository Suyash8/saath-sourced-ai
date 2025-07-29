import { AuthProvider } from "@/components/AuthProvider";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { RealtimeNotifier } from "@/components/RealTimeNotifier";
import { RoleBasedNavWrapper } from "@/components/RoleBasedNavWrapper";
import { Toaster } from "sonner";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ProtectedRoute>
        <div className="flex min-h-screen">
          <RoleBasedNavWrapper>
            <div className="flex flex-col flex-1">
              <main className="flex-1 pb-20 md:pb-0">{children}</main>
            </div>
          </RoleBasedNavWrapper>
          <Toaster richColors position="top-right" />
          <RealtimeNotifier />
        </div>
      </ProtectedRoute>
    </AuthProvider>
  );
}
