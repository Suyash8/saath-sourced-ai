import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SaathiLogo } from "@/components/SaathiLogo";
import { ArrowLeft, FileText } from "lucide-react";

export default function TermsPage() {
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
            <FileText className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold">Terms of Service</h1>
          </div>
          <p className="text-muted-foreground mb-8">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Acceptance of Terms</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                By accessing and using Saathi&apos;s platform, you accept and
                agree to be bound by these Terms of Service. If you do not agree
                to these terms, please do not use our services.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Service Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm mb-4">
                Saathi provides a group buying platform that enables street food
                vendors to:
              </p>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>• Participate in group purchases for wholesale pricing</li>
                <li>
                  • Access AI-powered business insights and recommendations
                </li>
                <li>• Coordinate order pickups through our hub network</li>
                <li>• Connect with other vendors in the community</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>User Responsibilities</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>
                  • Provide accurate and complete information when registering
                </li>
                <li>• Maintain the security of your account credentials</li>
                <li>
                  • Use the platform only for legitimate business purposes
                </li>
                <li>• Comply with all applicable laws and regulations</li>
                <li>• Respect other users and maintain professional conduct</li>
                <li>• Honor your commitments in group buying arrangements</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Group Buying Terms</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>• Orders are binding once the group buying period ends</li>
                <li>• Payment is required before order processing begins</li>
                <li>
                  • Cancellations may not be possible after group confirmation
                </li>
                <li>• Pickup must occur within specified timeframes</li>
                <li>
                  • Quality issues must be reported within 24 hours of pickup
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Payment and Pricing</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>• All prices are displayed in Indian Rupees (INR)</li>
                <li>• Payment is processed securely through our platform</li>
                <li>• Refunds are subject to our refund policy</li>
                <li>• We reserve the right to change pricing with notice</li>
                <li>• Additional fees may apply for certain services</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Limitation of Liability</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Saathi provides the platform &quot;as is&quot; and makes no
                warranties about the availability, accuracy, or reliability of
                the service. We are not liable for any indirect, incidental, or
                consequential damages arising from your use of the platform.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Termination</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                We may terminate or suspend your account at any time for
                violation of these terms. You may also terminate your account by
                contacting our support team.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Changes to Terms</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                We may update these Terms of Service from time to time. We will
                notify users of significant changes via email or platform
                notifications.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                For questions about these Terms of Service, please contact us at
                legal@saathi.com or through our contact page.
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
