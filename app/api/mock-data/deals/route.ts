import { NextRequest, NextResponse } from "next/server";
import { getAdminApp } from "@/firebase/adminConfig";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getUserIdFromSession } from "@/app/actions";
import { Timestamp } from "firebase-admin/firestore";
import { supplyTypes } from "@/data/supplyTypes";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: NextRequest) {
  const userId = await getUserIdFromSession();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
      },
      systemInstruction: `Generate realistic mock data for Indian street food vendor group buying deals. You MUST only use products from this predefined list: ${supplyTypes
        .map((s) => `${s.name} (${s.unit})`)
        .join(
          ", "
        )}. Return a JSON array of 8-12 deals with the following structure:
      {
        "deals": [
          {
            "productName": "string (MUST be exactly one of: ${supplyTypes
              .map((s) => s.name)
              .join(", ")})",
            "pricePerKg": "number (realistic wholesale prices in INR)",
            "targetQuantity": "number (50-500 kg or appropriate unit)",
            "currentQuantity": "number (10-80% of target)",
            "status": "open",
            "hubName": "string (Indian city/area names like Andheri Hub, CP Market, etc.)",
            "hubId": "string (random ID)",
            "supplierId": "string (random ID)",
            "supplierName": "string (realistic Indian supplier names)",
            "description": "string (brief description of quality/origin)",
            "expiryHours": "number (12-72 hours from now)",
            "imageUrl": "string (placeholder image URL like https://images.unsplash.com/photo-1234567890/400x300?q=80)"
          }
        ]
      }
      Make prices realistic for wholesale in India. Ensure all productName values match exactly from the predefined supply types list.`,
    });

    const result = await model.generateContent(
      "Generate mock group buying deals for Indian street food vendors"
    );
    const mockData = JSON.parse(result.response.text());

    const firestore = getAdminApp().firestore();
    const batch = firestore.batch();

    // Add deals to Firestore
    for (const deal of mockData.deals) {
      const dealRef = firestore.collection("groupBuys").doc();
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + deal.expiryHours);

      batch.set(dealRef, {
        productName: deal.productName,
        pricePerKg: deal.pricePerKg,
        targetQuantity: deal.targetQuantity,
        currentQuantity: deal.currentQuantity,
        status: deal.status,
        hubName: deal.hubName,
        hubId: deal.hubId,
        supplierId: deal.supplierId,
        supplierName: deal.supplierName,
        description: deal.description,
        imageUrl:
          deal.imageUrl ||
          `https://images.unsplash.com/photo-${Math.random()
            .toString()
            .slice(2, 15)}/400x300?q=80`,
        expiryDate: Timestamp.fromDate(expiryDate),
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
    }

    await batch.commit();

    return NextResponse.json({
      message: `Successfully generated ${mockData.deals.length} mock deals`,
      count: mockData.deals.length,
    });
  } catch (error) {
    console.error("Error generating mock deals:", error);
    return NextResponse.json(
      { error: "Failed to generate mock data" },
      { status: 500 }
    );
  }
}
