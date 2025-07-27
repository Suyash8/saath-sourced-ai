import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SaathiLogo } from "@/components/SaathiLogo";
import { ArrowLeft, Shield } from "lucide-react";

export default function PrivacyPage() {
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
          <div className="flex items-center gap-3 mb-6">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold">Privacy Policy</h1>
          </div>
          <p className="text-muted-foreground mb-8">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Information We Collect</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Personal Information</h3>
                <p className="text-muted-foreground text-sm">
                  We collect information you provide directly, such as your
                  name, email address, phone number, and business details when
                  you create an account.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Usage Information</h3>
                <p className="text-muted-foreground text-sm">
                  We collect information about how you use our platform,
                  including your interactions with deals, orders, and AI
                  assistant conversations.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Device Information</h3>
                <p className="text-muted-foreground text-sm">
                  We collect information about the device you use to access our
                  platform, including IP address, browser type, and operating
                  system.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>How We Use Your Information</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>• Provide and improve our group buying services</li>
                <li>• Process your orders and facilitate pickups</li>
                <li>• Provide AI-powered recommendations and insights</li>
                <li>• Send you notifications about deals and order status</li>
                <li>• Ensure platform security and prevent fraud</li>
                <li>• Comply with legal obligations</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Information Sharing</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm mb-4">
                We do not sell your personal information. We may share your
                information in the following circumstances:
              </p>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>• With suppliers to fulfill your orders</li>
                <li>• With hub partners for order pickup coordination</li>
                <li>
                  • With service providers who help us operate our platform
                </li>
                <li>• When required by law or to protect our rights</li>
                <li>• With your consent for specific purposes</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Data Security</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                We implement appropriate security measures to protect your
                personal information against unauthorized access, alteration,
                disclosure, or destruction. However, no method of transmission
                over the internet is 100% secure.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Your Rights</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>• Access and update your personal information</li>
                <li>• Request deletion of your account and data</li>
                <li>• Opt out of marketing communications</li>
                <li>• Request a copy of your data</li>
                <li>• File a complaint with relevant authorities</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Contact Us</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                If you have questions about this Privacy Policy or our data
                practices, please contact us at privacy@saathi.com or through
                our contact page.
              </p>
            </CardContent>
          </Card>

          <div className="text-center">
            <Button asChild>
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
