import { NextRequest, NextResponse } from "next/server";
import { getAdminApp } from "@/firebase/adminConfig";
import { getUserIdFromSession } from "@/app/actions";
import { Timestamp } from "firebase-admin/firestore";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ supplyId: string }> }
) {
  const userId = await getUserIdFromSession();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { supplyId } = await params;
    const {
      productName,
      pricePerKg,
      availableQuantity,
      minimumOrder,
      description,
      location,
      imageUrl,
      useDefaultImage,
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

    // Determine the image URL to use
    const finalImageUrl =
      useDefaultImage || !imageUrl
        ? `https://images.unsplash.com/photo-${Math.random()
            .toString()
            .slice(2, 15)}/400x300?q=80&auto=format&fit=crop`
        : imageUrl;

    const updateData = {
      productName,
      pricePerKg: Number(pricePerKg),
      availableQuantity: Number(availableQuantity),
      minimumOrder: Number(minimumOrder),
      description: description || "",
      location,
      imageUrl: finalImageUrl,
      updatedAt: Timestamp.now(),
    };

    await supplyRef.update(updateData);

    const supply = {
      id: supplyId,
      supplierId: userId,
      ...updateData,
      imageUrl: finalImageUrl,
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
  { params }: { params: Promise<{ supplyId: string }> }
) {
  const userId = await getUserIdFromSession();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { supplyId } = await params;
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
