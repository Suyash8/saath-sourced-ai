"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AvatarStack } from "@/components/AvatarStack";
import { ProgressBar } from "@/components/ProgressBar";
import { Droplets, Eye } from "lucide-react";
import Image from "next/image";
import { joinGroupBuyAction } from "@/app/actions";

type Deal = {
  id: string;
  productName: string;
  pricePerKg: number;
  targetQuantity: number;
  currentQuantity: number;
  vendorCount?: number;
  imageUrl?: string;
  users: { id: string; name: string; avatar?: string }[];
};

export const DealDetailsClient = ({ deal }: { deal: Deal }) => {
  const [quantity, setQuantity] = useState(5);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleJoin = async () => {
    setLoading(true);
    setMessage("");
    const result = await joinGroupBuyAction(deal.id, quantity);
    setMessage(result.message);
    setLoading(false);
  };

  const progress = (deal.currentQuantity / deal.targetQuantity) * 100;
  const quantityNeeded = Math.max(
    0,
    deal.targetQuantity - deal.currentQuantity
  );

  return (
    <>
      <main className="p-4 space-y-6">
        <div className="relative">
          <Image
            src={deal.imageUrl || "/placeholder.jpg"}
            alt={deal.productName}
            width={500}
            height={200}
            className="w-full h-48 object-cover rounded-lg bg-muted"
          />
          <Badge className="absolute top-3 right-3 bg-red-500 text-white border-transparent">
            Save 20%
          </Badge>
        </div>
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold">{deal.productName}</h2>
            <p className="text-2xl font-bold text-primary mt-1">
              ₹{deal.pricePerKg}/kg
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-2">Group Buy Progress</h3>
            <ProgressBar value={progress} />
            <div className="flex items-center gap-2 mt-3">
              <AvatarStack users={deal.users} />
              <span className="text-sm text-muted-foreground">
                {deal.vendorCount || deal.users.length} vendors joined
              </span>
              <span className="text-sm font-medium ml-auto">
                {quantityNeeded}kg more needed
              </span>
            </div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4 space-y-4">
            <h3 className="font-medium">Saathi's Quality Check</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Droplets className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-muted-foreground flex-1">
                  Premium quality, sourced from trusted local farms.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Eye className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-muted-foreground flex-1">
                  Excellent color, firmness, and taste.
                </p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground italic text-right">
              Analyzed by Saathi AI
            </p>
          </div>
          <div className="space-y-3">
            <Label className="text-base font-medium">Quantity (kg)</Label>
            <Input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              min={5}
              className="h-12 text-center text-lg"
            />
            <p className="text-sm text-muted-foreground">Minimum order: 5kg</p>
          </div>
        </div>
      </main>
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 w-full">
        <div className="container mx-auto">
          <Button
            className="w-full"
            size="lg"
            onClick={handleJoin}
            disabled={loading}
          >
            {loading ? "Joining..." : "Join Group Buy"}
          </Button>
          {message && (
            <p className="text-xs text-center text-muted-foreground mt-2">
              {message}
            </p>
          )}
        </div>
      </div>
    </>
  );
};
