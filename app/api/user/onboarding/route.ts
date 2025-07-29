import { NextRequest, NextResponse } from "next/server";
import { getAdminApp } from "@/firebase/adminConfig";
import { getUserIdFromSession } from "@/app/actions";
import { Timestamp } from "firebase-admin/firestore";

export async function POST(request: NextRequest) {
  const userId = await getUserIdFromSession();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const {
      firstName,
      lastName,
      email,
      roles,
      vendorProfile,
      supplierProfile,
    } = await request.json();

    // Validate required fields
    if (!firstName || !lastName || !email || !roles || roles.length === 0) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const firestore = getAdminApp().firestore();
    const userRef = firestore.collection("users").doc(userId);

    // Check if user document exists, if not create it
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      // Create initial user document if it doesn't exist
      await userRef.set({
        uid: userId,
        firstName,
        lastName,
        email,
        createdAt: Timestamp.now(),
        onboardingCompleted: false,
      });
    }

    // Update with onboarding data
    const updateData = {
      firstName,
      lastName,
      email,
      roles,
      vendorProfile: vendorProfile || null,
      supplierProfile: supplierProfile || null,
      updatedAt: Timestamp.now(),
      onboardingCompleted: true,
    };

    await userRef.update(updateData);

    return NextResponse.json({
      message: "Onboarding completed successfully",
      userId,
    });
  } catch (error) {
    console.error("Error completing onboarding:", error);
    return NextResponse.json(
      { error: "Failed to complete onboarding" },
      { status: 500 }
    );
  }
}
