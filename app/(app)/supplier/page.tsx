import { Header } from "@/components/Header";
import { User } from "lucide-react";
import Link from "next/link";
import { getAdminApp } from "@/firebase/adminConfig";
import { SupplierDemandCard, Demand } from "@/components/SupplierDemandCard";
import type { QueryDocumentSnapshot } from "firebase-admin/firestore";

async function getSupplierDemands(): Promise<{
  active: Demand[];
  accepted: Demand[];
}> {
  try {
    const firestore = getAdminApp().firestore();
    const openSnapshot = await firestore
      .collection("groupBuys")
      .where("status", "==", "open")
      .get();
    const acceptedSnapshot = await firestore
      .collection("groupBuys")
      .where("status", "==", "processing")
      .get();

    const mapDocToDemand = (doc: QueryDocumentSnapshot): Demand => {
      const data = doc.data();
      return {
        id: doc.id,
        productName: data.productName,
        currentQuantity: data.currentQuantity,
        hubName: data.hubName,
        status: data.status === "open" ? "new" : "in-progress",
        vendorCount: data.vendorCount || 0,
        deliveryDate: new Date(
          data.expiryDate.seconds * 1000
        ).toLocaleDateString(),
      };
    };

    const active = openSnapshot.docs.map(mapDocToDemand);
    const accepted = acceptedSnapshot.docs.map(mapDocToDemand);

    return { active, accepted };
  } catch (error) {
    console.error("Error fetching demands:", error);
    return { active: [], accepted: [] };
  }
}

export default async function SupplierDashboardPage() {
  const { active, accepted } = await getSupplierDemands();

  return (
    <div className="min-h-screen bg-background">
      <Header
        title="Supplier Dashboard"
        subtitle="Manage aggregated demand"
        backHref="/dashboard"
      >
        <Link href="/profile" aria-label="Profile">
          <User className="h-5 w-5 md:h-6 md:w-6" />
        </Link>
      </Header>
      <main className="p-4 space-y-6 pb-24 container mx-auto">
        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Active Demand</h2>
          {active.length > 0 ? (
            <div className="space-y-3">
              {active.map((demand) => (
                <SupplierDemandCard key={demand.id} demand={demand} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No new demands at the moment.
            </p>
          )}
        </section>
        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Accepted Demand</h2>
          {accepted.length > 0 ? (
            <div className="space-y-3">
              {accepted.map((demand) => (
                <SupplierDemandCard
                  key={demand.id}
                  demand={demand}
                  isAccepted
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              You have not accepted any demands.
            </p>
          )}
        </section>
      </main>
    </div>
  );
}
