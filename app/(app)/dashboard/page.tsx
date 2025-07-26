"use client";

import { Header, IconButton } from "@/components/layout/Header";
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
    </div>
  );
}
