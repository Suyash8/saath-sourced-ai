"use client";

import { Header } from "@/components/layout/Header";
import { Bell, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { vendorNavItems } from "@/config/nav";
import { BottomNav } from "@/components/layout/BottomNav";

export default function Home() {
  const router = useRouter();
  const userName = "User";

  return (
    <div>
      <Header
        variant="dashboard"
        title={`Good morning, ${userName}!`}
        subtitle="Saathi has found 3 new high-value deals for you today."
      >
        {/* Children are passed to the right side */}
        <button
          onClick={() => router.push("/notifications")}
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5 text-muted-foreground hover:text-foreground" />
        </button>
        <button onClick={() => router.push("/profile")} aria-label="Profile">
          <User className="h-5 w-5 text-muted-foreground hover:text-foreground" />
        </button>
      </Header>
      <BottomNav navItems={vendorNavItems} />
    </div>
  );
}
