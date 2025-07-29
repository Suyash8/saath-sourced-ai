import { NextRequest, NextResponse } from "next/server";
import { getAdminApp } from "@/firebase/adminConfig";
import { getUserIdFromSession } from "@/app/actions";

export async function POST(req: NextRequest) {
  const userId = await getUserIdFromSession();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { scoredDeals } = await req.json();

    if (!scoredDeals || !Array.isArray(scoredDeals)) {
      return NextResponse.json(
        { error: "Invalid scored deals data" },
        { status: 400 }
      );
    }

    const firestore = getAdminApp().firestore();
    const batch = firestore.batch();

    // Update each deal with AI score and reasoning
    for (const deal of scoredDeals) {
      if (deal.id && deal.aiScore !== undefined) {
        const dealRef = firestore.collection("groupBuys").doc(deal.id);
        batch.update(dealRef, {
          aiScore: deal.aiScore,
          aiReasoning: deal.aiReasoning || "",
          lastAIScoredAt: new Date(),
          lastAIScoredBy: userId,
        });
      }
    }

    await batch.commit();

    return NextResponse.json({
      message: "AI scores stored successfully",
      count: scoredDeals.length,
    });
  } catch (error) {
    console.error("Error storing AI scores:", error);
    return NextResponse.json(
      { error: "Failed to store AI scores" },
      { status: 500 }
    );
  }
}
