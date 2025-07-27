import { getAdminApp } from "@/firebase/adminConfig";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Badge } from "@/components/ui/badge";
import { AvatarStack } from "@/components/AvatarStack";
import { ProgressBar } from "@/components/ProgressBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, Droplets, Eye } from "lucide-react";
import Image from "next/image";
import { joinGroupBuyAction } from "@/app/actions";

async function getDealDetails(dealId: string) {
  try {
    const firestore = getAdminApp().firestore();
    const dealDoc = await firestore.collection("groupBuys").doc(dealId).get();
    if (!dealDoc.exists) return null;

    const mockUsers = [
      { id: "1", name: "Raju", avatar: "" },
      { id: "2", name: "Priya", avatar: "" },
    ];

    return {
      id: dealDoc.id,
      ...dealDoc.data(),
      users: mockUsers,
    };
  } catch (error) {
    console.error("Error fetching deal details:", error);
    return null;
  }
}

("use client");
import { useState } from "react";

const DealDetailsClient = ({ deal }: { deal: any }) => {
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
  const quantityNeeded = deal.targetQuantity - deal.currentQuantity;

  return (
    <>
      <div className="p-4 space-y-6">
        <div className="relative">
          <Image
            src={deal.imageUrl || "/placeholder.jpg"}
            alt={deal.productName}
            width={500}
            height={200}
            className="w-full h-48 object-cover rounded-lg"
          />
          <Badge className="absolute top-3 right-3 bg-red-500 text-white">
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
                {deal.vendorCount || 0} vendors joined
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
                <Droplets className="h-4 w-4 text-green-500" />
                <p className="text-sm text-muted-foreground flex-1">
                  Premium quality, sourced from trusted local farms.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Eye className="h-4 w-4 text-green-500" />
                <p className="text-sm text-muted-foreground flex-1">
                  Excellent color, firmness, and taste.
                </p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground italic">
              Analyzed by your sourcing companion, Saathi AI.
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
      </div>
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4">
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
    </>
  );
};

export default async function DealDetailsPage({
  params,
}: {
  params: { dealId: string };
}) {
  const deal = await getDealDetails(params.dealId);
  if (!deal) {
    notFound();
  }
  return (
    <div className="min-h-screen bg-background pb-24">
      <Header title="Deal Details" backHref="/dashboard" />
      <DealDetailsClient deal={deal} />
    </div>
  );
}
