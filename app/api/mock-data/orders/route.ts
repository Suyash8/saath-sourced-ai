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
    const firestore = getAdminApp().firestore();

    // First check if there are any deals/group buys
    const dealsSnapshot = await firestore
      .collection("groupBuys")
      .limit(1)
      .get();

    let dealsData: {
      deals: Array<{ id?: string; [key: string]: unknown }>;
    } | null = null;

    // If no deals exist, generate deals first
    if (dealsSnapshot.empty) {
      const dealsModel = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        generationConfig: {
          responseMimeType: "application/json",
        },
        systemInstruction: `Generate realistic mock data for Indian street food vendor group buying deals. Return a JSON array of 8-12 deals with the following structure:
        {
          "deals": [
            {
              "productName": "string (Indian ingredients like onions, tomatoes, potatoes, spices, etc.)",
              "pricePerKg": "number (realistic wholesale prices in INR)",
              "targetQuantity": "number (50-500 kg)",
              "currentQuantity": "number (10-80% of target)",
              "status": "open",
              "hubName": "string (Indian city/area names like Andheri Hub, CP Market, etc.)",
              "hubId": "string (random ID)",
              "supplierId": "string (random ID)",
              "supplierName": "string (realistic Indian supplier names)",
              "description": "string (brief description of quality/origin)",
              "expiryHours": "number (12-72 hours from now)"
            }
          ]
        }
        Make prices realistic for wholesale in India. Use common street food ingredients.`,
      });

      const dealsResult = await dealsModel.generateContent(
        "Generate mock group buying deals for Indian street food vendors"
      );
      dealsData = JSON.parse(dealsResult.response.text());

      const dealsBatch = firestore.batch();

      // Add deals to Firestore
      if (dealsData && Array.isArray(dealsData.deals)) {
        for (const deal of dealsData.deals) {
          const dealRef = firestore.collection("groupBuys").doc();
          const expiryDate = new Date();
          const expiryHours =
            typeof deal.expiryHours === "number"
              ? deal.expiryHours
              : Number(deal.expiryHours) || 24; // fallback to 24 hours if invalid
          expiryDate.setHours(expiryDate.getHours() + expiryHours);

          dealsBatch.set(dealRef, {
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
            expiryDate: Timestamp.fromDate(expiryDate),
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
          });
        }
      }

      await dealsBatch.commit();
    }

    // Now generate orders
    const ordersModel = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
      },
      systemInstruction: `Generate realistic mock order data for an Indian street food vendor. Return a JSON array of 6-10 orders with the following structure:
      {
        "orders": [
          {
            "productName": "string (Indian ingredients like onions, tomatoes, potatoes, spices, etc.)",
            "quantity": "number (5-50 kg)",
            "pricePerKg": "number (realistic wholesale prices in INR)",
            "total": "number (quantity * pricePerKg)",
            "status": "string (confirmed, processing, at_hub, delivered)",
            "groupBuyId": "string (random ID)",
            "hubName": "string (Indian city/area names)",
            "orderDate": "string (recent dates, last 30 days)",
            "estimatedDelivery": "string (future dates within 7 days)"
          }
        ]
      }
      Make the data realistic for Indian street food vendors. Use appropriate status distribution.`,
    });

    const ordersResult = await ordersModel.generateContent(
      "Generate mock orders for an Indian street food vendor"
    );
    const ordersData = JSON.parse(ordersResult.response.text());

    const ordersBatch = firestore.batch();

    // Add orders to Firestore
    for (const order of ordersData.orders) {
      const orderRef = firestore.collection("orders").doc();
      const orderDate = new Date(order.orderDate);
      const estimatedDelivery = new Date(order.estimatedDelivery);

      ordersBatch.set(orderRef, {
        productName: order.productName,
        quantity: order.quantity,
        pricePerKg: order.pricePerKg,
        total: order.total,
        status: order.status,
        groupBuyId: order.groupBuyId,
        hubName: order.hubName,
        userId: userId,
        createdAt: Timestamp.fromDate(orderDate),
        estimatedDelivery: Timestamp.fromDate(estimatedDelivery),
        updatedAt: Timestamp.now(),
      });
    }

    await ordersBatch.commit();

    const message = dealsSnapshot.empty
      ? `Generated ${
          (dealsData as { deals: Deal[] })?.deals?.length || 0
        } deals and ${(ordersData.orders as Order[]).length} orders`
      : `Successfully generated ${
          (ordersData.orders as Order[]).length
        } mock orders`;
    // Add at the top after imports
    type Deal = {
      productName: string;
      pricePerKg: number;
      targetQuantity: number;
      currentQuantity: number;
      status: string;
      hubName: string;
      hubId: string;
      supplierId: string;
      supplierName: string;
      description: string;
      expiryHours: number;
    };

    type Order = {
      productName: string;
      quantity: number;
      pricePerKg: number;
      total: number;
      status: string;
      groupBuyId: string;
      hubName: string;
      orderDate: string;
      estimatedDelivery: string;
    };

    return NextResponse.json({
      message,
      count: ordersData.orders.length,
    });
  } catch (error) {
    console.error("Error generating mock orders:", error);
    return NextResponse.json(
      { error: "Failed to generate mock data" },
      { status: 500 }
    );
  }
}
