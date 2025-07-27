import { Header } from "@/components/Header";
import { StatusBadge, OrderStatus } from "@/components/StatusBadge";
import { getAdminApp } from "@/firebase/adminConfig";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { getUserIdFromSession } from "@/app/actions";
import { redirect } from "next/navigation";

interface PopulatedOrder {
  id: string;
  quantity: number;
  total: number;
  status: OrderStatus;
  createdAt: { seconds: number };
  productName: string;
}

async function getMyOrders(userId: string): Promise<PopulatedOrder[]> {
  if (!userId) return [];
  try {
    const firestore = getAdminApp().firestore();
    const ordersSnapshot = await firestore
      .collection("orders")
      .where("userId", "==", userId)
      .orderBy("createdAt", "desc")
      .get();
    if (ordersSnapshot.empty) return [];

    return ordersSnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as PopulatedOrder)
    );
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
}

export default async function OrdersPage() {
  const userId = await getUserIdFromSession();

  // If no user is logged in, redirect them to the login page.
  if (!userId) {
    redirect("/login");
  }

  const allOrders = await getMyOrders(userId);

  const activeStatuses: OrderStatus[] = ["confirmed", "processing", "at_hub"];
  const activeOrders = allOrders.filter((o) =>
    activeStatuses.includes(o.status)
  );
  const pastOrders = allOrders.filter(
    (o) => !activeStatuses.includes(o.status)
  );

  return (
    <div className="min-h-screen bg-background">
      <Header
        title="My Orders"
        subtitle="Track and manage your purchases"
        backHref="/dashboard"
      />
      <main className="container mx-auto p-4 space-y-6 pb-24">
        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Active Orders</h2>
          {activeOrders.length > 0 ? (
            <div className="space-y-3">
              {activeOrders.map((order) => (
                <Link
                  key={order.id}
                  href={`/track/${order.id}`}
                  className="block"
                >
                  <Card className="p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h3 className="font-medium">{order.productName}</h3>
                        <p className="text-sm text-muted-foreground">
                          {order.quantity}kg • ₹{order.total} total
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Order #{order.id.substring(0, 7)}
                        </p>
                      </div>
                      <StatusBadge status={order.status} />
                    </div>
                    <div className="flex justify-end">
                      <span className="text-primary text-sm font-medium">
                        Track Order →
                      </span>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground pl-2">
              You have no active orders.
            </p>
          )}
        </section>
        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Past Orders</h2>
          {pastOrders.length > 0 ? (
            <div className="space-y-3">
              {pastOrders.map((order) => (
                <Card key={order.id} className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-medium">{order.productName}</h3>
                      <p className="text-sm text-muted-foreground">
                        {order.quantity}kg • ₹{order.total} total
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Order #{order.id.substring(0, 7)}
                      </p>
                    </div>
                    <div className="text-right">
                      <StatusBadge status={order.status} />
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(
                          order.createdAt.seconds * 1000
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground pl-2">
              No past orders found.
            </p>
          )}
        </section>
      </main>
    </div>
  );
}
