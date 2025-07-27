"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserRole } from "@/data/supplyTypes";
import { Store, Truck, Check } from "lucide-react";

interface RoleSelectorProps {
  selectedRoles: UserRole[];
  onRoleChange: (roles: UserRole[]) => void;
  onNext: () => void;
}

export function RoleSelector({
  selectedRoles,
  onRoleChange,
  onNext,
}: RoleSelectorProps) {
  const roles = [
    {
      id: "vendor" as UserRole,
      title: "Street Food Vendor",
      description:
        "I run a street food business and need to buy ingredients in bulk",
      icon: Store,
      color: "bg-blue-50 border-blue-200 hover:bg-blue-100",
      selectedColor: "bg-blue-100 border-blue-500",
    },
    {
      id: "supplier" as UserRole,
      title: "Supplier",
      description: "I supply ingredients and want to connect with vendors",
      icon: Truck,
      color: "bg-green-50 border-green-200 hover:bg-green-100",
      selectedColor: "bg-green-100 border-green-500",
    },
  ];

  const toggleRole = (roleId: UserRole) => {
    if (selectedRoles.includes(roleId)) {
      onRoleChange(selectedRoles.filter((r) => r !== roleId));
    } else {
      onRoleChange([...selectedRoles, roleId]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">What describes you best?</h2>
        <p className="text-muted-foreground">You can select multiple roles</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {roles.map((role) => {
          const isSelected = selectedRoles.includes(role.id);
          const Icon = role.icon;

          return (
            <Card
              key={role.id}
              className={`cursor-pointer transition-all duration-200 hover:scale-[1.02] ${
                isSelected ? role.selectedColor : role.color
              }`}
              onClick={() => toggleRole(role.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        isSelected ? "bg-white" : "bg-white/50"
                      }`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{role.title}</h3>
                    </div>
                  </div>
                  {isSelected && (
                    <div className="bg-white rounded-full p-1">
                      <Check className="h-4 w-4 text-green-600" />
                    </div>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {role.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="flex justify-center">
        <Button
          onClick={onNext}
          disabled={selectedRoles.length === 0}
          size="lg"
          className="min-w-32"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
