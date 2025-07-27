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
import { SerializableGroupBuy } from "@/app/(app)/(main)/dashboard/page";
import { joinGroupBuyAction } from "@/app/actions";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import Link from "next/link";

type GroupBuyCardProps = {
  buy: SerializableGroupBuy;
};

export const GroupBuyCard = ({ buy }: GroupBuyCardProps) => {
  const [quantity, setQuantity] = useState(10);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);

  const progress = (buy.currentQuantity / buy.targetQuantity) * 100;
  const expiry = new Date(buy.expiryDate);
  const now = new Date();
  const hoursLeft = Math.max(
    0,
    Math.round((expiry.getTime() - now.getTime()) / (1000 * 60 * 60))
  );

  const fetchAiSummary = async () => {
    if (aiSummary) return;
    setIsSummaryLoading(true);
    try {
      const response = await fetch("/api/summarize-deal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName: buy.productName,
          pricePerKg: buy.pricePerKg,
          hubName: buy.hubName,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to fetch summary");
      }
      const data = await response.json();
      setAiSummary(data.summary);
    } catch (error) {
      console.error(error);
      setAiSummary("Could not load AI summary."); // Provide fallback message
    } finally {
      setIsSummaryLoading(false);
    }
  };

  const handleJoin = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();

    setLoading(true);
    setMessage("");
    const result = await joinGroupBuyAction(buy.id, quantity);
    setMessage(result.message);
    setLoading(false);
  };

  return (
    <Card className="flex flex-col">
      <CardHeader>
        {" "}
        <Link href={`/deals/${buy.id}`} className="block h-full">
          <CardTitle className="hover:underline">{buy.productName}</CardTitle>
          <CardDescription>
            High-quality produce, sourced directly.
          </CardDescription>
        </Link>
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

        <div className="pt-4 border-t">
          {aiSummary ? (
            <div className="text-sm text-muted-foreground space-y-1">
              {aiSummary.split("\n").map((line, index) => (
                <p key={index}>{line}</p>
              ))}
              <p className="text-xs text-right text-purple-600 italic mt-2">
                Summarized by Saathi AI ✨
              </p>
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={fetchAiSummary}
              disabled={isSummaryLoading}
            >
              {isSummaryLoading ? "Saathi is thinking..." : "Get AI Summary"}
            </Button>
          )}
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
