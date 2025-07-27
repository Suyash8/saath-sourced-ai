"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { GenerateMockDataButton } from "@/components/GenerateMockDataButton";
import { useUserRole } from "@/hooks/useUserRole";
import { User, Package, Eye, Lock } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SupplierDemandCard, Demand } from "@/components/SupplierDemandCard";

export default function SupplierDashboardPage() {
  const { loading, canInteract } = useUserRole();
  const [demands, setDemands] = useState<{
    active: Demand[];
    accepted: Demand[];
  }>({
    active: [],
    accepted: [],
  });
  const [isLoadingDemands, setIsLoadingDemands] = useState(true);

  useEffect(() => {
    const fetchDemands = async () => {
      try {
        const response = await fetch("/api/supplier/demands");
        if (response.ok) {
          const data = await response.json();
          setDemands(data);
        }
      } catch (error) {
        console.error("Error fetching demands:", error);
      } finally {
        setIsLoadingDemands(false);
      }
    };

    fetchDemands();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const renderContent = () => {
    if (!canInteract("supplier")) {
      return (
        <div className="text-center p-8">
          <div className="bg-muted/50 p-6 rounded-lg max-w-md mx-auto">
            <Eye className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">View Only Mode</h3>
            <p className="text-muted-foreground mb-4">
              You&apos;re viewing the supplier dashboard. To interact with
              demands, you need supplier access.
            </p>
            <Button asChild variant="outline">
              <Link href="/profile">
                <Lock className="h-4 w-4 mr-2" />
                Update Profile
              </Link>
            </Button>
          </div>
        </div>
      );
    }

    return (
      <>
        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Active Demand</h2>
          {demands.active.length > 0 ? (
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {demands.active.map((demand) => (
                <SupplierDemandCard key={demand.id} demand={demand} />
              ))}
            </div>
          ) : demands.active.length === 0 && demands.accepted.length === 0 ? (
            <div className="text-center p-8 border-2 border-dashed rounded-lg">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No supplier demands</h3>
              <p className="text-muted-foreground mb-6">
                Generate some sample supplier demands to get started
              </p>
              <GenerateMockDataButton
                endpoint="/api/mock-data/supplier"
                label="Generate Sample Demands"
              />
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No new demands at the moment.
            </p>
          )}
        </section>
        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Accepted Demand</h2>
          {demands.accepted.length > 0 ? (
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {demands.accepted.map((demand) => (
                <SupplierDemandCard key={demand.id} demand={demand} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              You have not accepted any demands.
            </p>
          )}
        </section>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        title="Supplier Dashboard"
        subtitle={
          canInteract("supplier")
            ? "Manage aggregated demand"
            : "View supplier demands (Read-only)"
        }
        backHref="/dashboard"
      >
        <Link href="/profile" aria-label="Profile">
          <User className="h-5 w-5 md:h-6 md:w-6" />
        </Link>
      </Header>
      <main className="p-4 space-y-6 pb-24 container mx-auto">
        {isLoadingDemands ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          </div>
        ) : (
          renderContent()
        )}
      </main>
    </div>
  );
}
