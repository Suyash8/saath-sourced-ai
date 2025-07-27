"use client";

import { useUserRole } from "@/hooks/useUserRole";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Store,
  Truck,
  TrendingUp,
  Package,
  Users,
  ShoppingCart,
  Plus,
  BarChart3,
} from "lucide-react";
import Link from "next/link";

export function RoleBasedDashboardStats() {
  const { profile, loading, isVendor, isSupplier } = useUserRole();

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-3">
              <div className="h-4 bg-muted rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-muted rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!profile?.roles?.length) return null;

  const vendorStats = [
    {
      title: "Active Deals",
      value: "12",
      description: "Group buying opportunities",
      icon: Package,
      href: "/dashboard",
      color: "text-blue-600",
    },
    {
      title: "Monthly Savings",
      value: "₹4,250",
      description: "Compared to retail prices",
      icon: TrendingUp,
      href: "/orders",
      color: "text-green-600",
    },
    {
      title: "Orders This Month",
      value: "8",
      description: "Group buying orders",
      icon: ShoppingCart,
      href: "/orders",
      color: "text-purple-600",
    },
    {
      title: "Network Size",
      value: "23",
      description: "Connected vendors",
      icon: Users,
      href: "/assistant",
      color: "text-orange-600",
    },
  ];

  const supplierStats = [
    {
      title: "Active Supplies",
      value: "6",
      description: "Products in catalog",
      icon: Package,
      href: "/supplier",
      color: "text-blue-600",
    },
    {
      title: "Monthly Revenue",
      value: "₹18,500",
      description: "From vendor orders",
      icon: TrendingUp,
      href: "/orders",
      color: "text-green-600",
    },
    {
      title: "Vendor Connections",
      value: "45",
      description: "Active vendor relationships",
      icon: Users,
      href: "/supplier",
      color: "text-purple-600",
    },
    {
      title: "Fulfillment Rate",
      value: "94%",
      description: "Orders delivered on time",
      icon: BarChart3,
      href: "/orders",
      color: "text-orange-600",
    },
  ];

  const statsToShow =
    isVendor && isSupplier
      ? [...vendorStats.slice(0, 2), ...supplierStats.slice(0, 2)]
      : isSupplier
      ? supplierStats
      : vendorStats;

  return (
    <div className="space-y-6">
      {/* Role Badges */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground">Your roles:</span>
        {profile.roles.map((role) => (
          <Badge
            key={role}
            variant="secondary"
            className="flex items-center gap-1"
          >
            {role === "vendor" ? (
              <Store className="h-3 w-3" />
            ) : (
              <Truck className="h-3 w-3" />
            )}
            {role === "vendor" ? "Street Food Vendor" : "Supplier"}
          </Badge>
        ))}
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsToShow.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.title} href={stat.href}>
              <Card
                className="hover:shadow-md transition-all duration-200 hover:scale-[1.02] cursor-pointer"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-2 md:grid-cols-2">
            {isVendor && (
              <Button variant="outline" className="justify-start" asChild>
                <Link href="/dashboard">
                  <Package className="h-4 w-4 mr-2" />
                  Browse Group Deals
                </Link>
              </Button>
            )}
            {isSupplier && (
              <Button variant="outline" className="justify-start" asChild>
                <Link href="/supplier">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Supply
                </Link>
              </Button>
            )}
            <Button variant="outline" className="justify-start" asChild>
              <Link href="/orders">
                <ShoppingCart className="h-4 w-4 mr-2" />
                View Recent Orders
              </Link>
            </Button>
            <Button variant="outline" className="justify-start" asChild>
              <Link href="/assistant">
                <BarChart3 className="h-4 w-4 mr-2" />
                AI Assistant
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
