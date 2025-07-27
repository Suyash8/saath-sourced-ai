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

interface SupplierProfile {
  businessName: string;
  location: string;
  suppliesProvided: string[];
  capacity: number;
  businessDescription: string;
  minimumOrder: number;
}

interface SupplierQuestionnaireProps {
  profile: SupplierProfile;
  onProfileChange: (profile: SupplierProfile) => void;
  onNext: () => void;
  onBack: () => void;
  hideNavigation?: boolean;
}

export function SupplierQuestionnaire({
  profile,
  onProfileChange,
  onNext,
  onBack,
  hideNavigation = false,
}: SupplierQuestionnaireProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [loadingAi, setLoadingAi] = useState(false);

  const updateProfile = (
    field: keyof SupplierProfile,
    value: string | number | string[]
  ) => {
    onProfileChange({ ...profile, [field]: value });
  };

  // Get AI suggestions when business type and location are filled
  useEffect(() => {
    const getAiSuggestions = async () => {
      if (
        profile.businessName &&
        profile.location &&
        profile.businessName.length > 3
      ) {
        setLoadingAi(true);
        try {
          const response = await fetch("/api/ai/questionnaire-suggestions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              role: "supplier",
              businessType: profile.businessName,
              location: profile.location,
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

    const timeoutId = setTimeout(getAiSuggestions, 1000); // Debounce
    return () => clearTimeout(timeoutId);
  }, [profile.businessName, profile.location]);

  const addSupply = (supplyId: string) => {
    if (!profile.suppliesProvided.includes(supplyId)) {
      updateProfile("suppliesProvided", [
        ...profile.suppliesProvided,
        supplyId,
      ]);
    }
  };

  const removeSupply = (supplyId: string) => {
    updateProfile(
      "suppliesProvided",
      profile.suppliesProvided.filter((id) => id !== supplyId)
    );
  };

  const getSupplyName = (id: string) => {
    return supplyTypes.find((s) => s.id === id)?.name || id;
  };

  const isFormValid = () => {
    return (
      profile.businessName &&
      profile.location &&
      profile.suppliesProvided.length > 0 &&
      profile.capacity > 0 &&
      profile.minimumOrder > 0 &&
      profile.businessDescription
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">
          Tell us about your supply business
        </h2>
        <p className="text-muted-foreground">
          This helps vendors find and connect with you
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Business Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="businessName">Business/Farm Name</Label>
            <Input
              id="businessName"
              placeholder="e.g., Sharma Vegetables, Green Valley Farm"
              value={profile.businessName}
              onChange={(e) => updateProfile("businessName", e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="location">Business Location</Label>
            <Input
              id="location"
              placeholder="e.g., Pune, Maharashtra"
              value={profile.location}
              onChange={(e) => updateProfile("location", e.target.value)}
            />
          </div>

          {/* AI Suggestions */}
          {(aiSuggestions.length > 0 || loadingAi) && (
            <Card className="bg-green-50 border-green-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-green-600" />
                  AI Recommendations for your supply business
                  {loadingAi && <Loader2 className="h-4 w-4 animate-spin" />}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {loadingAi ? (
                  <p className="text-sm text-muted-foreground">
                    Analyzing your business type and location...
                  </p>
                ) : (
                  <ul className="space-y-2">
                    {aiSuggestions.map((suggestion, index) => (
                      <li
                        key={index}
                        className="text-sm text-green-700 flex items-start gap-2"
                      >
                        <span className="text-green-500 mt-1">•</span>
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="capacity">Monthly supply capacity (kg)</Label>
              <Input
                id="capacity"
                type="number"
                placeholder="e.g., 5000"
                value={profile.capacity || ""}
                onChange={(e) =>
                  updateProfile("capacity", parseInt(e.target.value) || 0)
                }
              />
            </div>

            <div>
              <Label htmlFor="minimumOrder">Minimum order quantity (kg)</Label>
              <Input
                id="minimumOrder"
                type="number"
                placeholder="e.g., 50"
                value={profile.minimumOrder || ""}
                onChange={(e) =>
                  updateProfile("minimumOrder", parseInt(e.target.value) || 0)
                }
              />
            </div>
          </div>

          <div>
            <Label htmlFor="businessDescription">Describe your business</Label>
            <Textarea
              id="businessDescription"
              placeholder="Tell us about your specialties, quality standards, delivery areas, etc."
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
          <CardTitle>What do you supply?</CardTitle>
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
                      profile.suppliesProvided.includes(supply.id)
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

          {profile.suppliesProvided.length > 0 && (
            <div>
              <Label>Selected supplies:</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {profile.suppliesProvided.map((supplyId) => (
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
