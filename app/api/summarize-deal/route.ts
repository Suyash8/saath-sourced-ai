import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { productName, pricePerKg, hubName } = body;

    if (!productName || !pricePerKg) {
      return NextResponse.json(
        { error: "Missing required deal data" },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      You are "Saathi AI", a helpful and friendly assistant for Indian street food vendors.
      Your tone is simple, encouraging, and clear. You always write in 2 short, easy-to-read bullet points.
      Summarize the following deal for a street vendor.

      Deal Details:
      - Product: ${productName}
      - Price: ₹${pricePerKg} per kg
      - Pickup Location: ${hubName}

      Generate the summary now.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ summary: text });
  } catch (error) {
    console.error("Error in Gemini API call:", error);
    return NextResponse.json(
      { error: "Failed to generate AI summary" },
      { status: 500 }
    );
  }
}
