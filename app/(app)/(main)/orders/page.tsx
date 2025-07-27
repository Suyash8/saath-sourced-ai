import { Header } from "@/components/Header";
import { StatusBadge, OrderStatus } from "@/components/StatusBadge";
import { GenerateMockDataButton } from "@/components/GenerateMockDataButton";
import { getAdminApp } from "@/firebase/adminConfig";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { getUserIdFromSession } from "@/app/actions";
import { redirect } from "next/navigation";
import { Package } from "lucide-react";

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
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {activeOrders.map((order) => (
                <Link
                  key={order.id}
                  href={`/track/${order.id}`}
                  className="block"
                >
                  <Card className="p-4 hover:bg-muted/50 transition-all duration-200 hover:scale-[1.02] hover:shadow-md">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium truncate">
                            {order.productName}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {order.quantity}kg • ₹{order.total}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            #{order.id.substring(0, 7)}
                          </p>
                        </div>
                        <StatusBadge status={order.status} />
                      </div>
                      <div className="flex justify-end">
                        <span className="text-primary text-sm font-medium">
                          Track Order →
                        </span>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          ) : allOrders.length === 0 ? (
            <div className="text-center p-8 border-2 border-dashed rounded-lg">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No orders yet</h3>
              <p className="text-muted-foreground mb-6">
                Generate some sample orders to get started
              </p>
              <GenerateMockDataButton
                endpoint="/api/mock-data/orders"
                label="Generate Sample Orders"
              />
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
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {pastOrders.map((order) => (
                <Card
                  key={order.id}
                  className="p-4 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate">
                          {order.productName}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {order.quantity}kg • ₹{order.total}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          #{order.id.substring(0, 7)}
                        </p>
                      </div>
                      <StatusBadge status={order.status} />
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">
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
