import { NextRequest, NextResponse } from "next/server";
import { getAdminApp } from "@/firebase/adminConfig";

export async function POST(request: NextRequest) {
  try {
    const { uid, firstName, lastName, email } = await request.json();

    if (!uid || !firstName || !lastName || !email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const firestore = getAdminApp().firestore();

    // Create the user document in Firestore
    const userDoc = {
      uid,
      firstName,
      lastName,
      email,
      onboardingCompleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await firestore.collection("users").doc(uid).set(userDoc);

    return NextResponse.json({
      message: "User profile created successfully",
      uid,
    });
  } catch (error) {
    console.error("Error creating user profile:", error);
    return NextResponse.json(
      { error: "Failed to create user profile" },
      { status: 500 }
    );
  }
}
