import { NextRequest, NextResponse } from "next/server";
import { getAdminApp } from "@/firebase/adminConfig";
import { getUserIdFromSession } from "@/app/actions";
import { Timestamp } from "firebase-admin/firestore";

export async function PUT(
  req: NextRequest,
  { params }: { params: { supplyId: string } }
) {
  const userId = await getUserIdFromSession();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { supplyId } = params;
    const {
      productName,
      pricePerKg,
      availableQuantity,
      minimumOrder,
      description,
      location,
    } = await req.json();

    const firestore = getAdminApp().firestore();
    const supplyRef = firestore.collection("supplierSupplies").doc(supplyId);

    // Check if the supply exists and belongs to the user
    const supplyDoc = await supplyRef.get();
    if (!supplyDoc.exists) {
      return NextResponse.json({ error: "Supply not found" }, { status: 404 });
    }

    const supplyData = supplyDoc.data();
    if (supplyData?.supplierId !== userId) {
      return NextResponse.json(
        { error: "Unauthorized to edit this supply" },
        { status: 403 }
      );
    }

    const updateData = {
      productName,
      pricePerKg: Number(pricePerKg),
      availableQuantity: Number(availableQuantity),
      minimumOrder: Number(minimumOrder),
      description: description || "",
      location,
      updatedAt: Timestamp.now(),
    };

    await supplyRef.update(updateData);

    const supply = {
      id: supplyId,
      supplierId: userId,
      ...updateData,
      isActive: supplyData.isActive,
      createdAt: supplyData.createdAt.toDate().toISOString(),
      updatedAt: updateData.updatedAt.toDate().toISOString(),
    };

    return NextResponse.json({ supply });
  } catch (error) {
    console.error("Error updating supply:", error);
    return NextResponse.json(
      { error: "Failed to update supply" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { supplyId: string } }
) {
  const userId = await getUserIdFromSession();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { supplyId } = params;
    const firestore = getAdminApp().firestore();
    const supplyRef = firestore.collection("supplierSupplies").doc(supplyId);

    // Check if the supply exists and belongs to the user
    const supplyDoc = await supplyRef.get();
    if (!supplyDoc.exists) {
      return NextResponse.json({ error: "Supply not found" }, { status: 404 });
    }

    const supplyData = supplyDoc.data();
    if (supplyData?.supplierId !== userId) {
      return NextResponse.json(
        { error: "Unauthorized to delete this supply" },
        { status: 403 }
      );
    }

    await supplyRef.delete();

    return NextResponse.json({ message: "Supply deleted successfully" });
  } catch (error) {
    console.error("Error deleting supply:", error);
    return NextResponse.json(
      { error: "Failed to delete supply" },
      { status: 500 }
    );
  }
}
