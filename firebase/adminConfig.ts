import * as admin from "firebase-admin";

interface ServiceAccount {
  projectId: string;
  clientEmail: string;
  privateKey: string;
}

const serviceAccount: ServiceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID!,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
  privateKey: (process.env.FIREBASE_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
};

let adminApp: admin.app.App;

try {
  if (!admin.apps.length) {
    adminApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } else {
    adminApp = admin.app();
  }
} catch (error: any) {
  if (error.code === "auth/invalid-credential") {
    console.error(
      "Firebase Admin initialization failed: Invalid credentials. Check your .env.local file.",
      error
    );
  } else {
    console.error("Firebase Admin initialization failed:", error);
  }
}

export const getAdminApp = () => {
  if (!adminApp) {
    throw new Error(
      "Firebase Admin has not been initialized. Check server logs for details."
    );
  }
  return adminApp;
};
