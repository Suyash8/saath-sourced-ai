"use client";

import { ReactNode, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUserRole } from "@/hooks/useUserRole";
import { UserRole } from "@/data/supplyTypes";
import { RoleBasedAccess } from "@/components/RoleBasedAccess";

interface PageAccessWrapperProps {
  children: ReactNode;
  requiredRoles?: UserRole[];
  fallbackMode?: "hide" | "disable" | "view-only";
}

// Define page access rules
const PAGE_ACCESS_RULES: Record<string, UserRole[]> = {
  "/supplier": ["supplier"],
  "/vendor": ["vendor"],
  // Dashboard, notifications, orders, assistant, profile are accessible to all roles
};

export function PageAccessWrapper({
  children,
  requiredRoles,
  fallbackMode = "view-only",
}: PageAccessWrapperProps) {
  const { profile, loading } = useUserRole();
  const router = useRouter();
  const pathname = usePathname();

  // Determine required roles from pathname if not explicitly provided
  const pageRequiredRoles = requiredRoles || PAGE_ACCESS_RULES[pathname] || [];

  useEffect(() => {
    // Check if user has completed onboarding
    if (!loading && profile && !profile.onboardingCompleted) {
      router.push("/onboarding");
    }
  }, [profile, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If no roles required for this page, render children directly
  if (pageRequiredRoles.length === 0) {
    return <>{children}</>;
  }

  // Use role-based access control for pages that require specific roles
  return (
    <RoleBasedAccess requiredRoles={pageRequiredRoles} mode={fallbackMode}>
      {children}
    </RoleBasedAccess>
  );
}
