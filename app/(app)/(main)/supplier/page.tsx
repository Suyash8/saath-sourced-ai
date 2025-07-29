"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { GenerateMockDataButton } from "@/components/GenerateMockDataButton";
import { useUserRole } from "@/hooks/useUserRole";
import { User, Package, Eye, Lock, Plus, Edit2, Trash2 } from "lucide-react";
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

interface SupplierSupply {
  id: string;
  productName: string;
  pricePerKg: number;
  availableQuantity: number;
  minimumOrder: number;
  description: string;
  location: string;
  isActive: boolean;
  updatedAt: string;
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

  // Form state for adding/editing supplies
  const [supplyForm, setSupplyForm] = useState({
    productName: "",
    pricePerKg: "",
    availableQuantity: "",
    minimumOrder: "",
    description: "",
    location: "",
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

    fetchDemands();
    fetchSupplies();
  }, []);

  const resetForm = () => {
    setSupplyForm({
      productName: "",
      pricePerKg: "",
      availableQuantity: "",
      minimumOrder: "",
      description: "",
      location: "",
    });
    setEditingSupply(null);
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
