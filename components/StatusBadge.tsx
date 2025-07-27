// components/StatusBadge.tsx
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type OrderStatus =
  | "confirmed"
  | "processing"
  | "at_hub"
  | "delivered"
  | "cancelled";
export type DemandStatus = "new" | "urgent" | "in-progress";

type StatusBadgeProps = {
  status: OrderStatus | DemandStatus;
};

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const statusStyles: Record<
    OrderStatus | DemandStatus,
    { text: string; className: string }
  > = {
    // Vendor Order Statuses
    confirmed: {
      text: "Confirmed",
      className: "bg-blue-100 text-blue-800 border-blue-200",
    },
    processing: {
      text: "Processing",
      className: "bg-amber-100 text-amber-800 border-amber-200",
    },
    at_hub: {
      text: "At Hub",
      className: "bg-purple-100 text-purple-800 border-purple-200",
    },
    delivered: {
      text: "Delivered",
      className: "bg-green-100 text-green-800 border-green-200",
    },
    cancelled: {
      text: "Cancelled",
      className: "bg-red-100 text-red-800 border-red-200",
    },
    // Supplier Demand Statuses
    new: { text: "New", className: "bg-sky-100 text-sky-800 border-sky-200" },
    urgent: {
      text: "Urgent",
      className: "bg-orange-100 text-orange-800 border-orange-200",
    },
    "in-progress": {
      text: "In Progress",
      className: "bg-indigo-100 text-indigo-800 border-indigo-200",
    },
  };

  const style = statusStyles[status] || {
    text: "Unknown",
    className: "bg-gray-100 text-gray-800",
  };

  return (
    <Badge variant="outline" className={cn("capitalize", style.className)}>
      {style.text}
    </Badge>
  );
};
