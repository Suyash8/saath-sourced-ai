import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SaathiLogo } from "@/components/SaathiLogo";
import { ArrowLeft, Users, ShoppingCart, TrendingDown } from "lucide-react";

export default function GroupBuyingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <SaathiLogo size="xs" />
          <Button variant="ghost" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">Group Buying</h1>
          <p className="text-xl text-muted-foreground mb-12">
            Join forces with other vendors to unlock wholesale prices and reduce
            costs through collective purchasing power.
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>How It Works</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-muted-foreground">
                  <li>• Browse available group buying opportunities</li>
                  <li>• Commit to your required quantity</li>
                  <li>• Wait for the group to reach minimum order</li>
                  <li>• Enjoy wholesale pricing on your purchase</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <TrendingDown className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Benefits</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-muted-foreground">
                  <li>• Save 20-40% on ingredient costs</li>
                  <li>• Access to wholesale suppliers</li>
                  <li>• Quality assured products</li>
                  <li>• Flexible quantity options</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Current Group Buying Process
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mx-auto mb-2 text-primary-foreground font-bold">
                    1
                  </div>
                  <h3 className="font-semibold mb-1">Browse</h3>
                  <p className="text-sm text-muted-foreground">
                    Find deals for ingredients you need
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mx-auto mb-2 text-primary-foreground font-bold">
                    2
                  </div>
                  <h3 className="font-semibold mb-1">Join</h3>
                  <p className="text-sm text-muted-foreground">
                    Commit to your quantity
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mx-auto mb-2 text-primary-foreground font-bold">
                    3
                  </div>
                  <h3 className="font-semibold mb-1">Wait</h3>
                  <p className="text-sm text-muted-foreground">
                    Group reaches minimum order
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mx-auto mb-2 text-primary-foreground font-bold">
                    4
                  </div>
                  <h3 className="font-semibold mb-1">Pickup</h3>
                  <p className="text-sm text-muted-foreground">
                    Collect from hub location
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <Button asChild size="lg">
              <Link href="/signup">Start Group Buying Today</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
