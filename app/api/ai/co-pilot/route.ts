import { getUserIdFromSession } from "@/app/actions";
import { getAdminApp } from "@/firebase/adminConfig";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

getAdminApp();
const firestore = getAdminApp().firestore();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

interface AnalysisResponse {
  dealRating: "Excellent" | "Good" | "Standard";
  profitabilityAnalysis: string;
  restockingAdvice: string;
  marketTrend: string;
}

export async function POST(request: NextRequest) {
  const userId = await getUserIdFromSession();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { deal } = await request.json();
  if (!deal) {
    return NextResponse.json({ error: "Deal data missing" }, { status: 400 });
  }

  try {
    // 1. Fetch User's Purchase History (last 5 orders for context)
    const ordersSnapshot = await firestore
      .collection("orders")
      .where("userId", "==", userId)
      .orderBy("createdAt", "desc")
      .limit(5)
      .get();
    const purchaseHistory = ordersSnapshot.docs.map((doc) => doc.data());

    // 2. Fetch Market Average for the product
    const productAverageDoc = await firestore
      .collection("productAverages")
      .doc(deal.productName.toLowerCase())
      .get();
    const marketAverage =
      productAverageDoc.exists && productAverageDoc.data()
        ? productAverageDoc.data()!
        : { averagePrice: deal.pricePerKg }; // Default to current price if no history

    // 3. Construct a powerful prompt for Gemini
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
      },
      systemInstruction: `You are "Saathi AI", a B2B agricultural supply chain analyst for Indian street food vendors. Your tone is practical, data-driven, and encouraging. Analyze the provided deal from the user's perspective. Your entire response must be a single, valid JSON object that matches this structure: {"dealRating": "Excellent" | "Good" | "Standard", "profitabilityAnalysis": "string", "restockingAdvice": "string", "marketTrend": "string"}`,
    });

    const prompt = `
      Analyze this deal for a street food vendor. Be concise and actionable.

      **Vendor Context:**
      - Recent Purchase History: ${JSON.stringify(
        purchaseHistory
          .map((p) => `${p.productName}: ${p.quantity}kg`)
          .join(", ")
      )}

      **Current Deal Details:**
      - Product: ${deal.productName}
      - Price: ₹${deal.pricePerKg}/kg
      - Target Quantity: ${deal.targetQuantity}kg

      **Market Context:**
      - Historical Average Price for ${deal.productName}: ₹${
      marketAverage.averagePrice
    }/kg

      Generate the JSON analysis now.
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const analysis: AnalysisResponse = JSON.parse(text);

    return NextResponse.json(analysis);
  } catch (error) {
    console.error("Error in AI Co-pilot API:", error);
    return NextResponse.json(
      { error: "Failed to generate AI analysis." },
      { status: 500 }
    );
  }
}
