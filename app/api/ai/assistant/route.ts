import { getUserIdFromSession } from "@/app/actions";
import { getAdminApp } from "@/firebase/adminConfig";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const firestore = getAdminApp().firestore();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
  systemInstruction: `You are "Saathi AI", a helpful and friendly assistant for Indian street food vendors. You have access to real-time data about group buy deals and the user's order history. Your answers should be concise, helpful, and directly answer the user's question based on the provided data. If you don't have the information, say so. Do not invent details. Current date is ${new Date().toLocaleDateString(
    "en-IN"
  )}.`,
});

async function getContextData(userId: string) {
  // Fetch open group buys
  const groupBuysSnapshot = await firestore
    .collection("groupBuys")
    .where("status", "==", "open")
    .get();
  const openDeals = groupBuysSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  // Fetch user's recent orders
  const ordersSnapshot = await firestore
    .collection("orders")
    .where("userId", "==", userId)
    .orderBy("createdAt", "desc")
    .limit(3)
    .get();
  const recentOrders = ordersSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return { openDeals, recentOrders };
}

export async function POST(request: NextRequest) {
  const userId = await getUserIdFromSession();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { prompt } = await request.json();
  if (!prompt) {
    return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
  }

  try {
    const contextData = await getContextData(userId);

    const fullPrompt = `
      **CONTEXTUAL DATA (DO NOT mention this data directly, use it to answer the user's question):**
      - Open Group Buy Deals: ${JSON.stringify(contextData.openDeals)}
      - User's Recent Orders: ${JSON.stringify(contextData.recentOrders)}

      **USER'S QUESTION:**
      ${prompt}
    `;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ reply: text });
  } catch (error) {
    console.error("Error in AI Assistant API:", error);
    return NextResponse.json(
      { error: "Sorry, I encountered an error. Please try again." },
      { status: 500 }
    );
  }
}
