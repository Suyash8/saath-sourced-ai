"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AvatarStack } from "@/components/AvatarStack";
import { ProgressBar } from "@/components/ProgressBar";
import {
  BarChart,
  BrainCircuit,
  LineChart,
  ShoppingBasket,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import { joinGroupBuyAction } from "@/app/actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDefaultSupplyImage } from "@/lib/supply-images";

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

interface Analysis {
  dealRating: "Excellent" | "Good" | "Standard";
  profitabilityAnalysis: string;
  restockingAdvice: string;
  marketTrend: string;
}

const AILoadingState = () => (
  <Card className="bg-muted/30 dark:bg-muted/20 animate-pulse">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <BrainCircuit className="h-5 w-5 text-primary" />
        Saathi Co-pilot Analysis
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-3">
      <div className="h-4 bg-muted dark:bg-muted/50 rounded w-3/4"></div>
      <div className="h-4 bg-muted dark:bg-muted/50 rounded w-full"></div>
      <div className="h-4 bg-muted dark:bg-muted/50 rounded w-1/2"></div>
    </CardContent>
  </Card>
);

const AIAnalysisCard = ({ analysis }: { analysis: Analysis }) => {
  const ratingColors = {
    Excellent:
      "bg-green-50 dark:bg-green-950/20 text-green-800 dark:text-green-200 border-green-200 dark:border-green-800",
    Good: "bg-blue-50 dark:bg-blue-950/20 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-800",
    Standard:
      "bg-slate-50 dark:bg-slate-950/20 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-800",
  };

  return (
    <Card className={ratingColors[analysis.dealRating]}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BrainCircuit className="h-5 w-5" />
            Saathi Co-pilot Analysis
          </div>
          <Badge className="border-none bg-inherit">
            {analysis.dealRating} Deal
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-3">
          <BarChart className="h-4 w-4 mt-1 flex-shrink-0" />
          <p className="text-sm">
            <strong>Profitability:</strong> {analysis.profitabilityAnalysis}
          </p>
        </div>
        <div className="flex items-start gap-3">
          <ShoppingBasket className="h-4 w-4 mt-1 flex-shrink-0" />
          <p className="text-sm">
            <strong>Restocking Tip:</strong> {analysis.restockingAdvice}
          </p>
        </div>
        <div className="flex items-start gap-3">
          <LineChart className="h-4 w-4 mt-1 flex-shrink-0" />
          <p className="text-sm">
            <strong>Market Pulse:</strong> {analysis.marketTrend}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export const DealDetailsClient = ({ deal }: { deal: Deal }) => {
  const [quantity, setQuantity] = useState(5);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);

  const fetchAnalysis = async () => {
    setAnalysisLoading(true);
    try {
      const response = await fetch("/api/ai/co-pilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deal }),
      });
      if (response.ok) {
        const data = await response.json();
        setAnalysis(data);
      }
    } catch (error) {
      console.error("Failed to fetch AI analysis", error);
    } finally {
      setAnalysisLoading(false);
    }
  };

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
            src={deal.imageUrl || getDefaultSupplyImage(deal.productName)}
            alt={deal.productName}
            width={500}
            height={200}
            className="w-full h-48 object-cover rounded-lg bg-muted"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = getDefaultSupplyImage(deal.productName);
            }}
          />
        </div>

        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold">{deal.productName}</h2>
            <p className="text-2xl font-bold text-primary mt-1">
              ₹{deal.pricePerKg}/kg
            </p>
          </div>

          {/* AI Analysis Section */}
          {!analysis && !analysisLoading && (
            <Card className="border-dashed">
              <CardContent className="text-center py-6">
                <BrainCircuit className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-medium mb-2">Get AI Analysis</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Let Saathi analyze this deal for profitability and market insights
                </p>
                <Button onClick={fetchAnalysis} disabled={analysisLoading}>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Analyze with AI
                </Button>
              </CardContent>
            </Card>
          )}
          {analysisLoading && <AILoadingState />}
          {analysis && <AIAnalysisCard analysis={analysis} />}

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

          <div className="space-y-3 pt-4">
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
