"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { GenerateMockDataButton } from "@/components/GenerateMockDataButton";
import { GroupBuyCard } from "@/components/GroupBuyCard";
import { useUserRole } from "@/hooks/useUserRole";
import { User, Package, Eye, Lock, Plus, Edit2, Trash2, BrainCircuit, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SupplierDemandCard, Demand } from "@/components/SupplierDemandCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { supplyTypes } from "@/data/supplyTypes";
import { getDefaultSupplyImage } from "@/lib/supply-images";
import Image from "next/image";

interface SupplierSupply {
  id: string;
  productName: string;
  pricePerKg: number;
  availableQuantity: number;
  minimumOrder: number;
  description: string;
  location: string;
  category?: string;
  imageUrl?: string;
  isActive: boolean;
  updatedAt: string;
}

interface GroupBuy {
  id: string;
  productName: string;
  description?: string;
  targetQuantity: number;
  currentQuantity: number;
  pricePerKg: number;
  status: "open" | "closed" | "fulfilled";
  endDate?: string;
  expiryDate: string;
  location?: string;
  hubName: string;
  imageUrl?: string;
  aiScore?: number;
  aiReasoning?: string;
}

export default function SupplierDashboardPage() {
  const { loading, canInteract } = useUserRole();
  const [demands, setDemands] = useState<{
    active: Demand[];
    accepted: Demand[];
  }>({
    active: [],
    accepted: [],
  });
  const [isLoadingDemands, setIsLoadingDemands] = useState(true);
  const [supplies, setSupplies] = useState<SupplierSupply[]>([]);
  const [isLoadingSupplies, setIsLoadingSupplies] = useState(true);
  const [showAddSupplyDialog, setShowAddSupplyDialog] = useState(false);
  const [editingSupply, setEditingSupply] = useState<SupplierSupply | null>(
    null
  );

  // Deal-related state
  const [deals, setDeals] = useState<GroupBuy[]>([]);
  const [isLoadingDeals, setIsLoadingDeals] = useState(false);
  const [isScoringDeals, setIsScoringDeals] = useState(false);
  const [hasAIScores, setHasAIScores] = useState(false);

  // Form state for adding/editing supplies
  const [supplyForm, setSupplyForm] = useState({
    productName: "",
    pricePerKg: "",
    availableQuantity: "",
    minimumOrder: "",
    description: "",
    location: "",
    category: "Other",
    imageUrl: "",
    useDefaultImage: true,
  });

  useEffect(() => {
    const fetchDemands = async () => {
      try {
        const response = await fetch("/api/supplier/demands");
        if (response.ok) {
          const data = await response.json();
          setDemands(data);
        }
      } catch (error) {
        console.error("Error fetching demands:", error);
      } finally {
        setIsLoadingDemands(false);
      }
    };

    const fetchSupplies = async () => {
      try {
        const response = await fetch("/api/supplier/supplies");
        if (response.ok) {
          const data = await response.json();
          setSupplies(data.supplies || []);
        }
      } catch (error) {
        console.error("Error fetching supplies:", error);
      } finally {
        setIsLoadingSupplies(false);
      }
    };

    const fetchDeals = async () => {
      setIsLoadingDeals(true);
      try {
        const response = await fetch("/api/mock-data/deals");
        if (response.ok) {
          const data = await response.json();
          const dealsWithScores = data.deals || [];
          setDeals(dealsWithScores);
          setHasAIScores(dealsWithScores.some((deal: GroupBuy) => deal.aiScore !== undefined));
        }
      } catch (error) {
        console.error("Error fetching deals:", error);
      } finally {
        setIsLoadingDeals(false);
      }
    };

    fetchDemands();
    fetchSupplies();
    fetchDeals();
  }, []);

  const resetForm = () => {
    setSupplyForm({
      productName: "",
      pricePerKg: "",
      availableQuantity: "",
      minimumOrder: "",
      description: "",
      location: "",
      category: "Other",
      imageUrl: "",
      useDefaultImage: true,
    });
    setEditingSupply(null);
  };

  const handleScoreDeals = async () => {
    setIsScoringDeals(true);
    try {
      // Get user profile for scoring
      const userProfileResponse = await fetch("/api/user/profile");
      const userProfile = userProfileResponse.ok ? await userProfileResponse.json() : null;

      const response = await fetch("/api/ai/score-deals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deals: deals,
          userProfile,
        }),
      });

      if (response.ok) {
        const { scoredDeals } = await response.json();
        setDeals(scoredDeals);
        setHasAIScores(true);

        // Store scores in database
        await fetch("/api/ai/store-scores", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ scoredDeals }),
        });
      }
    } catch (error) {
      console.error("Error scoring deals:", error);
    } finally {
      setIsScoringDeals(false);
    }
  };

  const handleAddSupply = async () => {
    try {
      const response = await fetch("/api/supplier/supplies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...supplyForm,
          pricePerKg: parseFloat(supplyForm.pricePerKg),
          availableQuantity: parseInt(supplyForm.availableQuantity),
          minimumOrder: parseInt(supplyForm.minimumOrder),
        }),
      });

      if (response.ok) {
        const newSupply = await response.json();
        setSupplies([...supplies, newSupply.supply]);
        setShowAddSupplyDialog(false);
        resetForm();
      }
    } catch (error) {
      console.error("Error adding supply:", error);
    }
  };

  const handleEditSupply = async () => {
    if (!editingSupply) return;

    try {
      const response = await fetch(
        `/api/supplier/supplies/${editingSupply.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...supplyForm,
            pricePerKg: parseFloat(supplyForm.pricePerKg),
            availableQuantity: parseInt(supplyForm.availableQuantity),
            minimumOrder: parseInt(supplyForm.minimumOrder),
          }),
        }
      );

      if (response.ok) {
        const updatedSupply = await response.json();
        setSupplies(
          supplies.map((s) =>
            s.id === editingSupply.id ? updatedSupply.supply : s
          )
        );
        setEditingSupply(null);
        resetForm();
      }
    } catch (error) {
      console.error("Error updating supply:", error);
    }
  };

  const handleDeleteSupply = async (supplyId: string) => {
    try {
      const response = await fetch(`/api/supplier/supplies/${supplyId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setSupplies(supplies.filter((s) => s.id !== supplyId));
      }
    } catch (error) {
      console.error("Error deleting supply:", error);
    }
  };

  const openEditDialog = (supply: SupplierSupply) => {
    setEditingSupply(supply);
    setSupplyForm({
      productName: supply.productName,
      pricePerKg: supply.pricePerKg.toString(),
      availableQuantity: supply.availableQuantity.toString(),
      minimumOrder: supply.minimumOrder.toString(),
      description: supply.description,
      location: supply.location,
      category: supply.category || "Other",
      imageUrl: supply.imageUrl || "",
      useDefaultImage: !supply.imageUrl,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const renderContent = () => {
    if (!canInteract("supplier")) {
      return (
        <div className="text-center p-8">
          <div className="bg-muted/50 p-6 rounded-lg max-w-md mx-auto">
            <Eye className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">View Only Mode</h3>
            <p className="text-muted-foreground mb-4">
              You&apos;re viewing the supplier dashboard. To interact with
              demands, you need supplier access.
            </p>
            <Button asChild variant="outline">
              <Link href="/profile">
                <Lock className="h-4 w-4 mr-2" />
                Update Profile
              </Link>
            </Button>
          </div>
        </div>
      );
    }

    return (
      <>
        {/* My Supplies Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">My Supplies</h2>
            <Dialog
              open={showAddSupplyDialog}
              onOpenChange={setShowAddSupplyDialog}
            >
              <DialogTrigger asChild>
                <Button onClick={resetForm}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Supply
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Supply</DialogTitle>
                  <DialogDescription>
                    Add a new product to your supply catalog
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="productName">Product Name</Label>
                    <select
                      id="productName"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={supplyForm.productName}
                      onChange={(e) =>
                        setSupplyForm({
                          ...supplyForm,
                          productName: e.target.value,
                        })
                      }
                    >
                      <option value="">Select a product</option>
                      {supplyTypes.map((supply) => (
                        <option key={supply.id} value={supply.name}>
                          {supply.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <Label htmlFor="pricePerKg">Price per kg (₹)</Label>
                      <Input
                        id="pricePerKg"
                        type="number"
                        step="0.01"
                        value={supplyForm.pricePerKg}
                        onChange={(e) =>
                          setSupplyForm({
                            ...supplyForm,
                            pricePerKg: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="availableQuantity">Available (kg)</Label>
                      <Input
                        id="availableQuantity"
                        type="number"
                        value={supplyForm.availableQuantity}
                        onChange={(e) =>
                          setSupplyForm({
                            ...supplyForm,
                            availableQuantity: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <Label htmlFor="minimumOrder">Min Order (kg)</Label>
                      <Input
                        id="minimumOrder"
                        type="number"
                        value={supplyForm.minimumOrder}
                        onChange={(e) =>
                          setSupplyForm({
                            ...supplyForm,
                            minimumOrder: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={supplyForm.location}
                        onChange={(e) =>
                          setSupplyForm({
                            ...supplyForm,
                            location: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={supplyForm.description}
                      onChange={(e) =>
                        setSupplyForm({
                          ...supplyForm,
                          description: e.target.value,
                        })
                      }
                      rows={3}
                    />
                  </div>
                  
                  {/* Image Selection */}
                  <div className="space-y-3">
                    <Label>Product Image</Label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="useDefaultImage"
                        checked={supplyForm.useDefaultImage}
                        onChange={(e) =>
                          setSupplyForm({
                            ...supplyForm,
                            useDefaultImage: e.target.checked,
                            imageUrl: e.target.checked ? "" : supplyForm.imageUrl,
                          })
                        }
                        className="rounded"
                      />
                      <Label htmlFor="useDefaultImage" className="text-sm">
                        Use default image for this product
                      </Label>
                    </div>
                    
                    {supplyForm.useDefaultImage && supplyForm.productName && (
                      <div className="mt-2">
                        <Image
                          src={getDefaultSupplyImage(supplyForm.productName)}
                          alt={supplyForm.productName}
                          width={200}
                          height={150}
                          className="rounded border object-cover"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Default image for {supplyForm.productName}
                        </p>
                      </div>
                    )}
                    
                    {!supplyForm.useDefaultImage && (
                      <div className="space-y-2">
                        <Label htmlFor="imageUrl">Custom Image URL</Label>
                        <Input
                          id="imageUrl"
                          placeholder="https://example.com/image.jpg"
                          value={supplyForm.imageUrl}
                          onChange={(e) =>
                            setSupplyForm({
                              ...supplyForm,
                              imageUrl: e.target.value,
                            })
                          }
                        />
                        {supplyForm.imageUrl && (
                          <Image
                            src={supplyForm.imageUrl}
                            alt="Custom product image"
                            width={200}
                            height={150}
                            className="rounded border object-cover"
                          />
                        )}
                      </div>
                    )}
                  </div>
                  
                  <Button
                    onClick={handleAddSupply}
                    className="w-full"
                    disabled={
                      !supplyForm.productName ||
                      !supplyForm.pricePerKg ||
                      !supplyForm.availableQuantity ||
                      !supplyForm.minimumOrder ||
                      !supplyForm.location
                    }
                  >
                    Add Supply
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Edit Supply Dialog */}
          <Dialog
            open={!!editingSupply}
            onOpenChange={(open) => !open && setEditingSupply(null)}
          >
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Edit Supply</DialogTitle>
                <DialogDescription>
                  Update your supply information
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="editProductName">Product Name</Label>
                  <select
                    id="editProductName"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={supplyForm.productName}
                    onChange={(e) =>
                      setSupplyForm({
                        ...supplyForm,
                        productName: e.target.value,
                      })
                    }
                  >
                    <option value="">Select a product</option>
                    {supplyTypes.map((supply) => (
                      <option key={supply.id} value={supply.name}>
                        {supply.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label htmlFor="editPricePerKg">Price per kg (₹)</Label>
                    <Input
                      id="editPricePerKg"
                      type="number"
                      step="0.01"
                      value={supplyForm.pricePerKg}
                      onChange={(e) =>
                        setSupplyForm({
                          ...supplyForm,
                          pricePerKg: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="editAvailableQuantity">
                      Available (kg)
                    </Label>
                    <Input
                      id="editAvailableQuantity"
                      type="number"
                      value={supplyForm.availableQuantity}
                      onChange={(e) =>
                        setSupplyForm({
                          ...supplyForm,
                          availableQuantity: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label htmlFor="editMinimumOrder">Min Order (kg)</Label>
                    <Input
                      id="editMinimumOrder"
                      type="number"
                      value={supplyForm.minimumOrder}
                      onChange={(e) =>
                        setSupplyForm({
                          ...supplyForm,
                          minimumOrder: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="editLocation">Location</Label>
                    <Input
                      id="editLocation"
                      value={supplyForm.location}
                      onChange={(e) =>
                        setSupplyForm({
                          ...supplyForm,
                          location: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editDescription">Description</Label>
                  <Textarea
                    id="editDescription"
                    value={supplyForm.description}
                    onChange={(e) =>
                      setSupplyForm({
                        ...supplyForm,
                        description: e.target.value,
                      })
                    }
                    rows={3}
                  />
                </div>
                
                {/* Image Selection for Edit */}
                <div className="space-y-4">
                  <Label>Supply Image</Label>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="editUseDefaultImage"
                        checked={supplyForm.useDefaultImage}
                        onChange={(e) =>
                          setSupplyForm({
                            ...supplyForm,
                            useDefaultImage: e.target.checked,
                            imageUrl: e.target.checked
                              ? getDefaultSupplyImage(supplyForm.category || 'Other')
                              : supplyForm.imageUrl,
                          })
                        }
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor="editUseDefaultImage" className="text-sm">
                        Use default image for this category
                      </Label>
                    </div>

                    {supplyForm.useDefaultImage ? (
                      <div className="flex flex-col space-y-2">
                        <span className="text-sm text-muted-foreground">
                          Default image for {supplyForm.category}:
                        </span>
                        <Image
                          src={getDefaultSupplyImage(supplyForm.category || 'Other')}
                          alt={`Default ${supplyForm.category} image`}
                          width={200}
                          height={150}
                          className="rounded-lg object-cover border"
                        />
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Label htmlFor="editImageUrl">Custom Image URL</Label>
                        <Input
                          id="editImageUrl"
                          type="url"
                          placeholder="Enter image URL"
                          value={supplyForm.imageUrl}
                          onChange={(e) =>
                            setSupplyForm({
                              ...supplyForm,
                              imageUrl: e.target.value,
                            })
                          }
                        />
                        {supplyForm.imageUrl && (
                          <div className="mt-2">
                            <span className="text-sm text-muted-foreground">Preview:</span>
                            <Image
                              src={supplyForm.imageUrl}
                              alt="Supply preview"
                              width={200}
                              height={150}
                              className="rounded-lg object-cover border mt-1"
                              onError={() => {
                                console.log('Image failed to load');
                              }}
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <Button
                  onClick={handleEditSupply}
                  className="w-full"
                  disabled={
                    !supplyForm.productName ||
                    !supplyForm.pricePerKg ||
                    !supplyForm.availableQuantity ||
                    !supplyForm.minimumOrder ||
                    !supplyForm.location
                  }
                >
                  Update Supply
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {isLoadingSupplies ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
            </div>
          ) : supplies.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {supplies.map((supply) => (
                <Card key={supply.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">
                        {supply.productName}
                      </CardTitle>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openEditDialog(supply)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteSupply(supply.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={supply.isActive ? "default" : "secondary"}
                      >
                        {supply.isActive ? "Active" : "Inactive"}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {supply.location}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Price:</span>
                        <span className="font-medium">
                          ₹{supply.pricePerKg}/kg
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Available:</span>
                        <span>{supply.availableQuantity}kg</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Min Order:</span>
                        <span>{supply.minimumOrder}kg</span>
                      </div>
                      {supply.description && (
                        <p className="text-sm text-muted-foreground mt-2">
                          {supply.description}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No supplies yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start by adding your first supply to showcase what you offer
                </p>
                <Button
                  onClick={() => {
                    resetForm();
                    setShowAddSupplyDialog(true);
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Supply
                </Button>
              </CardContent>
            </Card>
          )}
        </section>

        {/* Available Deals Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Available Deals</h2>
            <Button
              onClick={handleScoreDeals}
              disabled={isScoringDeals}
              variant={hasAIScores ? "secondary" : "default"}
              size="sm"
            >
              {isScoringDeals ? (
                <>
                  <BrainCircuit className="h-4 w-4 mr-2 animate-spin" />
                  AI Analyzing...
                </>
              ) : hasAIScores ? (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Re-score with AI
                </>
              ) : (
                <>
                  <BrainCircuit className="h-4 w-4 mr-2" />
                  Score with AI
                </>
              )}
            </Button>
          </div>
          
          {isLoadingDeals ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
            </div>
          ) : deals.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {deals
                .sort((a, b) => {
                  // Sort by AI score if available (highest first)
                  if (a.aiScore !== undefined && b.aiScore !== undefined) {
                    return b.aiScore - a.aiScore;
                  }
                  if (a.aiScore !== undefined && b.aiScore === undefined) {
                    return -1; // a comes first
                  }
                  if (a.aiScore === undefined && b.aiScore !== undefined) {
                    return 1; // b comes first
                  }
                  return 0; // maintain original order
                })
                .map((deal) => (
                  <GroupBuyCard key={deal.id} buy={deal} />
                ))}
            </div>
          ) : (
            <div className="text-center p-8 border-2 border-dashed rounded-lg">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No deals available</h3>
              <p className="text-muted-foreground mb-6">
                Generate some sample deals to get started
              </p>
              <GenerateMockDataButton
                endpoint="/api/mock-data/deals"
                label="Generate Sample Deals"
              />
            </div>
          )}
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Active Demand</h2>
          {demands.active.length > 0 ? (
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {demands.active.map((demand) => (
                <SupplierDemandCard key={demand.id} demand={demand} />
              ))}
            </div>
          ) : demands.active.length === 0 && demands.accepted.length === 0 ? (
            <div className="text-center p-8 border-2 border-dashed rounded-lg">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No supplier demands</h3>
              <p className="text-muted-foreground mb-6">
                Generate some sample supplier demands to get started
              </p>
              <GenerateMockDataButton
                endpoint="/api/mock-data/supplier"
                label="Generate Sample Demands"
              />
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No new demands at the moment.
            </p>
          )}
        </section>
        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Accepted Demand</h2>
          {demands.accepted.length > 0 ? (
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {demands.accepted.map((demand) => (
                <SupplierDemandCard key={demand.id} demand={demand} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              You have not accepted any demands.
            </p>
          )}
        </section>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        title="Supplier Dashboard"
        subtitle={
          canInteract("supplier")
            ? "Manage aggregated demand"
            : "View supplier demands (Read-only)"
        }
        backHref="/dashboard"
      >
        <Link href="/profile" aria-label="Profile">
          <User className="h-5 w-5 md:h-6 md:w-6" />
        </Link>
      </Header>
      <main className="p-4 space-y-6 pb-24 container mx-auto">
        {isLoadingDemands ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          </div>
        ) : (
          renderContent()
        )}
      </main>
    </div>
  );
}
