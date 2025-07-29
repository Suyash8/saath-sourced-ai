import { getAdminApp } from "@/firebase/adminConfig";
import { auth } from "firebase-admin";
import { NextRequest, NextResponse } from "next/server";

getAdminApp();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const idToken = body.idToken;

    if (!idToken) {
      return NextResponse.json(
        { error: "ID token is required." },
        { status: 400 }
      );
    }

    // Verify the ID token first
    const decodedToken = await auth().verifyIdToken(idToken);
    console.log("Token verified for user:", decodedToken.uid);

    // Set session expiration to 5 days.
    const expiresIn = 60 * 60 * 24 * 5 * 1000;
    const sessionCookie = await auth().createSessionCookie(idToken, {
      expiresIn,
    });

    console.log("Session cookie created, setting in response");

    // Create response
    const response = NextResponse.json({ status: "success" });

    // Set cookie with proper settings
    response.cookies.set("session", sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: expiresIn / 1000, // maxAge is in seconds
      path: "/",
      sameSite: "lax",
    });

    return response;
  } catch (error) {
    console.error("Session login error:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to create session." },
      { status: 401 }
    );
  }
}
