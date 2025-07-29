"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supplyTypes, supplyCategories } from "@/data/supplyTypes";
import { Badge } from "@/components/ui/badge";
import { X, Lightbulb, Loader2 } from "lucide-react";

export interface VendorProfile {
  businessType: string;
  location: string;
  suppliesNeeded: string[];
  dailyCustomers: number;
  businessDescription: string;
}

interface VendorQuestionnaireProps {
  profile: VendorProfile;
  onProfileChange: (profile: VendorProfile) => void;
  onNext: () => void;
  onBack: () => void;
  hideNavigation?: boolean;
}

export function VendorQuestionnaire({
  profile,
  onProfileChange,
  onNext,
  onBack,
  hideNavigation = false,
}: VendorQuestionnaireProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [loadingAi, setLoadingAi] = useState(false);

  const updateProfile = (
    field: keyof VendorProfile,
    value: string | number | string[]
  ) => {
    onProfileChange({ ...profile, [field]: value });
  };

  // Get AI suggestions when business description is filled
  useEffect(() => {
    const getAiSuggestions = async () => {
      if (
        profile.businessDescription &&
        profile.businessType &&
        profile.businessDescription.length > 10
      ) {
        setLoadingAi(true);
        try {
          const response = await fetch("/api/ai/supply-suggestions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              businessDescription: profile.businessDescription,
              businessType: profile.businessType,
              isSupplier: false,
            }),
          });

          if (response.ok) {
            const data = await response.json();
            setAiSuggestions(data.suggestions || []);
          }
        } catch (error) {
          console.error("Error fetching AI suggestions:", error);
        } finally {
          setLoadingAi(false);
        }
      } else {
        setAiSuggestions([]);
      }
    };

    const timeoutId = setTimeout(getAiSuggestions, 1500); // Debounce
    return () => clearTimeout(timeoutId);
  }, [profile.businessDescription, profile.businessType]);

  const addSupply = (supplyId: string) => {
    if (!profile.suppliesNeeded.includes(supplyId)) {
      updateProfile("suppliesNeeded", [...profile.suppliesNeeded, supplyId]);
    }
  };

  const removeSupply = (supplyId: string) => {
    updateProfile(
      "suppliesNeeded",
      profile.suppliesNeeded.filter((id) => id !== supplyId)
    );
  };

  const getSupplyName = (id: string) => {
    return supplyTypes.find((s) => s.id === id)?.name || id;
  };

  const isFormValid = () => {
    return (
      profile.businessType &&
      profile.location &&
      profile.suppliesNeeded.length > 0 &&
      profile.dailyCustomers > 0 &&
      profile.businessDescription
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Tell us about your business</h2>
        <p className="text-muted-foreground">
          This helps us provide better recommendations
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Business Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="businessType">
              What type of food business do you run?
            </Label>
            <Input
              id="businessType"
              placeholder="e.g., Chaat stall, Dosa counter, Tea stall"
              value={profile.businessType}
              onChange={(e) => updateProfile("businessType", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Business Location</Label>
            <Input
              id="location"
              placeholder="e.g., Andheri West, Mumbai"
              value={profile.location}
              onChange={(e) => updateProfile("location", e.target.value)}
            />
          </div>

          {/* AI Suggestions */}
          {(aiSuggestions.length > 0 || loadingAi) && (
            <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  AI Recommendations for your business
                  {loadingAi && <Loader2 className="h-4 w-4 animate-spin" />}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {loadingAi ? (
                  <p className="text-sm text-muted-foreground">
                    Analyzing your business description...
                  </p>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Based on your business description, you might need these
                      supplies:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {aiSuggestions.map((suggestion, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          className="h-7 text-xs border-blue-300 dark:border-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900/50"
                          onClick={() => addSupply(suggestion)}
                          disabled={profile.suppliesNeeded.includes(suggestion)}
                        >
                          {profile.suppliesNeeded.includes(suggestion)
                            ? "✓ Added"
                            : `+ ${suggestion}`}
                        </Button>
                      ))}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-xs"
                      onClick={() => {
                        const newSupplies = aiSuggestions.filter(
                          (suggestion) =>
                            !profile.suppliesNeeded.includes(suggestion)
                        );
                        updateProfile("suppliesNeeded", [
                          ...profile.suppliesNeeded,
                          ...newSupplies,
                        ]);
                      }}
                      disabled={aiSuggestions.every((suggestion) =>
                        profile.suppliesNeeded.includes(suggestion)
                      )}
                    >
                      Add All Suggestions
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          <div className="space-y-2">
            <Label htmlFor="dailyCustomers">Approximate daily customers</Label>
            <Input
              id="dailyCustomers"
              type="number"
              placeholder="e.g., 100"
              value={profile.dailyCustomers || ""}
              onChange={(e) =>
                updateProfile("dailyCustomers", parseInt(e.target.value) || 0)
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="businessDescription">Describe your business</Label>
            <Textarea
              id="businessDescription"
              placeholder="Tell us about your specialties, target customers, etc."
              value={profile.businessDescription}
              onChange={(e) =>
                updateProfile("businessDescription", e.target.value)
              }
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>What supplies do you need?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {supplyCategories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() =>
                  setSelectedCategory(
                    selectedCategory === category ? null : category
                  )
                }
              >
                {category}
              </Button>
            ))}
          </div>

          {selectedCategory && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {supplyTypes
                .filter((supply) => supply.category === selectedCategory)
                .map((supply) => (
                  <Button
                    key={supply.id}
                    variant={
                      profile.suppliesNeeded.includes(supply.id)
                        ? "secondary"
                        : "outline"
                    }
                    size="sm"
                    onClick={() => addSupply(supply.id)}
                    className="justify-start"
                  >
                    {supply.name}
                  </Button>
                ))}
            </div>
          )}

          {profile.suppliesNeeded.length > 0 && (
            <div>
              <Label>Selected supplies:</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {profile.suppliesNeeded.map((supplyId) => (
                  <Badge
                    key={supplyId}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {getSupplyName(supplyId)}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => removeSupply(supplyId)}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {!hideNavigation && (
        <div className="flex justify-between">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button onClick={onNext} disabled={!isFormValid()}>
            Continue
          </Button>
        </div>
      )}
    </div>
  );
}
