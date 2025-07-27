import { getAdminApp } from "@/firebase/adminConfig";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { DealDetailsClient } from "./deal-details-client";

async function getDealDetails(dealId: string) {
  try {
    const firestore = getAdminApp().firestore();
    const dealDoc = await firestore.collection("groupBuys").doc(dealId).get();
    if (!dealDoc.exists) return null;

    const mockUsers = [
      {
        id: "1",
        name: "Raju",
        avatar: "https://i.pravatar.cc/40?u=a042581f4e29026704d",
      },
      {
        id: "2",
        name: "Priya",
        avatar: "https://i.pravatar.cc/40?u=a042581f4e29026705d",
      },
      {
        id: "3",
        name: "Amit",
        avatar: "https://i.pravatar.cc/40?u=a042581f4e29026706d",
      },
    ];

    const dealData = dealDoc.data();

    return {
      id: dealDoc.id,
      productName: dealData?.productName,
      pricePerKg: dealData?.pricePerKg,
      targetQuantity: dealData?.targetQuantity,
      currentQuantity: dealData?.currentQuantity,
      vendorCount: dealData?.vendorCount,
      imageUrl: dealData?.imageUrl,
      users: mockUsers,
    };
  } catch (error) {
    console.error("Error fetching deal details:", error);
    return null;
  }
}

export default async function DealDetailsPage({
  params,
}: {
  params: Promise<{ dealId: string }>;
}) {
  const { dealId } = await params;
  const deal = await getDealDetails(dealId);

  if (!deal) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header title="Deal Details" backHref="/dashboard" />
      <DealDetailsClient deal={deal} />
    </div>
  );
}
