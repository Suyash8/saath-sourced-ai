"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { SignOutButton } from "@/components/SignOutButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useUserRole } from "@/hooks/useUserRole";
import { RoleSelector } from "@/components/RoleSelector";
import { VendorQuestionnaire } from "@/components/VendorQuestionnaire";
import { SupplierQuestionnaire } from "@/components/SupplierQuestionnaire";
import { UserRole } from "@/data/supplyTypes";
import { User, Mail, Settings, Save, Edit } from "lucide-react";
import { toast } from "sonner";

export default function ProfilePage() {
  const { profile, loading, refetch } = useUserRole();
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingRoles, setIsEditingRoles] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [personalInfo, setPersonalInfo] = useState({
    firstName: "",
    lastName: "",
  });

  const [selectedRoles, setSelectedRoles] = useState<UserRole[]>([]);
  const [vendorProfile, setVendorProfile] = useState({
    businessType: "",
    location: "",
    suppliesNeeded: [] as string[],
    dailyCustomers: 0,
    businessDescription: "",
  });

  const [supplierProfile, setSupplierProfile] = useState({
    businessName: "",
    location: "",
    suppliesProvided: [] as string[],
    capacity: 0,
    businessDescription: "",
    minimumOrder: 0,
  });

  useEffect(() => {
    if (profile) {
      setPersonalInfo({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
      });
      setSelectedRoles(profile.roles || []);

      if (profile.vendorProfile) {
        setVendorProfile(profile.vendorProfile);
      }

      if (profile.supplierProfile) {
        setSupplierProfile(profile.supplierProfile);
      }
    }
  }, [profile]);

  const handleSavePersonalInfo = async () => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: personalInfo.firstName,
          lastName: personalInfo.lastName,
        }),
      });

      if (response.ok) {
        toast.success("Personal information updated successfully");
        setIsEditing(false);
        refetch();
      } else {
        toast.error("Failed to update personal information");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update personal information");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveRoles = async () => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
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
        toast.success("Roles updated successfully");
        setIsEditingRoles(false);
        refetch();
      } else {
        toast.error("Failed to update roles");
      }
    } catch (error) {
      console.error("Error updating roles:", error);
      toast.error("Failed to update roles");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <Header title="My Profile" backHref="/dashboard" />
        <main className="container mx-auto p-4">
          <p className="text-center text-muted-foreground p-8 border-2 border-dashed rounded-lg">
            Could not load profile information.
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header title="My Profile" backHref="/dashboard" />
      <main className="container mx-auto p-4 space-y-6 pb-24">
        {/* Personal Information */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
            >
              <Edit className="h-4 w-4 mr-2" />
              {isEditing ? "Cancel" : "Edit"}
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {isEditing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
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
                    value={profile.email}
                    disabled
                    className="bg-muted"
                  />
                </div>
                <Button onClick={handleSavePersonalInfo} disabled={isSaving}>
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Full Name</p>
                    <p className="font-medium">
                      {profile.firstName} {profile.lastName}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{profile.email}</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Roles & Business Information */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Roles & Business Information
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditingRoles(!isEditingRoles)}
            >
              <Edit className="h-4 w-4 mr-2" />
              {isEditingRoles ? "Cancel" : "Edit"}
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {isEditingRoles ? (
              <div className="space-y-6">
                <RoleSelector
                  selectedRoles={selectedRoles}
                  onRoleChange={setSelectedRoles}
                  onNext={() => {}}
                />

                {selectedRoles.includes("vendor") && (
                  <VendorQuestionnaire
                    profile={vendorProfile}
                    onProfileChange={setVendorProfile}
                    onNext={() => {}}
                    onBack={() => {}}
                    hideNavigation
                  />
                )}

                {selectedRoles.includes("supplier") && (
                  <SupplierQuestionnaire
                    profile={supplierProfile}
                    onProfileChange={setSupplierProfile}
                    onNext={() => {}}
                    onBack={() => {}}
                    hideNavigation
                  />
                )}

                <Button onClick={handleSaveRoles} disabled={isSaving}>
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Current Roles
                  </p>
                  <div className="flex gap-2">
                    {profile.roles?.map((role) => (
                      <Badge key={role} variant="secondary">
                        {role === "vendor" ? "Street Food Vendor" : "Supplier"}
                      </Badge>
                    ))}
                  </div>
                </div>

                {profile.vendorProfile && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Vendor Business
                    </p>
                    <p className="font-medium">
                      {profile.vendorProfile.businessType}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {profile.vendorProfile.location} •{" "}
                      {profile.vendorProfile.dailyCustomers} daily customers
                    </p>
                  </div>
                )}

                {profile.supplierProfile && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Supplier Business
                    </p>
                    <p className="font-medium">
                      {profile.supplierProfile.businessName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {profile.supplierProfile.location} • Capacity:{" "}
                      {profile.supplierProfile.capacity} units
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="pt-4">
          <SignOutButton />
        </div>
      </main>
    </div>
  );
}
