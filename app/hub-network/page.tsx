import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SaathiLogo } from "@/components/SaathiLogo";
import { ArrowLeft, MapPin, Clock, Shield, Truck } from "lucide-react";

export default function HubNetworkPage() {
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
          <h1 className="text-4xl font-bold mb-6">Hub Network</h1>
          <p className="text-xl text-muted-foreground mb-12">
            Our strategically located pickup hubs make it convenient for you to
            collect your group buying orders across major cities.
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Strategic Locations</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Our hubs are located in key areas with easy access for street
                  food vendors.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Near major markets and commercial areas</li>
                  <li>• Accessible by public transport</li>
                  <li>• Adequate parking facilities</li>
                  <li>• Safe and secure locations</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Flexible Hours</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Pickup times designed to fit your business schedule.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Extended pickup hours</li>
                  <li>• Weekend availability</li>
                  <li>• Advance booking system</li>
                  <li>• SMS/app notifications</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Hub Features
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Quality Storage</h3>
                  <p className="text-sm text-muted-foreground">
                    Temperature-controlled storage for fresh produce
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Quick Pickup</h3>
                  <p className="text-sm text-muted-foreground">
                    Streamlined process for fast order collection
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Easy Access</h3>
                  <p className="text-sm text-muted-foreground">
                    Convenient locations with clear directions
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="bg-muted/30 rounded-lg p-6 mb-8">
            <h3 className="font-semibold mb-4">How Hub Pickup Works</h3>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mx-auto mb-2 text-primary-foreground font-bold">
                  1
                </div>
                <p className="text-sm">Order Ready Notification</p>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mx-auto mb-2 text-primary-foreground font-bold">
                  2
                </div>
                <p className="text-sm">Choose Pickup Time</p>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mx-auto mb-2 text-primary-foreground font-bold">
                  3
                </div>
                <p className="text-sm">Visit Hub Location</p>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mx-auto mb-2 text-primary-foreground font-bold">
                  4
                </div>
                <p className="text-sm">Collect Your Order</p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Button asChild size="lg">
              <Link href="/signup">Find Nearest Hub</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
