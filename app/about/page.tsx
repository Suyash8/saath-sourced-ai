import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SaathiLogo } from "@/components/SaathiLogo";
import { ArrowLeft, Target, Users, Lightbulb, Heart } from "lucide-react";

export default function AboutPage() {
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
          <h1 className="text-4xl font-bold mb-6">About Saathi</h1>
          <p className="text-xl text-muted-foreground mb-12">
            We&apos;re building the future of supply chain management for
            India&apos;s street food vendors through technology and community.
          </p>

          <Card className="mb-12">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">Our Story</h2>
              <p className="text-muted-foreground mb-4">
                Saathi was born from a simple observation: India&apos;s street
                food vendors, who feed millions daily, often struggle with high
                ingredient costs and unreliable supply chains. We saw an
                opportunity to leverage technology and collective buying power
                to solve this problem.
              </p>
              <p className="text-muted-foreground">
                This project was developed as part of a hackathon to demonstrate
                how AI and group buying can transform traditional supply chains
                and empower small business owners.
              </p>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Our Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  To empower street food vendors across India by providing
                  access to wholesale pricing, AI-powered insights, and a
                  supportive community that helps them reduce costs and grow
                  their businesses.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Lightbulb className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Our Vision</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  A future where every street food vendor has access to fair
                  pricing, quality ingredients, and the tools they need to build
                  sustainable, profitable businesses.
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Our Values
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Community First</h3>
                  <p className="text-sm text-muted-foreground">
                    We believe in the power of community and collective action
                    to create positive change.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Technology for Good</h3>
                  <p className="text-sm text-muted-foreground">
                    We use AI and technology to solve real problems and create
                    meaningful impact.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Transparency</h3>
                  <p className="text-sm text-muted-foreground">
                    We believe in fair, transparent pricing and honest
                    communication with our users.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="bg-muted/30 rounded-lg p-8 mb-8">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Users className="h-5 w-5" />
              Hackathon Project
            </h3>
            <p className="text-muted-foreground mb-4">
              Saathi is a demonstration project created for a hackathon,
              showcasing how modern technology can address real-world challenges
              in traditional industries.
            </p>
            <p className="text-muted-foreground">
              While this is a prototype, it represents our vision for how AI,
              group buying, and community can work together to create positive
              economic impact for small business owners.
            </p>
          </div>

          <div className="text-center">
            <Button asChild size="lg">
              <Link href="/contact">Get in Touch</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
