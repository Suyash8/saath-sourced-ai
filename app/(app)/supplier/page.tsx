import { Header } from "@/components/Header";
import { User } from "lucide-react";
import Link from "next/link";

export default async function SupplierDashboardPage() {
  return (
    <div>
      <Header
        title="Supplier Dashboard"
        subtitle="Manage incoming aggregated group buys"
        backHref="/dashboard"
      >
        <Link href="/profile" aria-label="Profile">
          <User className="h-5 w-5 md:h-6 md:w-6 text-muted-foreground hover:text-foreground" />
        </Link>
      </Header>

      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <h2 className="text-xl font-bold mb-4">Active Group Buys</h2>
        <div className="text-center p-8 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground">Loading aggregated orders...</p>
        </div>
      </main>
    </div>
  );
}
