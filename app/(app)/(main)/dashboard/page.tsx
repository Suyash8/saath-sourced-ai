import { Header } from "@/components/Header";
import { IconButton } from "@/components/IconButton";
import { Bell, User } from "lucide-react";
import { getAdminApp } from "@/firebase/adminConfig";
import { Timestamp, DocumentData } from "firebase-admin/firestore";
import { getUserIdFromSession } from "@/app/actions";
import { DashboardClient } from "./dashboard-client";

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
  aiScore?: number;
  aiReasoning?: string;
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

async function getGroupBuysWithStoredScores(): Promise<SerializableGroupBuy[]> {
  try {
    const firestore = getAdminApp().firestore();
    const snapshot = await firestore
      .collection("groupBuys")
      .where("status", "==", "open")
      .orderBy("createdAt", "desc")
      .limit(20)
      .get();

    return snapshot.docs.map((doc) => {
      const data = doc.data() as FirestoreGroupBuy & {
        aiScore?: number;
        aiReasoning?: string;
      };
      return {
        id: doc.id,
        productName: data.productName,
        pricePerKg: data.pricePerKg,
        targetQuantity: data.targetQuantity,
        currentQuantity: data.currentQuantity,
        status: data.status,
        expiryDate: data.expiryDate.toDate().toISOString(),
        hubName: data.hubName,
        aiScore: data.aiScore,
        aiReasoning: data.aiReasoning,
      };
    });
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
  const userName = userData?.firstName || userData?.name || "User";
  const groupBuys = await getGroupBuysWithStoredScores();
  const notificationCount = userId
    ? await getUnreadNotificationCount(userId)
    : 0;

  return (
    <div>
      <div className="animate-in fade-in-0 slide-in-from-top-4 duration-500">
        <Header
          variant="dashboard"
          title={`Good morning, ${userName}!`}
          subtitle={
            groupBuys.length > 0
              ? `Saathi has found ${groupBuys.length} new high-value deals for you.`
              : "Saathi is searching for deals near you..."
          }
        >
          <div className="animate-in fade-in-0 slide-in-from-right-4 duration-500 delay-100">
            <IconButton
              href="/notifications"
              icon={Bell}
              className="!text-muted-foreground hover:!text-foreground transition-all duration-200 hover:scale-110"
              badgeCount={notificationCount}
            />
          </div>
          <div className="animate-in fade-in-0 slide-in-from-right-4 duration-500 delay-200">
            <IconButton
              href="/profile"
              icon={User}
              className="!text-muted-foreground hover:!text-foreground transition-all duration-200 hover:scale-110"
            />
          </div>
        </Header>
      </div>

      <main className="container mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        <DashboardClient initialDeals={groupBuys} userId={userId} />
      </main>
    </div>
  );
}
