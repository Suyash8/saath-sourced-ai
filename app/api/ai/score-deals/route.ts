import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getAdminApp } from "@/firebase/adminConfig";

interface SerializableGroupBuy {
  id: string;
  productName: string;
  pricePerKg: number;
  targetQuantity: number;
  currentQuantity: number;
  status: "open" | "closed" | "fulfilled";
  expiryDate: string;
  hubName: string;
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { deals, userProfile, userId } = await req.json();

    if (!deals || !Array.isArray(deals) || !userProfile || !userId) {
      return NextResponse.json(
        { error: "Missing deals array, user profile, or userId" },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Prepare user context
    const userContext = `
User Profile:
- Business Type: ${userProfile.vendorProfile?.businessType || "Unknown"}
- Location: ${userProfile.vendorProfile?.location || "Unknown"}
- Daily Customers: ${userProfile.vendorProfile?.dailyCustomers || "Unknown"}
- Supplies Needed: ${
      userProfile.vendorProfile?.suppliesNeeded?.join(", ") || "None specified"
    }
- Business Description: ${
      userProfile.vendorProfile?.businessDescription || "None"
    }
    `;

    // Create a single batch prompt for all deals
    const dealsList = deals
      .map(
        (deal: SerializableGroupBuy, index: number) => `
Deal ${index + 1} (ID: ${deal.id}):
- Product: ${deal.productName}
- Price per kg: ₹${deal.pricePerKg}
- Target Quantity: ${deal.targetQuantity}kg
- Current Quantity: ${deal.currentQuantity}kg
- Hub: ${deal.hubName}
- Progress: ${Math.round((deal.currentQuantity / deal.targetQuantity) * 100)}%
    `
      )
      .join("\n");

    const batchPrompt = `
You are an AI business advisor for street food vendors. Score ALL of these deals from 0-100 based on how well they match the user's business needs and potential profitability.

${userContext}

Deals to Score:
${dealsList}

Consider these factors for each deal:
1. Relevance to user's business type and supplies needed (40%)
2. Price competitiveness and potential savings (25%)
3. Quantity suitability for their business size (20%)
4. Deal completion likelihood (15%)

Return ONLY a JSON array with this exact format:
[
  {
    "id": "deal_id_1",
    "score": 85,
    "reasoning": "High relevance to business, competitive price, suitable quantity"
  },
  {
    "id": "deal_id_2", 
    "score": 72,
    "reasoning": "Good price but moderate relevance to business needs"
  }
]

Keep reasoning to 15-20 words maximum. Include all ${deals.length} deals in your response.
    `;

    try {
      const result = await model.generateContent(batchPrompt);
      const response = await result.response;
      const text = response.text();

      // Try to extract JSON array from the response
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      let aiScores: Array<{ id: string; score: number; reasoning: string }> =
        [];

      if (jsonMatch) {
        aiScores = JSON.parse(jsonMatch[0]);
      }

      // Create scores map for quick lookup
      const scoresMap = new Map();
      aiScores.forEach((item) => {
        if (item.id && typeof item.score === "number") {
          scoresMap.set(item.id, {
            score: Math.max(0, Math.min(100, item.score)),
            reasoning:
              item.reasoning || "AI scored based on business relevance",
          });
        }
      });

      // Apply scores to deals with fallback scoring
      const scoredDeals = deals.map((deal: SerializableGroupBuy) => {
        const aiResult = scoresMap.get(deal.id);

        if (aiResult) {
          return {
            ...deal,
            aiScore: aiResult.score,
            aiReasoning: aiResult.reasoning,
          };
        }

        // Fallback scoring if AI didn't score this deal
        let score = 50;

        if (
          userProfile.vendorProfile?.suppliesNeeded?.some(
            (supply: string) =>
              deal.productName.toLowerCase().includes(supply.toLowerCase()) ||
              supply.toLowerCase().includes(deal.productName.toLowerCase())
          )
        ) {
          score += 30;
        }

        const progress = (deal.currentQuantity / deal.targetQuantity) * 100;
        if (progress > 70) score += 10;
        else if (progress > 40) score += 5;

        if (deal.pricePerKg < 50) score += 10;
        else if (deal.pricePerKg < 100) score += 5;

        return {
          ...deal,
          aiScore: Math.max(0, Math.min(100, score)),
          aiReasoning:
            "Scored based on business relevance and deal characteristics",
        };
      });

      // Store scores in user profile in Firestore
      const admin = getAdminApp();
      const db = admin.firestore();

      const userScores = scoredDeals.reduce(
        (
          acc: Record<
            string,
            { score: number; reasoning: string; scoredAt: string }
          >,
          deal: SerializableGroupBuy & {
            aiScore?: number;
            aiReasoning?: string;
          }
        ) => {
          acc[deal.id] = {
            score: deal.aiScore || 0,
            reasoning: deal.aiReasoning || "No reasoning provided",
            scoredAt: new Date().toISOString(),
          };
          return acc;
        },
        {}
      );

      await db.collection("users").doc(userId).update({
        "aiScores.deals": userScores,
      });

      // Sort by AI score (highest first)
      scoredDeals.sort((a, b) => (b.aiScore || 0) - (a.aiScore || 0));

      return NextResponse.json({ scoredDeals });
    } catch (aiError) {
      console.error("AI scoring failed, using fallback:", aiError);

      // Fallback to heuristic scoring for all deals
      const scoredDeals = deals.map((deal: SerializableGroupBuy) => {
        let score = 50;

        if (
          userProfile.vendorProfile?.suppliesNeeded?.some(
            (supply: string) =>
              deal.productName.toLowerCase().includes(supply.toLowerCase()) ||
              supply.toLowerCase().includes(deal.productName.toLowerCase())
          )
        ) {
          score += 30;
        }

        const progress = (deal.currentQuantity / deal.targetQuantity) * 100;
        if (progress > 70) score += 10;
        else if (progress > 40) score += 5;

        if (deal.pricePerKg < 50) score += 10;
        else if (deal.pricePerKg < 100) score += 5;

        return {
          ...deal,
          aiScore: Math.max(0, Math.min(100, score)),
          aiReasoning: "Scored using business relevance heuristics",
        };
      });

      return NextResponse.json({ scoredDeals });
    }
  } catch (error) {
    console.error("Error scoring deals:", error);
    return NextResponse.json(
      { error: "Failed to score deals" },
      { status: 500 }
    );
  }
}
