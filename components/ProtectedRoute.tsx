"use client";

import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect, ReactNode, useState } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [checkingOnboarding, setCheckingOnboarding] = useState(true);

  useEffect(() => {
    const checkUserAndOnboarding = async () => {
      if (loading) return;

      if (!user) {
        console.log("ProtectedRoute: No user found, redirecting to login");
        router.push("/login");
        return;
      }

      console.log("ProtectedRoute: User found, checking profile...", user.uid);

      try {
        const response = await fetch("/api/user/profile");
        console.log(
          "ProtectedRoute: Profile API response status:",
          response.status
        );

        if (response.status === 404) {
          console.log(
            "ProtectedRoute: User profile not found, redirecting to onboarding"
          );
          router.push("/onboarding");
          return;
        }

        if (response.ok) {
          const profile = await response.json();
          console.log("ProtectedRoute: Profile data:", {
            hasProfile: !!profile,
            onboardingCompleted: profile.onboardingCompleted,
            roles: profile.roles,
          });

          if (!profile.onboardingCompleted) {
            console.log(
              "ProtectedRoute: Onboarding not completed, redirecting to onboarding"
            );
            router.push("/onboarding");
            return;
          }
        } else {
          console.error(
            "ProtectedRoute: Profile API error:",
            response.status,
            response.statusText
          );
        }
      } catch (error) {
        console.error("ProtectedRoute: Error checking user status:", error);
      } finally {
        setCheckingOnboarding(false);
      }
    };

    checkUserAndOnboarding();
  }, [user, loading, router]);

  if (loading || checkingOnboarding) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (user) {
    return <>{children}</>;
  }

  return null;
};
