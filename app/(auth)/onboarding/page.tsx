"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { UserOnboarding } from "@/components/UserOnboarding";
import { SaathiLogo } from "@/components/SaathiLogo";

export default function OnboardingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isCheckingProfile, setIsCheckingProfile] = useState(true);

  useEffect(() => {
    const checkUserProfile = async () => {
      console.log("OnboardingPage: Checking profile...", {
        user: !!user,
        loading,
      });

      if (!loading && user) {
        try {
          // Check if user has already completed onboarding
          const response = await fetch("/api/user/profile");
          console.log(
            "OnboardingPage: Profile check response:",
            response.status
          );

          if (response.ok) {
            const profile = await response.json();
            console.log("OnboardingPage: Profile data:", profile);

            if (profile.onboardingCompleted) {
              console.log(
                "OnboardingPage: Onboarding already completed, redirecting to dashboard"
              );
              router.push("/dashboard");
              return;
            }
          }
        } catch (error) {
          console.error("OnboardingPage: Error checking user profile:", error);
        }
      }
      setIsCheckingProfile(false);
    };

    checkUserProfile();
  }, [user, loading, router]);

  console.log("OnboardingPage: Render state", {
    loading,
    isCheckingProfile,
    hasUser: !!user,
    userEmail: user?.email,
  });

  if (loading || isCheckingProfile) {
    console.log("OnboardingPage: Showing loading screen");
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <SaathiLogo size="md" />
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-sm text-muted-foreground">
            Loading: {loading ? "Auth" : ""}{" "}
            {isCheckingProfile ? "Profile" : ""}
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log("OnboardingPage: No user found, redirecting to login");
    router.push("/login");
    return null;
  }

  console.log(
    "OnboardingPage: Rendering UserOnboarding with email:",
    user.email
  );
  return <UserOnboarding />;
}
