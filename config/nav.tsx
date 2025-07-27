import { BrainCircuit, Home, Package, TrendingUp } from "lucide-react";
import { NavItem } from "@/components/BottomNav";

const PlaceholderIcon = () => (
  <div className="h-6 w-6 bg-muted rounded-md"></div>
);

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
