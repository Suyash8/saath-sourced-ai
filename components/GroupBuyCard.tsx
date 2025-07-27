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
import { Clock, IndianRupee, MapPin } from "lucide-react";
import { SerializableGroupBuy } from "@/app/(app)/dashboard/page";

type GroupBuyCardProps = {
  buy: SerializableGroupBuy;
};

export const GroupBuyCard = ({ buy }: GroupBuyCardProps) => {
  const progress = (buy.currentQuantity / buy.targetQuantity) * 100;
  const expiry = new Date(buy.expiryDate);
  const now = new Date();
  const hoursLeft = Math.max(
    0,
    Math.round((expiry.getTime() - now.getTime()) / (1000 * 60 * 60))
  );

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
      <CardFooter>
        <Button className="w-full">Join Deal</Button>
      </CardFooter>
    </Card>
  );
};
