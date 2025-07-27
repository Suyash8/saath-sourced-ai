"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { acceptGroupBuyAction } from "@/app/actions";
import { StatusBadge } from "./StatusBadge";

export interface Demand {
  id: string;
  productName: string;
  currentQuantity: number;
  hubName: string;
  status: "new" | "in-progress";
  vendorCount: number;
  deliveryDate: string;
}

interface SupplierDemandCardProps {
  demand: Demand;
}

export function SupplierDemandCard({ demand }: SupplierDemandCardProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isAccepted, setIsAccepted] = useState(demand.status === "in-progress");

  const handleAccept = async () => {
    setLoading(true);
    setMessage("");
    const result = await acceptGroupBuyAction(demand.id);
    if (result.success) {
      setIsAccepted(true);
    }
    setMessage(result.message);
    setLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{demand.productName}</CardTitle>
          <StatusBadge status={isAccepted ? "in-progress" : demand.status} />
        </div>
        <CardDescription>Deliver To: {demand.hubName}</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-muted-foreground">Total Demand</p>
          <p className="font-semibold">{demand.currentQuantity} kg</p>
        </div>
        <div>
          <p className="text-muted-foreground">Vendors</p>
          <p className="font-semibold">{demand.vendorCount}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Deliver By</p>
          <p className="font-semibold">{demand.deliveryDate}</p>
        </div>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2">
        {!isAccepted && (
          <Button
            className="w-full"
            onClick={handleAccept}
            disabled={loading || isAccepted}
          >
            {loading ? "Accepting..." : "Accept Demand"}
          </Button>
        )}
        {message && (
          <p
            className={`text-xs w-full text-center ${
              isAccepted ? "text-green-600" : "text-destructive"
            }`}
          >
            {message}
          </p>
        )}
      </CardFooter>
    </Card>
  );
}
