"use client";

import { Header, IconButton } from "@/components/layout/Header";
import { ThemeToggler } from "@/components/layout/ThemeToggler";
import { Bell, User } from "lucide-react";

export default function Home() {
  const userName = "User";

  return (
    <div>
      <Header
        variant="dashboard"
        title={`Good morning, ${userName}!`}
        subtitle="Saathi has found 3 new high-value deals for you today."
      >
        <IconButton
          href="/notifications"
          icon={Bell}
          className="!text-muted-foreground hover:!text-foreground"
        />
        <IconButton
          href="/profile"
          icon={User}
          className="!text-muted-foreground hover:!text-foreground"
        />
      </Header>
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <h2 className="text-xl font-bold mb-4">Top Deals for You</h2>
        <div className="text-center p-8 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground">Loading deals...</p>
        </div>
      </main>
    </div>
  );
}
