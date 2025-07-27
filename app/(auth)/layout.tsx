"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Redirect to dashboard if user is already logged in, but allow onboarding
  useEffect(() => {
    if (!loading && user && pathname !== "/onboarding") {
      router.push("/dashboard");
    }
  }, [user, loading, router, pathname]);

  // Show loading or nothing while checking auth status
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Don't render auth pages if user is logged in (except onboarding)
  if (user && pathname !== "/onboarding") {
    return null;
  }

  return <>{children}</>;
}
