import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { productName, pricePerKg } = body;

    if (!productName || !pricePerKg) {
      return NextResponse.json(
        { error: "Missing required deal data" },
        { status: 400 }
      );
    }

    const mockSummary = `This is a great deal for ${productName} at just ₹${pricePerKg} per kg! A fantastic opportunity to stock up.`;

    return NextResponse.json({ summary: mockSummary });
  } catch (error) {
    console.error("Error in summarize-deal API:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
