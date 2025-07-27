"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { UserRole } from "@/data/supplyTypes";

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: UserRole[];
  vendorProfile?: any;
  supplierProfile?: any;
  onboardingCompleted?: boolean;
}

export function useUserRole() {
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!authLoading && user) {
        try {
          const response = await fetch("/api/user/profile");
          if (response.ok) {
            const profileData = await response.json();
            setProfile(profileData);
          } else if (response.status === 404) {
            // User hasn't completed onboarding
            setProfile(null);
          } else {
            setError("Failed to fetch profile");
          }
        } catch (err) {
          setError("Failed to fetch profile");
          console.error("Error fetching profile:", err);
        }
      }
      setLoading(false);
    };

    fetchProfile();
  }, [user, authLoading]);

  const hasRole = (role: UserRole): boolean => {
    return profile?.roles?.includes(role) || false;
  };

  const isVendor = hasRole("vendor");
  const isSupplier = hasRole("supplier");

  const canInteract = (requiredRole: UserRole): boolean => {
    return hasRole(requiredRole);
  };

  const getDisplayName = (): string => {
    if (profile) {
      return `${profile.firstName} ${profile.lastName}`;
    }
    return user?.displayName || user?.email || "User";
  };

  return {
    profile,
    loading: loading || authLoading,
    error,
    hasRole,
    isVendor,
    isSupplier,
    canInteract,
    getDisplayName,
    refetch: () => {
      setLoading(true);
      setError(null);
      // Re-trigger the effect
      setProfile(null);
    },
  };
}
