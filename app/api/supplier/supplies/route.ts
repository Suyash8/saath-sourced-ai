import { NextRequest, NextResponse } from "next/server";
import { getAdminApp } from "@/firebase/adminConfig";
import { getUserIdFromSession } from "@/app/actions";
import { Timestamp } from "firebase-admin/firestore";

export async function GET() {
  const userId = await getUserIdFromSession();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const firestore = getAdminApp().firestore();
    const suppliesSnapshot = await firestore
      .collection("supplierSupplies")
      .where("supplierId", "==", userId)
      .orderBy("updatedAt", "desc")
      .get();

    const supplies = suppliesSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        productName: data.productName,
        pricePerKg: data.pricePerKg,
        availableQuantity: data.availableQuantity,
        minimumOrder: data.minimumOrder,
        description: data.description,
        location: data.location,
        isActive: data.isActive,
        updatedAt: data.updatedAt.toDate().toISOString(),
      };
    });

    return NextResponse.json({ supplies });
  } catch (error) {
    console.error("Error fetching supplies:", error);
    return NextResponse.json(
      { error: "Failed to fetch supplies" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const userId = await getUserIdFromSession();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const {
      productName,
      pricePerKg,
      availableQuantity,
      minimumOrder,
      description,
      location,
    } = await req.json();

    if (
      !productName ||
      !pricePerKg ||
      !availableQuantity ||
      !minimumOrder ||
      !location
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const firestore = getAdminApp().firestore();
    const supplyRef = firestore.collection("supplierSupplies").doc();
    const now = Timestamp.now();

    const supplyData = {
      supplierId: userId,
      productName,
      pricePerKg: Number(pricePerKg),
      availableQuantity: Number(availableQuantity),
      minimumOrder: Number(minimumOrder),
      description: description || "",
      location,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    };

    await supplyRef.set(supplyData);

    const supply = {
      id: supplyRef.id,
      ...supplyData,
      createdAt: now.toDate().toISOString(),
      updatedAt: now.toDate().toISOString(),
    };

    return NextResponse.json({ supply });
  } catch (error) {
    console.error("Error creating supply:", error);
    return NextResponse.json(
      { error: "Failed to create supply" },
      { status: 500 }
    );
  }
}
