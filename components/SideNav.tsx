"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SaathiLogo } from "./SaathiLogo";
import { NavItem } from "./BottomNav";

export function SideNav({ navItems }: { navItems: NavItem[] }) {
  const pathname = usePathname();

  return (
    <div className="hidden md:flex md:w-56 md:flex-col">
      <div className="flex flex-col flex-grow pt-5 w-full bg-card border-r overflow-y-auto min-h-screen">
        <div className="flex flex-col items-center w-full px-4">
          <SaathiLogo size="sm" />
        </div>
        <div className="mt-5 flex-1 flex flex-col">
          <nav className="flex-1 px-2 pb-4 space-y-1">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/dashboard" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`
                    flex items-center px-3 py-2 text-sm font-medium rounded-md
                    ${
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }
                  `}
                >
                  <span className="mr-3 flex-shrink-0 [&>svg]:h-5 [&>svg]:w-5">
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}
