import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SaathiLogo } from "@/components/SaathiLogo";
import {
  ArrowLeft,
  BrainCircuit,
  MessageSquare,
  TrendingUp,
  Lightbulb,
} from "lucide-react";

export default function AIAssistantPage() {
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
          <h1 className="text-4xl font-bold mb-6">AI Assistant</h1>
          <p className="text-xl text-muted-foreground mb-12">
            Meet Saathi AI - your intelligent companion for making smarter
            purchasing decisions and optimizing your street food business.
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <BrainCircuit className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Smart Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Get personalized deal recommendations based on your purchase
                  history and business needs.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Analyze deal profitability</li>
                  <li>• Suggest optimal quantities</li>
                  <li>• Predict market trends</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>24/7 Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Ask questions about deals, get business advice, and receive
                  instant support anytime.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Deal analysis and insights</li>
                  <li>• Business optimization tips</li>
                  <li>• Real-time market updates</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                What Saathi AI Can Help With
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    Deal Analysis
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Evaluate deal profitability and compare with market averages
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Business Insights</h3>
                  <p className="text-sm text-muted-foreground">
                    Get recommendations on inventory management and cost
                    optimization
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Market Intelligence</h3>
                  <p className="text-sm text-muted-foreground">
                    Stay updated on price trends and seasonal variations
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <Button asChild size="lg">
              <Link href="/assistant">Try AI Assistant</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
