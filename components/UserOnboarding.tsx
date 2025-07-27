"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RoleSelector } from "./RoleSelector";
import { VendorQuestionnaire } from "./VendorQuestionnaire";
import { SupplierQuestionnaire } from "./SupplierQuestionnaire";
import { UserRole } from "@/data/supplyTypes";
import { CheckCircle } from "lucide-react";

type OnboardingStep = "personal" | "roles" | "vendor" | "supplier" | "complete";

interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
}

interface VendorProfile {
  businessType: string;
  location: string;
  suppliesNeeded: string[];
  dailyCustomers: number;
  businessDescription: string;
}

interface SupplierProfile {
  businessName: string;
  location: string;
  suppliesProvided: string[];
  capacity: number;
  businessDescription: string;
  minimumOrder: number;
}

export function UserOnboarding() {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("personal");
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [selectedRoles, setSelectedRoles] = useState<UserRole[]>([]);
  const [vendorProfile, setVendorProfile] = useState<VendorProfile>({
    businessType: "",
    location: "",
    suppliesNeeded: [],
    dailyCustomers: 0,
    businessDescription: "",
  });
  const [supplierProfile, setSupplierProfile] = useState<SupplierProfile>({
    businessName: "",
    location: "",
    suppliesProvided: [],
    capacity: 0,
    businessDescription: "",
    minimumOrder: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;

      console.log("UserOnboarding: Fetching user data for:", user.uid);

      try {
        // Try to get existing profile first
        const profileResponse = await fetch("/api/user/profile");

        if (profileResponse.ok) {
          const profile = await profileResponse.json();
          console.log("UserOnboarding: Existing profile found:", profile);

          // Pre-fill with existing data if any
          setPersonalInfo({
            firstName: profile.firstName || "",
            lastName: profile.lastName || "",
            email: profile.email || user.email || "",
          });

          if (profile.roles) {
            setSelectedRoles(profile.roles);
          }

          if (profile.vendorProfile) {
            setVendorProfile(profile.vendorProfile);
          }

          if (profile.supplierProfile) {
            setSupplierProfile(profile.supplierProfile);
          }
        } else {
          // No profile exists, use auth user data
          console.log("UserOnboarding: No existing profile, using auth data");
          const displayName = user.displayName || "";
          const [firstName = "", lastName = ""] = displayName.split(" ");

          setPersonalInfo({
            firstName,
            lastName,
            email: user.email || "",
          });
        }
      } catch (error) {
        console.error("UserOnboarding: Error fetching user data:", error);

        // Fallback to auth user data
        const displayName = user.displayName || "";
        const [firstName = "", lastName = ""] = displayName.split(" ");

        setPersonalInfo({
          firstName,
          lastName,
          email: user.email || "",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [user, router]);

  const getStepNumber = (step: OnboardingStep): number => {
    const stepMap = {
      personal: 1,
      roles: 2,
      vendor: 3,
      supplier: 4,
      complete: 5,
    };
    return stepMap[step];
  };

  const getTotalSteps = (): number => {
    let total = 2; // personal + roles
    if (selectedRoles.includes("vendor")) total++;
    if (selectedRoles.includes("supplier")) total++;
    return total + 1; // +1 for complete
  };

  const getProgressPercentage = (): number => {
    return (getStepNumber(currentStep) / getTotalSteps()) * 100;
  };

  const handlePersonalInfoNext = () => {
    if (personalInfo.firstName && personalInfo.lastName) {
      setCurrentStep("roles");
    }
  };

  const handleRolesNext = () => {
    if (selectedRoles.includes("vendor")) {
      setCurrentStep("vendor");
    } else if (selectedRoles.includes("supplier")) {
      setCurrentStep("supplier");
    } else {
      setCurrentStep("complete");
    }
  };

  const handleVendorNext = () => {
    if (selectedRoles.includes("supplier")) {
      setCurrentStep("supplier");
    } else {
      setCurrentStep("complete");
    }
  };

  const handleSupplierNext = () => {
    setCurrentStep("complete");
  };

  const handleComplete = async () => {
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/user/onboarding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: personalInfo.firstName,
          lastName: personalInfo.lastName,
          email: personalInfo.email,
          roles: selectedRoles,
          vendorProfile: selectedRoles.includes("vendor")
            ? vendorProfile
            : undefined,
          supplierProfile: selectedRoles.includes("supplier")
            ? supplierProfile
            : undefined,
        }),
      });

      if (response.ok) {
        console.log("UserOnboarding: Onboarding completed successfully");
        router.push("/dashboard");
      } else {
        const errorData = await response.json();
        console.error(
          "UserOnboarding: Failed to complete onboarding:",
          errorData
        );
      }
    } catch (error) {
      console.error("UserOnboarding: Error completing onboarding:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state while fetching user data
  if (isLoading) {
    console.log("UserOnboarding: Loading user data...");
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  console.log("UserOnboarding: Rendering step:", currentStep, {
    personalInfo,
    selectedRoles,
  });

  const renderCurrentStep = () => {
    switch (currentStep) {
      case "personal":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Welcome to Saathi!</h2>
              <p className="text-muted-foreground">
                Let&apos;s start with your basic information
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      placeholder="Enter your first name"
                      value={personalInfo.firstName}
                      onChange={(e) =>
                        setPersonalInfo({
                          ...personalInfo,
                          firstName: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      placeholder="Enter your last name"
                      value={personalInfo.lastName}
                      onChange={(e) =>
                        setPersonalInfo({
                          ...personalInfo,
                          lastName: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={personalInfo.email}
                    onChange={(e) =>
                      setPersonalInfo({
                        ...personalInfo,
                        email: e.target.value,
                      })
                    }
                    className="bg-muted"
                    disabled
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center">
              <Button
                onClick={handlePersonalInfoNext}
                disabled={!personalInfo.firstName || !personalInfo.lastName}
                size="lg"
              >
                Continue
              </Button>
            </div>
          </div>
        );

      case "roles":
        return (
          <RoleSelector
            selectedRoles={selectedRoles}
            onRoleChange={setSelectedRoles}
            onNext={handleRolesNext}
          />
        );

      case "vendor":
        return (
          <VendorQuestionnaire
            profile={vendorProfile}
            onProfileChange={setVendorProfile}
            onNext={handleVendorNext}
            onBack={() => setCurrentStep("roles")}
          />
        );

      case "supplier":
        return (
          <SupplierQuestionnaire
            profile={supplierProfile}
            onProfileChange={setSupplierProfile}
            onNext={handleSupplierNext}
            onBack={() => {
              if (selectedRoles.includes("vendor")) {
                setCurrentStep("vendor");
              } else {
                setCurrentStep("roles");
              }
            }}
          />
        );

      case "complete":
        return (
          <div className="space-y-6 text-center">
            <div className="flex justify-center">
              <div className="bg-green-100 p-4 rounded-full">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-2">You&apos;re all set!</h2>
              <p className="text-muted-foreground">
                Welcome to Saathi, {personalInfo.firstName}! Let&apos;s start
                exploring deals and opportunities.
              </p>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Your Profile Summary:</h3>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>
                  Name: {personalInfo.firstName} {personalInfo.lastName}
                </p>
                <p>Roles: {selectedRoles.join(", ")}</p>
                {selectedRoles.includes("vendor") && (
                  <p>
                    Business: {vendorProfile.businessType} in{" "}
                    {vendorProfile.location}
                  </p>
                )}
                {selectedRoles.includes("supplier") && (
                  <p>
                    Supply Business: {supplierProfile.businessName} in{" "}
                    {supplierProfile.location}
                  </p>
                )}
              </div>
            </div>

            <Button onClick={handleComplete} disabled={isSubmitting} size="lg">
              {isSubmitting ? "Setting up your account..." : "Complete Setup"}
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <Progress value={getProgressPercentage()} className="mb-2" />
          <p className="text-sm text-muted-foreground text-center">
            Step {getStepNumber(currentStep)} of {getTotalSteps()}
          </p>
        </div>

        {renderCurrentStep()}
      </div>
    </div>
  );
}
