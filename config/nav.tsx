import { Home, Package, TrendingUp } from "lucide-react";
import { NavItem } from "@/components/layout/BottomNav"; // Import the type

// Placeholder for icons you haven't chosen yet
const PlaceholderIcon = () => (
  <div className="h-6 w-6 bg-muted rounded-md"></div>
);

export const vendorNavItems: NavItem[] = [
  {
    href: "/dashboard",
    label: "Deals",
    icon: <Home className="h-6 w-6" />,
    placeholderIcon: <PlaceholderIcon />,
  },
  {
    href: "/orders",
    label: "Orders",
    icon: <Package className="h-6 w-6" />,
    placeholderIcon: <PlaceholderIcon />,
  },
  {
    href: "/supplier",
    label: "Supplier",
    icon: <TrendingUp className="h-6 w-6" />,
    placeholderIcon: <PlaceholderIcon />,
  },
];
