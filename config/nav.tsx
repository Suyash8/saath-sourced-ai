import {
  BrainCircuit,
  Home,
  Package,
  TrendingUp,
  Bell,
  User,
  Store,
  Truck,
} from "lucide-react";
import { NavItem } from "@/components/BottomNav";
import { UserRole } from "@/data/supplyTypes";

const PlaceholderIcon = () => (
  <div className="h-6 w-6 bg-muted rounded-md"></div>
);

export interface ExtendedNavItem extends NavItem {
  roles: UserRole[];
  requiresRole?: boolean; // If true, user must have at least one of the roles to interact
}

export const allNavItems: ExtendedNavItem[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: <Home />,
    placeholderIcon: <PlaceholderIcon />,
    roles: ["vendor", "supplier"],
    requiresRole: false,
  },
  {
    href: "/orders",
    label: "Orders",
    icon: <Package />,
    placeholderIcon: <PlaceholderIcon />,
    roles: ["vendor", "supplier"],
    requiresRole: false,
  },
  {
    href: "/supplier",
    label: "Supplier Hub",
    icon: <TrendingUp />,
    placeholderIcon: <PlaceholderIcon />,
    roles: ["supplier"],
    requiresRole: true,
  },
  {
    href: "/notifications",
    label: "Notifications",
    icon: <Bell />,
    placeholderIcon: <PlaceholderIcon />,
    roles: ["vendor", "supplier"],
    requiresRole: false,
  },
  {
    href: "/assistant",
    label: "Assistant",
    icon: <BrainCircuit />,
    placeholderIcon: <PlaceholderIcon />,
    roles: ["vendor", "supplier"],
    requiresRole: false,
  },
  {
    href: "/profile",
    label: "Profile",
    icon: <User />,
    placeholderIcon: <PlaceholderIcon />,
    roles: ["vendor", "supplier"],
    requiresRole: false,
  },
];

// Default nav items for vendor role (backward compatibility)
export const vendorNavItems: NavItem[] = [
  {
    href: "/dashboard",
    label: "Deals",
    icon: <Home />,
    placeholderIcon: <PlaceholderIcon />,
  },
  {
    href: "/orders",
    label: "Orders",
    icon: <Package />,
    placeholderIcon: <PlaceholderIcon />,
  },
  {
    href: "/supplier",
    label: "Supplier",
    icon: <TrendingUp />,
    placeholderIcon: <PlaceholderIcon />,
  },
  {
    href: "/assistant",
    label: "Assistant",
    icon: <BrainCircuit />,
    placeholderIcon: <PlaceholderIcon />,
  },
];

// Function to get navigation items based on user roles
export const getNavItemsForRoles = (userRoles: UserRole[]): NavItem[] => {
  return allNavItems
    .filter(
      (item) =>
        !item.requiresRole ||
        item.roles.some((role) => userRoles.includes(role))
    )
    .map(({ roles, requiresRole, ...navItem }) => navItem);
};
