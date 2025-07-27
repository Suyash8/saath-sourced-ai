import { getUserIdFromSession } from "@/app/actions";
import { Header } from "@/components/Header";
import { SignOutButton } from "@/components/SignOutButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAdminApp } from "@/firebase/adminConfig";
import { User, Mail } from "lucide-react";
import { redirect } from "next/navigation";

async function getUserProfile(userId: string) {
  try {
    const userDoc = await getAdminApp()
      .firestore()
      .collection("users")
      .doc(userId)
      .get();

    if (!userDoc.exists) {
      console.warn(`No profile document found for user ID: ${userId}`);
      return null;
    }
    return userDoc.data();
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
}

export default async function ProfilePage() {
  const userId = await getUserIdFromSession();
  if (!userId) {
    redirect("/login");
  }

  const user = await getUserProfile(userId);

  return (
    <div className="min-h-screen bg-background">
      <Header title="My Profile" backHref="/dashboard" />
      <main className="container mx-auto p-4 space-y-6">
        {user ? (
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Full Name</p>
                  <p className="font-medium">{user.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <p className="text-center text-muted-foreground p-8 border-2 border-dashed rounded-lg">
            Could not load profile information.
          </p>
        )}

        <div className="pt-4">
          <SignOutButton />
        </div>
      </main>
    </div>
  );
}
