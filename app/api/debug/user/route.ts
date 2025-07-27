import { NextRequest, NextResponse } from "next/server";
import { getAdminApp } from "@/firebase/adminConfig";
import { getUserIdFromSession } from "@/app/actions";

export async function GET(request: NextRequest) {
  try {
    const userId = await getUserIdFromSession();

    if (!userId) {
      return NextResponse.json(
        {
          error: "No user session found",
          hasSession: false,
        },
        { status: 401 }
      );
    }

    const firestore = getAdminApp().firestore();
    const userDoc = await firestore.collection("users").doc(userId).get();

    return NextResponse.json({
      userId,
      hasSession: true,
      userDocExists: userDoc.exists,
      userData: userDoc.exists ? userDoc.data() : null,
      debug: {
        timestamp: new Date().toISOString(),
        collection: "users",
        docId: userId,
      },
    });
  } catch (error) {
    console.error("Debug user API error:", error);
    return NextResponse.json(
      {
        error: "Debug failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
