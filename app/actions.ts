"use server";

import { getAdminApp } from "@/firebase/adminConfig";
import { auth } from "firebase-admin";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

async function getUserIdFromSession(): Promise<string | null> {
  const sessionCookie = (await cookies()).get("session")?.value;
  if (!sessionCookie) return null;
  try {
    const decodedClaims = await auth().verifySessionCookie(sessionCookie, true);
    return decodedClaims.uid;
  } catch (error) {
    return null;
  }
}

export async function joinGroupBuyAction(
  groupBuyId: string,
  quantity: number
): Promise<{ success: boolean; message: string }> {
  const userId = await getUserIdFromSession();
  if (!userId) {
    return {
      success: false,
      message: "Authentication failed. Please log in again.",
    };
  }

  const firestore = getAdminApp().firestore();
  const groupBuyRef = firestore.collection("groupBuys").doc(groupBuyId);
  const newOrderRef = firestore.collection("orders").doc();

  try {
    await firestore.runTransaction(async (transaction) => {
      const groupBuyDoc = await transaction.get(groupBuyRef);
      if (!groupBuyDoc.exists) {
        throw new Error("Deal not found or has expired.");
      }
      const groupBuyData = groupBuyDoc.data()!;

      const total = groupBuyData.pricePerKg * quantity;

      transaction.set(newOrderRef, {
        userId: userId,
        groupBuyId: groupBuyId,
        quantity: quantity,
        status: "confirmed",
        createdAt: Timestamp.now(),
        productName: groupBuyData.productName,
        total: total,
      });

      transaction.update(groupBuyRef, {
        currentQuantity: FieldValue.increment(quantity),
        vendorCount: FieldValue.increment(1),
      });
    });

    revalidatePath("/dashboard");
    revalidatePath("/orders");
    return { success: true, message: "Successfully joined the deal!" };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to join the deal.",
    };
  }
}

export async function acceptGroupBuyAction(
  groupBuyId: string
): Promise<{ success: boolean; message: string }> {
  const supplierId = await getUserIdFromSession();
  if (!supplierId) {
    return { success: false, message: "Authentication failed." };
  }

  const firestore = getAdminApp().firestore();
  const groupBuyRef = firestore.collection("groupBuys").doc(groupBuyId);

  try {
    await groupBuyRef.update({
      status: "processing",
      supplierId: supplierId,
    });

    revalidatePath("/supplier");
    return { success: true, message: "Deal accepted successfully." };
  } catch (error: any) {
    return { success: false, message: "Failed to accept the deal." };
  }
}
