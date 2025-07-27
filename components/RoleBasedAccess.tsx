"use client";

import { ReactNode } from "react";
import { useUserRole } from "@/hooks/useUserRole";
import { UserRole } from "@/data/supplyTypes";
import { Card, CardContent } from "@/components/ui/card";
import { Lock, Eye } from "lucide-react";

interface RoleBasedAccessProps {
  children: ReactNode;
  requiredRoles: UserRole[];
  mode?: "hide" | "disable" | "view-only"; // hide: don't show, disable: show but disabled, view-only: show in read-only mode
  fallback?: ReactNode;
}

export function RoleBasedAccess({
  children,
  requiredRoles,
  mode = "hide",
  fallback,
}: RoleBasedAccessProps) {
  const { profile, loading } = useUserRole();

  if (loading) {
    return null; // or a loading spinner
  }

  if (!profile || !profile.roles) {
    if (mode === "hide") return null;
    return fallback || <div>Access denied</div>;
  }

  const hasRequiredRole = requiredRoles.some((role) =>
    profile.roles.includes(role)
  );

  if (hasRequiredRole) {
    return <>{children}</>;
  }

  switch (mode) {
    case "hide":
      return null;

    case "disable":
      return (
        <div className="relative">
          <div className="opacity-50 pointer-events-none">{children}</div>
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Lock className="h-4 w-4" />
              Requires {requiredRoles.join(" or ")} role
            </div>
          </div>
        </div>
      );

    case "view-only":
      return (
        <div className="relative">
          <div className="pointer-events-none">{children}</div>
          <Card className="absolute top-2 right-2 bg-amber-50 border-amber-200">
            <CardContent className="p-2">
              <div className="flex items-center gap-1 text-xs text-amber-700">
                <Eye className="h-3 w-3" />
                View Only
              </div>
            </CardContent>
          </Card>
        </div>
      );

    default:
      return fallback || null;
  }
}

// Hook for checking role access in components
export function useRoleAccess(requiredRoles: UserRole[]) {
  const { profile } = useUserRole();

  const hasAccess = profile?.roles?.some((role) =>
    requiredRoles.includes(role)
  );

  return {
    hasAccess: !!hasAccess,
    userRoles: profile?.roles || [],
    canView: true, // Everyone can view (implement view-only logic)
  };
}
