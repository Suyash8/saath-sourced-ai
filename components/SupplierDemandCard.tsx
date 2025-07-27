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
import {
  acceptGroupBuyAction,
  updateGroupBuyStatusAction,
} from "@/app/actions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";

export interface Demand {
  id: string;
  productName: string;
  currentQuantity: number;
  hubName: string;
  status: DemandStatus;
  vendorCount: number;
  deliveryDate: string;
}

export const SupplierDemandCard = ({ demand }: { demand: Demand }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleAccept = async () => {
    setLoading(true);
    const result = await acceptGroupBuyAction(demand.id);
    setMessage(result.message);
    setLoading(false);
  };

  const handleStatusUpdate = async (newStatus: string) => {
    setLoading(true);
    const result = await updateGroupBuyStatusAction(demand.id, newStatus);
    setMessage(result.message);
    setLoading(false);
  };

  const isAccepted = demand.status === "in-progress";

  return (
    <Card>
      <CardHeader>
        <Link href={`/supplier/demands/${demand.id}`}>
          <div className="flex items-center gap-2">
            <CardTitle className="text-base hover:underline">
              {demand.productName}
            </CardTitle>
            <StatusBadge status={demand.status} />
          </div>
        </Link>
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
                label: `${demand.vendorCount} Vendors`,
                value: demand.currentQuantity,
              },
            ]}
            height={40}
          />
        </div>
        <div className="flex justify-between items-center text-sm pt-2 border-t">
          <span className="text-muted-foreground">
            Delivery by: {demand.deliveryDate}
          </span>
          {isAccepted ? (
            <div className="flex gap-2 items-center">
              <Select onValueChange={handleStatusUpdate}>
                <SelectTrigger className="w-[180px] h-9">
                  <SelectValue placeholder="Update Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="at_hub">Delivered to Hub</SelectItem>
                  <SelectItem value="fulfilled">Fulfilled</SelectItem>
                  <SelectItem value="cancelled">Cancel Deal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          ) : (
            <Button size="sm" onClick={handleAccept} disabled={loading}>
              {loading ? "Accepting..." : "Accept Demand"}
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
