"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type BottomNavItemProps = {
  href: string;
  label: string;
  icon: ReactNode;
  isActive: boolean;
};

const BottomNavItem = ({ href, label, icon, isActive }: BottomNavItemProps) => {
  return (
    <Link
      href={href}
      className={cn(
        "flex flex-col items-center gap-1 flex-1 py-2 transition-colors",
        isActive
          ? "text-primary"
          : "text-muted-foreground hover:text-foreground"
      )}
    >
      <div className="h-6 w-6 flex items-center justify-center">{icon}</div>
      <span className="text-xs font-medium">{label}</span>
    </Link>
  );
};

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
