// app/(app)/deals/[dealId]/page.tsx

import { getAdminApp } from "@/firebase/adminConfig";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { DealDetailsClient } from "./deal-details-client";

async function getDealDetails(dealId: string) {
  try {
    const firestore = getAdminApp().firestore();
    const dealDoc = await firestore.collection("groupBuys").doc(dealId).get();
    if (!dealDoc.exists) return null;

    const dealData = dealDoc.data();

    const ordersSnapshot = await firestore
      .collection("orders")
      .where("groupBuyId", "==", dealId)
      .limit(5)
      .get();

    const userIds = ordersSnapshot.docs.map((doc) => doc.data().userId);
    let users: {
      id: string;
      name: string;
      avatar: string;
    }[] = [];
    if (userIds.length > 0) {
      const usersSnapshot = await firestore
        .collection("users")
        .where("uid", "in", userIds)
        .get();
      users = usersSnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
        avatar: doc.data().avatar || `https://i.pravatar.cc/40?u=${doc.id}`,
      }));
    }

    return {
      id: dealDoc.id,
      productName: dealData?.productName,
      pricePerKg: dealData?.pricePerKg,
      targetQuantity: dealData?.targetQuantity,
      currentQuantity: dealData?.currentQuantity,
      vendorCount: dealData?.vendorCount || 0,
      imageUrl: dealData?.imageUrl,
      hubName: dealData?.hubName,
      users: users,
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

  if (!dealId) {
    notFound();
  }

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
