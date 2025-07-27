"use server";

import { getAdminApp } from "@/firebase/adminConfig";
import { auth } from "firebase-admin";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function getUserIdFromSession(): Promise<string | null> {
  const sessionCookie = (await cookies()).get("session")?.value;
  if (!sessionCookie) return null;
  try {
    const decodedClaims = await auth().verifySessionCookie(sessionCookie, true);
    return decodedClaims.uid;
  } catch (error) {
    // Session cookie is invalid. Clear it.
    (await cookies()).delete("session");
    console.error("Error verifying session cookie:", error);
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
  const notificationRef = firestore
    .collection("users")
    .doc(userId)
    .collection("notifications")
    .doc();

  try {
    await firestore.runTransaction(async (transaction) => {
      const groupBuyDoc = await transaction.get(groupBuyRef);
      if (!groupBuyDoc.exists) {
        throw new Error("Deal not found or has expired.");
      }
      const groupBuyData = groupBuyDoc.data()!;

      // 1. Create the order
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

      // 2. Update the group buy
      transaction.update(groupBuyRef, {
        currentQuantity: FieldValue.increment(quantity),
        vendorCount: FieldValue.increment(1),
      });

      // 3. Create a notification for the user
      transaction.set(notificationRef, {
        title: "Successfully Joined Deal! 🎉",
        body: `Your order for ${quantity}kg of ${groupBuyData.productName} has been confirmed.`,
        createdAt: Timestamp.now(),
        read: false,
        href: `/track/${newOrderRef.id}`,
      });
    });

    revalidatePath("/dashboard");
    revalidatePath("/orders");
    revalidatePath("/notifications");
    return { success: true, message: "Successfully joined the deal!" };
  } catch (error: unknown) {
    return {
      success: false,
      message: (error as Error).message || "Failed to join the deal.",
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
  } catch (error: unknown) {
    return {
      success: false,
      message: (error as Error).message || "Failed to accept the deal.",
    };
  }
}

export async function updateGroupBuyStatusAction(
  groupBuyId: string,
  newStatus: string
) {
  const firestore = getAdminApp().firestore();
  const groupBuyRef = firestore.collection("groupBuys").doc(groupBuyId);

  try {
    await groupBuyRef.update({
      status: newStatus,
    });
    revalidatePath("/supplier");
    revalidatePath("/orders");
    return { success: true, message: `Status updated to ${newStatus}.` };
  } catch (error) {
    return {
      success: false,
      message: "Failed to update status: " + (error as Error).message,
    };
  }
}

export async function signOutAction() {
  (await cookies()).delete("session");
  redirect("/login");
}
