"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { StatusBadge, DemandStatus } from "./StatusBadge";
import { BarChart } from "./BarChart";
import { Button } from "./ui/button";
import { acceptGroupBuyAction } from "@/app/actions";

export interface Demand {
  id: string;
  productName: string;
  currentQuantity: number;
  hubName: string;
  status: DemandStatus;
  vendorCount: number;
  deliveryDate: string;
}

export const SupplierDemandCard = ({
  demand,
  isAccepted = false,
}: {
  demand: Demand;
  isAccepted?: boolean;
}) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleAccept = async () => {
    setLoading(true);
    const result = await acceptGroupBuyAction(demand.id);
    setMessage(result.message);
    setLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle className="text-base">{demand.productName}</CardTitle>
          <StatusBadge status={demand.status} />
        </div>
        <CardDescription>
          Total Quantity: {demand.currentQuantity}kg • Target Hub:{" "}
          {demand.hubName}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-2">
            Order Breakdown (Example):
          </p>
          <BarChart
            data={[
              {
                label: "Vendors",
                value: demand.vendorCount,
                color: "hsl(var(--primary))",
              },
            ]}
            height={40}
          />
        </div>
        <div className="flex justify-between items-center text-sm pt-2 border-t">
          <span className="text-muted-foreground">
            {demand.vendorCount} vendors • Delivery by: {demand.deliveryDate}
          </span>
          {isAccepted ? (
            <Button size="sm" variant="outline">
              Update Status
            </Button>
          ) : (
            <Button size="sm" onClick={handleAccept} disabled={loading}>
              {loading ? "Accepting..." : "View & Accept"}
            </Button>
          )}
        </div>
        {message && (
          <p className="text-xs text-center text-muted-foreground mt-2">
            {message}
          </p>
        )}
      </CardContent>
    </Card>
  );
};
