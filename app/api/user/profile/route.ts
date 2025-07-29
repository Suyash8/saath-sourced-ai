import { NextRequest, NextResponse } from "next/server";
import { getAdminApp } from "@/firebase/adminConfig";
import { getUserIdFromSession } from "@/app/actions";

export async function GET(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  request: NextRequest
) {
  const userId = await getUserIdFromSession();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const firestore = getAdminApp().firestore();
    const userDoc = await firestore.collection("users").doc(userId).get();

    if (!userDoc.exists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userData = userDoc.data()!;

    // Convert Firestore timestamps to ISO strings
    const profile = {
      id: userDoc.id,
      ...userData,
      createdAt: userData.createdAt?.toDate?.()?.toISOString() || null,
      updatedAt: userData.updatedAt?.toDate?.()?.toISOString() || null,
    };

    return NextResponse.json(profile);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const userId = await getUserIdFromSession();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const updates = await request.json();
    const firestore = getAdminApp().firestore();

    // Add timestamp for update
    const updateData = {
      ...updates,
      updatedAt: new Date(),
    };

    await firestore.collection("users").doc(userId).update(updateData);

    return NextResponse.json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error updating user profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
