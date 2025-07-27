import { Header } from "@/components/Header";
import { IconButton } from "@/components/IconButton";
import { Bell, User } from "lucide-react";
import { getAdminApp } from "@/firebase/adminConfig";
import { Timestamp, DocumentData } from "firebase-admin/firestore";
import { GroupBuyCard } from "@/components/GroupBuyCard";
import { getUserIdFromSession } from "@/app/actions";

interface FirestoreGroupBuy {
  id: string;
  productName: string;
  pricePerKg: number;
  targetQuantity: number;
  currentQuantity: number;
  status: "open" | "closed" | "fulfilled";
  expiryDate: Timestamp;
  hubName: string;
}

export interface SerializableGroupBuy {
  id: string;
  productName: string;
  pricePerKg: number;
  targetQuantity: number;
  currentQuantity: number;
  status: "open" | "closed" | "fulfilled";
  expiryDate: string;
  hubName: string;
}

async function getUserData(
  userId: string | null
): Promise<DocumentData | null> {
  if (!userId) return null;
  try {
    const userDoc = await getAdminApp()
      .firestore()
      .collection("users")
      .doc(userId)
      .get();
    if (!userDoc.exists) return null;
    return userDoc.data() || null;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
}

async function getGroupBuys(): Promise<SerializableGroupBuy[]> {
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

    const groupBuys: SerializableGroupBuy[] = snapshot.docs.map((doc) => {
      const data = doc.data() as Omit<FirestoreGroupBuy, "id">;
      return {
        id: doc.id,
        ...data,
        expiryDate: data.expiryDate.toDate().toISOString(),
      };
    });

    return groupBuys;
  } catch (error) {
    console.error("Error fetching group buys:", error);
    return [];
  }
}

async function getUnreadNotificationCount(userId: string): Promise<number> {
  try {
    const notificationsRef = getAdminApp()
      .firestore()
      .collection("users")
      .doc(userId)
      .collection("notifications")
      .where("read", "==", false);

    const snapshot = await notificationsRef.count().get();
    return snapshot.data().count;
  } catch (error) {
    console.error("Error fetching notification count:", error);
    return 0;
  }
}

export default async function Home() {
  const userId = await getUserIdFromSession();
  const userData = await getUserData(userId);
  const userName = userData?.name || "User";
  const groupBuys = await getGroupBuys();
  const notificationCount = userId
    ? await getUnreadNotificationCount(userId)
    : 0;

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
          badgeCount={notificationCount}
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
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 grid-flow-row-dense">
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
