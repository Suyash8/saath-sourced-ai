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
import { Badge } from "@/components/ui/badge";
import { Clock, IndianRupee, MapPin, Minus, Plus, Sparkles } from "lucide-react";
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

  const progress = (buy.currentQuantity / buy.targetQuantity) * 100;
  const expiry = new Date(buy.expiryDate);
  const now = new Date();
  const hoursLeft = Math.max(
    0,
    Math.round((expiry.getTime() - now.getTime()) / (1000 * 60 * 60))
  );

  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-100 dark:bg-green-950/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800";
    if (score >= 60) return "bg-blue-100 dark:bg-blue-950/30 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800";
    if (score >= 40) return "bg-yellow-100 dark:bg-yellow-950/30 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800";
    return "bg-gray-100 dark:bg-gray-950/30 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-800";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Fair";
    return "Standard";
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
    <Card className="flex flex-col group hover:shadow-md transition-all duration-300 border-border hover:border-primary/20">
      <CardHeader className="transition-colors duration-200 group-hover:bg-muted/30">
        <div className="flex items-start justify-between">
          <Link href={`/deals/${buy.id}`} className="block flex-1">
            <CardTitle className="hover:underline transition-colors duration-200 group-hover:text-primary">
              {buy.productName}
            </CardTitle>
            <CardDescription className="transition-colors duration-200">
              High-quality produce, sourced directly.
            </CardDescription>
          </Link>
          {buy.aiScore !== undefined && (
            <div className="ml-2 flex flex-col items-end gap-1">
              <Badge
                variant="outline"
                className={`${getScoreColor(buy.aiScore)} text-xs`}
              >
                <Sparkles className="h-3 w-3 mr-1" />
                {buy.aiScore}/100
              </Badge>
              <span className="text-xs text-muted-foreground">
                {getScoreLabel(buy.aiScore)}
              </span>
            </div>
          )}
        </div>
        {buy.aiReasoning && (
          <div className="mt-2 text-xs text-muted-foreground italic border-l-2 border-primary/20 pl-2">
            AI: {buy.aiReasoning}
          </div>
        )}
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <div className="text-3xl font-bold flex items-center group-hover:text-primary transition-colors duration-300">
          <IndianRupee className="h-6 w-6 mr-1 transition-transform duration-200 group-hover:scale-110" />
          {buy.pricePerKg}
          <span className="text-lg font-normal text-muted-foreground ml-1 transition-colors duration-200">
            / kg
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center mb-1 text-sm">
            <span className="font-medium transition-colors duration-200 group-hover:text-foreground">
              {buy.currentQuantity}kg / {buy.targetQuantity}kg
            </span>
            <span className="text-primary font-semibold transition-all duration-300 group-hover:scale-105">
              {progress.toFixed(0)}%
            </span>
          </div>
          <div className="transition-transform duration-300 group-hover:scale-[1.01]">
            <Progress
              value={progress}
              className="transition-all duration-500"
            />
          </div>
        </div>

        <div className="text-sm text-muted-foreground space-y-2">
          <div className="flex items-center gap-2 transition-all duration-200 hover:text-foreground">
            <Clock className="h-4 w-4 transition-transform duration-200 hover:scale-110" />
            <span>Closes in ~{hoursLeft} hours</span>
          </div>
          <div className="flex items-center gap-2 transition-all duration-200 hover:text-foreground">
            <MapPin className="h-4 w-4 transition-transform duration-200 hover:scale-110" />
            <span>Pickup at {buy.hubName}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex-col items-stretch gap-2 transition-colors duration-200 group-hover:bg-muted/20">
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="transition-all duration-200 hover:scale-110 hover:bg-primary/10"
          >
            <Minus className="h-4 w-4" />
          </Button>
          <Input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-20 text-center transition-all duration-200 focus:scale-105 focus:shadow-sm"
          />
          <Button
            variant="outline"
            size="icon"
            onClick={() => setQuantity((q) => q + 1)}
            className="transition-all duration-200 hover:scale-110 hover:bg-primary/10"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <Button
          onClick={handleJoin}
          disabled={loading}
          className="w-full transition-all duration-300 hover:scale-[1.02] hover:shadow-md active:scale-[0.98]"
        >
          {loading ? (
            <span className="animate-pulse">Joining...</span>
          ) : (
            `Join Deal (${quantity}kg)`
          )}
        </Button>
        {message && (
          <p className="text-xs text-center text-muted-foreground mt-2 animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
            {message}
          </p>
        )}
      </CardFooter>
    </Card>
  );
};
