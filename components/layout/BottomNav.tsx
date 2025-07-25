"use client";

import { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

type BottomNavItemProps = {
  href: string;
  label: string;
  icon: ReactNode;
  isActive: boolean;
};

const BottomNavItem = ({ href, label, icon, isActive }: BottomNavItemProps) => {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push(href)}
      className={cn(
        "flex flex-col items-center gap-1 flex-1 py-2",
        isActive
          ? "text-primary"
          : "text-muted-foreground hover:text-foreground"
      )}
    >
      {/* 
        We use a div wrapper for the icon to ensure consistent sizing.
        This makes it easy to swap between a real icon and a placeholder div.
      */}
      <div className="h-6 w-6 flex items-center justify-center">{icon}</div>
      <span className="text-xs font-medium">{label}</span>
    </button>
  );
};

// --- Main Bottom Navigation Component ---
export type NavItem = {
  href: string;
  label: string;
  icon: ReactNode;
  placeholderIcon?: ReactNode;
};

type BottomNavProps = {
  navItems: NavItem[];
};

export const BottomNav = ({ navItems }: BottomNavProps) => {
  const pathname = usePathname();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border">
      <div className="flex justify-around items-center">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);

          return (
            <BottomNavItem
              key={item.href}
              href={item.href}
              label={item.label}
              icon={item.icon || item.placeholderIcon}
              isActive={isActive}
            />
          );
        })}
      </div>
    </div>
  );
};
