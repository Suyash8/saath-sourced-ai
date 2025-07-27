import { getAdminApp } from "@/firebase/adminConfig";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import { BarChart } from "@/components/BarChart";

type Demand = {
  id: string;
  status: string;
  productName: string;
  expiryDate: { seconds: number };
  currentQuantity: number;
  targetQuantity: number;
  hubName: string;
  vendorCount?: number;
};

async function getDemandDetails(demandId: string): Promise<Demand | null> {
  try {
    const firestore = getAdminApp().firestore();
    const demandDoc = await firestore
      .collection("groupBuys")
      .doc(demandId)
      .get();
    if (!demandDoc.exists) return null;
    return { id: demandDoc.id, ...demandDoc.data() } as Demand;
  } catch (error) {
    console.error("Error fetching demand details:", error);
    return null;
  }
}

export default async function SupplierDemandDetailPage({
  params,
}: {
  params: Promise<{ demandId: string }>;
}) {
  const { demandId } = await params;
  const demand = await getDemandDetails(demandId);

  if (!demand) {
    notFound();
  }

  const demandStatus = demand.status === "open" ? "new" : "in-progress";

  return (
    <div className="min-h-screen bg-background">
      <Header
        title="Demand Details"
        subtitle={`Demand #${demand.id.substring(0, 7)}`}
        backHref="/supplier"
      />
      <main className="p-4 container mx-auto space-y-4">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CardTitle>{demand.productName}</CardTitle>
              <StatusBadge status={demandStatus} />
            </div>
            <CardDescription>
              Last updated:{" "}
              {new Date(demand.expiryDate.seconds * 1000).toLocaleString()}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Total Quantity
              </p>
              <p className="text-2xl font-bold">
                {demand.currentQuantity} / {demand.targetQuantity} kg
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Target Hub
              </p>
              <p className="text-lg font-semibold">{demand.hubName}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Participating Vendors
              </p>
              <p className="text-2xl font-bold">{demand.vendorCount || 0}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Order Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              A visual representation of order sizes from vendors.
            </p>
            <BarChart
              data={[{ label: "Total Demand", value: demand.currentQuantity }]}
              height={100}
            />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
