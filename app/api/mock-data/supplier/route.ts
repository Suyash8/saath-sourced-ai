import { NextRequest, NextResponse } from "next/server";
import { getAdminApp } from "@/firebase/adminConfig";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getUserIdFromSession } from "@/app/actions";
import { Timestamp } from "firebase-admin/firestore";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: NextRequest) {
  const userId = await getUserIdFromSession();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
      },
      systemInstruction: `Generate realistic mock supplier demand data for Indian street food vendors. Return a JSON array of 6-10 supplier demands with the following structure:
      {
        "demands": [
          {
            "productName": "string (Indian ingredients like onions, tomatoes, potatoes, spices, etc.)",
            "quantity": "number (100-1000 kg)",
            "pricePerKg": "number (realistic wholesale prices in INR)",
            "location": "string (Indian city/area names)",
            "supplierName": "string (realistic Indian supplier names)",
            "description": "string (quality details, origin, etc.)",
            "urgency": "string (high, medium, low)",
            "status": "string (open, in_progress, fulfilled)",
            "contactInfo": "string (phone number format +91-XXXXXXXXXX)",
            "deliveryDate": "string (future dates within 14 days)",
            "minimumOrder": "number (10-100 kg)"
          }
        ]
      }
      Make the data realistic for Indian agricultural suppliers and street food vendors.`,
    });

    const result = await model.generateContent(
      "Generate mock supplier demands for Indian street food vendors"
    );
    const mockData = JSON.parse(result.response.text());

    const firestore = getAdminApp().firestore();
    const batch = firestore.batch();

    // Add supplier demands to Firestore
    for (const demand of mockData.demands) {
      const demandRef = firestore.collection("supplierDemands").doc();
      const deliveryDate = new Date(demand.deliveryDate);

      batch.set(demandRef, {
        productName: demand.productName,
        quantity: demand.quantity,
        pricePerKg: demand.pricePerKg,
        location: demand.location,
        supplierName: demand.supplierName,
        description: demand.description,
        urgency: demand.urgency,
        status: demand.status,
        contactInfo: demand.contactInfo,
        minimumOrder: demand.minimumOrder,
        deliveryDate: Timestamp.fromDate(deliveryDate),
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        userId: userId,
      });
    }

    await batch.commit();

    return NextResponse.json({
      message: `Successfully generated ${mockData.demands.length} mock supplier demands`,
      count: mockData.demands.length,
    });
  } catch (error) {
    console.error("Error generating mock supplier demands:", error);
    return NextResponse.json(
      { error: "Failed to generate mock data" },
      { status: 500 }
    );
  }
}
