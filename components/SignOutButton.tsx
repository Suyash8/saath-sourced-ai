"use client";

import { signOutAction } from "@/app/actions";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";

export function SignOutButton() {
  const handleSignOut = async () => {
    await signOutAction();
  };

  return (
    <Button variant="destructive" className="w-full" onClick={handleSignOut}>
      <LogOut className="mr-2 h-4 w-4" />
      Sign Out
    </Button>
  );
}
