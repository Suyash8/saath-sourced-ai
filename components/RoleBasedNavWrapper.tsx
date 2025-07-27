"use client";

import { ReactNode } from "react";
import { BottomNav } from "@/components/BottomNav";
import { SideNav } from "@/components/SideNav";
import { useUserRole } from "@/hooks/useUserRole";
import { getNavItemsForRoles, vendorNavItems } from "@/config/nav";

interface RoleBasedNavWrapperProps {
  children: ReactNode;
}

export function RoleBasedNavWrapper({ children }: RoleBasedNavWrapperProps) {
  const { profile, loading } = useUserRole();

  // While loading or if no profile, use default nav items
  const navItems =
    loading || !profile?.roles
      ? vendorNavItems
      : getNavItemsForRoles(profile.roles);

  return (
    <>
      <SideNav navItems={navItems} />
      {children}
      <BottomNav navItems={navItems} />
    </>
  );
}
