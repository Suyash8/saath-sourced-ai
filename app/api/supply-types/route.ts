import { NextRequest, NextResponse } from "next/server";
import { getAdminApp } from "@/firebase/adminConfig";
import { supplyTypes } from "@/data/supplyTypes";

export async function GET() {
  try {
    const firestore = getAdminApp().firestore();
    const supplyTypesSnapshot = await firestore
      .collection("supplyTypes")
      .orderBy("category")
      .orderBy("name")
      .get();

    if (supplyTypesSnapshot.empty) {
      // If no supply types exist, seed them
      const batch = firestore.batch();

      supplyTypes.forEach((supplyType) => {
        const ref = firestore.collection("supplyTypes").doc(supplyType.id);
        batch.set(ref, {
          ...supplyType,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      });

      await batch.commit();

      return NextResponse.json(supplyTypes);
    }

    const types = supplyTypesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(types);
  } catch (error) {
    console.error("Error fetching supply types:", error);
    return NextResponse.json(
      { error: "Failed to fetch supply types" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supplyType = await request.json();
    const firestore = getAdminApp().firestore();

    // Validate required fields
    if (!supplyType.name || !supplyType.category || !supplyType.unit) {
      return NextResponse.json(
        { error: "Missing required fields: name, category, unit" },
        { status: 400 }
      );
    }

    // Create a safe ID from the name
    const id = supplyType.name
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+/g, "-");

    const newSupplyType = {
      id,
      name: supplyType.name,
      category: supplyType.category,
      unit: supplyType.unit,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await firestore.collection("supplyTypes").doc(id).set(newSupplyType);

    return NextResponse.json(newSupplyType, { status: 201 });
  } catch (error) {
    console.error("Error creating supply type:", error);
    return NextResponse.json(
      { error: "Failed to create supply type" },
      { status: 500 }
    );
  }
}
