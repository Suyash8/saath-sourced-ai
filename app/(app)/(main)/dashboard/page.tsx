import { Header } from "@/components/Header";
import { IconButton } from "@/components/IconButton";
import { GenerateMockDataButton } from "@/components/GenerateMockDataButton";
import { RoleBasedDashboardStats } from "@/components/RoleBasedDashboardStats";
import { Bell, Package, User } from "lucide-react";
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
        productName: data.productName,
        pricePerKg: data.pricePerKg,
        targetQuantity: data.targetQuantity,
        currentQuantity: data.currentQuantity,
        status: data.status,
        hubName: data.hubName,
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
  const userName = userData?.firstName || userData?.name || "User";
  const groupBuys = await getGroupBuys();
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
        {/* Role-based Dashboard Stats */}
        <div className="animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
          <RoleBasedDashboardStats />
        </div>

        {/* Group Buying Deals */}
        <div className="animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
          <h2 className="text-xl font-bold mb-4 animate-in fade-in-0 slide-in-from-left-4 duration-500 delay-200">
            Top Deals for You
          </h2>

          {groupBuys.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 grid-flow-row-dense">
              {groupBuys.map((buy, index) => (
                <div
                  key={buy.id}
                  className="animate-in fade-in-0 slide-in-from-bottom-4 duration-500"
                  style={{
                    animationDelay: `${300 + index * 100}ms`,
                    animationFillMode: "both",
                  }}
                >
                  <div className="transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
                    <GroupBuyCard buy={buy} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-8 border-2 border-dashed rounded-lg animate-in fade-in-0 zoom-in-95 duration-500 delay-300 hover:border-primary/50 transition-colors">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No deals available</h3>
              <p className="text-muted-foreground mb-6">
                Generate some sample deals to get started
              </p>
              <GenerateMockDataButton
                endpoint="/api/mock-data/deals"
                label="Generate Sample Deals"
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
