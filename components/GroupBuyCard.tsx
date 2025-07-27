"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Clock, IndianRupee, MapPin, Minus, Plus } from "lucide-react";
import { SerializableGroupBuy } from "@/app/(app)/dashboard/page";
import { joinGroupBuyAction } from "@/app/actions";
import { useState } from "react";
import { Input } from "@/components/ui/input";

type GroupBuyCardProps = {
  buy: SerializableGroupBuy;
};

export const GroupBuyCard = ({ buy }: GroupBuyCardProps) => {
  const [quantity, setQuantity] = useState(10);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const progress = (buy.currentQuantity / buy.targetQuantity) * 100;
  const expiry = new Date(buy.expiryDate);
  const now = new Date();
  const hoursLeft = Math.max(
    0,
    Math.round((expiry.getTime() - now.getTime()) / (1000 * 60 * 60))
  );

  const handleJoin = async () => {
    setLoading(true);
    setMessage("");
    const result = await joinGroupBuyAction(buy.id, quantity);
    setMessage(result.message);
    setLoading(false);
  };

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>{buy.productName}</CardTitle>
        <CardDescription>
          High-quality produce, sourced directly.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <div className="text-3xl font-bold flex items-center">
          <IndianRupee className="h-6 w-6 mr-1" />
          {buy.pricePerKg}
          <span className="text-lg font-normal text-muted-foreground ml-1">
            / kg
          </span>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1 text-sm">
            <span className="font-medium">
              {buy.currentQuantity}kg / {buy.targetQuantity}kg
            </span>
            <span className="text-primary font-semibold">
              {progress.toFixed(0)}%
            </span>
          </div>
          <Progress value={progress} />
        </div>

        <div className="text-sm text-muted-foreground space-y-2">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>Closes in ~{hoursLeft} hours</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>Pickup at {buy.hubName}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex-col items-stretch gap-2">
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <Input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-20 text-center"
          />
          <Button
            variant="outline"
            size="icon"
            onClick={() => setQuantity((q) => q + 1)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <Button onClick={handleJoin} disabled={loading} className="w-full">
          {loading ? "Joining..." : `Join Deal (${quantity}kg)`}
        </Button>
        {message && (
          <p className="text-xs text-center text-muted-foreground mt-2">
            {message}
          </p>
        )}
      </CardFooter>
    </Card>
  );
};
