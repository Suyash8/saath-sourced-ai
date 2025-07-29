"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { GroupBuyCard } from "@/components/GroupBuyCard";
import { GenerateMockDataButton } from "@/components/GenerateMockDataButton";
import { BrainCircuit, Package, Sparkles } from "lucide-react";
import { SerializableGroupBuy } from "./page";

interface DashboardClientProps {
  initialDeals: SerializableGroupBuy[];
  userId: string | null;
}

interface ScoredDeal extends SerializableGroupBuy {
  aiScore?: number;
  aiReasoning?: string;
}

export function DashboardClient({
  initialDeals,
  userId,
}: DashboardClientProps) {
  const [deals, setDeals] = useState<ScoredDeal[]>(initialDeals);
  const [isScoring, setIsScoring] = useState(false);
  const [hasAIScores, setHasAIScores] = useState(
    initialDeals.some((deal) => deal.aiScore !== undefined)
  );

  const handleAIScore = async () => {
    if (!userId) return;

    setIsScoring(true);
    try {
      const response = await fetch("/api/ai/score-deals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deals: deals,
          userProfile: await getUserProfile(userId),
        }),
      });

      if (response.ok) {
        const { scoredDeals } = await response.json();
        setDeals(scoredDeals);
        setHasAIScores(true);

        // Store scores in database
        await storeAIScores(scoredDeals);
      }
    } catch (error) {
      console.error("Error scoring deals:", error);
    } finally {
      setIsScoring(false);
    }
  };

  const getUserProfile = async (userId: string) => {
    const response = await fetch(`/api/user/profile?userId=${userId}`);
    if (response.ok) {
      return await response.json();
    }
    return null;
  };

  const storeAIScores = async (scoredDeals: ScoredDeal[]) => {
    try {
      await fetch("/api/ai/store-scores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scoredDeals }),
      });
    } catch (error) {
      console.error("Error storing AI scores:", error);
    }
  };

  return (
    <div className="animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold animate-in fade-in-0 slide-in-from-left-4 duration-500 delay-200">
          Top Deals for You
        </h2>
        {userId && (
          <Button
            onClick={handleAIScore}
            disabled={isScoring}
            variant={hasAIScores ? "secondary" : "default"}
            size="sm"
            className="animate-in fade-in-0 slide-in-from-right-4 duration-500 delay-200"
          >
            {isScoring ? (
              <>
                <BrainCircuit className="h-4 w-4 mr-2 animate-spin" />
                AI Analyzing...
              </>
            ) : hasAIScores ? (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Re-score with AI
              </>
            ) : (
              <>
                <BrainCircuit className="h-4 w-4 mr-2" />
                Score with AI
              </>
            )}
          </Button>
        )}
      </div>

      {deals.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 grid-flow-row-dense">
          {deals.map((buy, index) => (
            <div
              key={buy.id}
              className="animate-in fade-in-0 slide-in-from-bottom-4 duration-500"
              style={{
                animationDelay: `${300 + index * 100}ms`,
                animationFillMode: "both",
              }}
            >
              <div className="transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
                <GroupBuyCard buy={buy} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-8 border-2 border-dashed rounded-lg animate-in fade-in-0 zoom-in-95 duration-500 delay-300 hover:border-primary/50 transition-colors">
          <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No deals available</h3>
          <p className="text-muted-foreground mb-6">
            Generate some sample deals to get started
          </p>
          <GenerateMockDataButton
            endpoint="/api/mock-data/deals"
            label="Generate Sample Deals"
          />
        </div>
      )}
    </div>
  );
}
