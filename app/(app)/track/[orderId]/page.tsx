import { getAdminApp } from "@/firebase/adminConfig";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Package, Truck, Navigation } from "lucide-react";
import Image from "next/image";

async function getOrderTrackingDetails(orderId: string) {
  try {
    const firestore = getAdminApp().firestore();
    const orderRef = firestore.collection("orders").doc(orderId);
    const orderDoc = await orderRef.get();

    if (!orderDoc.exists) return null;

    const orderData = orderDoc.data()!;

    const groupBuyRef = firestore
      .collection("groupBuys")
      .doc(orderData.groupBuyId);
    const groupBuyDoc = await groupBuyRef.get();

    if (!groupBuyDoc.exists) return { order: orderData };

    return { order: orderData, groupBuy: groupBuyDoc.data() };
  } catch (error) {
    console.error("Error fetching tracking details:", error);
    return null;
  }
}

export default async function TrackOrderPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  const details = await getOrderTrackingDetails(orderId);
  if (!details || !details.order) {
    notFound();
  }

  const { order, groupBuy } = details;

  const steps = [
    {
      icon: <Check size={16} />,
      title: "Order Confirmed",
      time: new Date(order.createdAt.seconds * 1000).toLocaleString(),
      status: "completed",
    },
    {
      icon: <Package size={16} />,
      title: "Processing Order",
      time: "Supplier is preparing the batch",
      status: ["processing", "at_hub", "delivered"].includes(order.status)
        ? "completed"
        : "pending",
    },
    {
      icon: <Truck size={16} />,
      title: "Ready for Pickup",
      time: `At ${groupBuy?.hubName || "the hub"}`,
      status: ["at_hub", "delivered"].includes(order.status)
        ? "current"
        : "pending",
    },
    {
      icon: <Check size={16} />,
      title: "Order Collected",
      time: "You have collected your order",
      status: order.status === "delivered" ? "completed" : "pending",
    },
  ];

  type OrderStatus = "confirmed" | "processing" | "at_hub" | "delivered";

  const getStepStatus = (stepIndex: number) => {
    const statusMap: Record<OrderStatus, number> = {
      confirmed: 0,
      processing: 1,
      at_hub: 2,
      delivered: 3,
    };
    const currentStepIndex = statusMap[order.status as OrderStatus] ?? 0;
    if (stepIndex < currentStepIndex) return "completed";
    if (stepIndex === currentStepIndex) return "current";
    return "pending";
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        title="Track Order"
        subtitle={`Order #${orderId.substring(0, 7)}`}
        backHref="/orders"
      />
      <main className="p-4 space-y-6 pb-24 container mx-auto">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">{order.productName}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {order.quantity}kg • ₹{order.total} total
                </p>
              </div>
              <StatusBadge status={order.status} />
            </div>
          </CardHeader>
        </Card>

        <div className="space-y-4">
          <h3 className="font-medium text-lg">Order Status</h3>
          <div className="pl-4">
            {steps.map((step, index) => {
              const status = getStepStatus(index);
              return (
                <div key={index} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border-2
                                        ${
                                          status === "completed"
                                            ? "bg-green-500 border-green-500 text-white"
                                            : status === "current"
                                            ? "bg-blue-500 border-blue-500 text-white animate-pulse"
                                            : "bg-muted border-border text-muted-foreground"
                                        }`}
                    >
                      {step.icon}
                    </div>
                    {index < steps.length - 1 && (
                      <div className="w-0.5 h-12 bg-border"></div>
                    )}
                  </div>
                  <div className="pt-1 pb-4">
                    <h4
                      className={`font-medium ${
                        status === "pending" ? "text-muted-foreground" : ""
                      }`}
                    >
                      {step.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">{step.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium text-lg">Pickup Location</h3>
          <Card className="overflow-hidden">
            <CardContent className="p-4 flex gap-4">
              <Image
                src="/store-front.jpg"
                alt="Store front"
                width={50}
                height={50}
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div>
                <h4 className="font-medium">
                  {groupBuy?.hubName || "Main Hub"}
                </h4>
                <p className="text-sm text-muted-foreground">
                  123 Market Road, Andheri East, Mumbai
                </p>
              </div>
            </CardContent>
            <Button className="w-full rounded-t-none" variant="secondary">
              <Navigation className="h-4 w-4 mr-2" />
              Get Directions
            </Button>
          </Card>
        </div>
      </main>
    </div>
  );
}
