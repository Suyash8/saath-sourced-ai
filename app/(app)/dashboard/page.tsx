// "use client";

import { Header, IconButton } from "@/components/layout/Header";
import { Bell, User } from "lucide-react";
import { getAdminApp } from "@/firebase/adminConfig";
import { Timestamp } from "firebase-admin/firestore";
import { GroupBuyCard } from "@/components/layout/GroupBuyCard";

interface GroupBuy {
  id: string;
  productName: string;
  pricePerKg: number;
  targetQuantity: number;
  currentQuantity: number;
  status: "open" | "closed" | "fulfilled";
  expiryDate: Timestamp;
  hubName: string;
}

async function getGroupBuys(): Promise<GroupBuy[]> {
  try {
    const firestore = getAdminApp().firestore();
    const groupBuysRef = firestore.collection("groupBuys");
    const snapshot = await groupBuysRef
      .where("status", "==", "open")
      .where("expiryDate", ">", Timestamp.now())
      .get();

    if (snapshot.empty) {
      return [];
    }

    const groupBuys: GroupBuy[] = snapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as GroupBuy)
    );

    return groupBuys;
  } catch (error) {
    console.error("Error fetching group buys:", error);
    return [];
  }
}

export default async function Home() {
  const userName = "User";
  const groupBuys = await getGroupBuys();

  return (
    <div>
      <Header
        variant="dashboard"
        title={`Good morning, ${userName}!`}
        subtitle={
          groupBuys.length > 0
            ? `Saathi has found ${groupBuys.length} new high-value deals for you.`
            : "Saathi is searching for deals near you..."
        }
      >
        <IconButton
          href="/notifications"
          icon={Bell}
          className="!text-muted-foreground hover:!text-foreground"
        />
        <IconButton
          href="/profile"
          icon={User}
          className="!text-muted-foreground hover:!text-foreground"
        />
      </Header>

      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <h2 className="text-xl font-bold mb-4">Top Deals for You</h2>

        {groupBuys.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {groupBuys.map((buy) => (
              <GroupBuyCard key={buy.id} buy={buy} />
            ))}
          </div>
        ) : (
          <div className="text-center p-8 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground">
              No active deals found right now.
            </p>
            <p className="text-sm text-muted-foreground">Check back soon!</p>
          </div>
        )}
      </main>
    </div>
  );
}
