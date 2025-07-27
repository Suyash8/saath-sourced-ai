import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SaathiLogo } from "@/components/SaathiLogo";
import {
  ArrowLeft,
  HelpCircle,
  MessageSquare,
  Book,
  Phone,
} from "lucide-react";

export default function HelpCenterPage() {
  const faqs = [
    {
      question: "How does group buying work?",
      answer:
        "Group buying allows multiple vendors to combine their orders to reach minimum quantities for wholesale pricing. You browse available deals, commit to your required quantity, and once the group reaches the minimum order, everyone gets wholesale prices.",
    },
    {
      question: "How do I join a group buy?",
      answer:
        "Simply browse the available deals on your dashboard, select the product you need, specify your quantity, and join the group. You'll be notified when the group reaches its target.",
    },
    {
      question: "Where do I pick up my orders?",
      answer:
        "Orders are available for pickup at our network of hub locations. You'll receive notifications with the exact pickup location, timing, and instructions when your order is ready.",
    },
    {
      question: "What payment methods are accepted?",
      answer:
        "We accept various payment methods including UPI, credit/debit cards, and net banking. Payment is processed securely through our platform.",
    },
    {
      question: "Can I cancel my order?",
      answer:
        "Orders can be cancelled before the group buying period ends. Once the group buy is confirmed and processing begins, cancellations may not be possible.",
    },
  ];

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
          <h1 className="text-4xl font-bold mb-6">Help Center</h1>
          <p className="text-xl text-muted-foreground mb-12">
            Find answers to common questions and get the support you need to
            make the most of Saathi.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Book className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Getting Started</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Learn the basics of using Saathi for group buying and managing
                  your orders.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>AI Assistant</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Get instant help from our AI assistant for deal analysis and
                  business insights.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Contact Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Need personalized help? Reach out to our support team for
                  assistance.
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                Frequently Asked Questions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="border-b border-border pb-4 last:border-b-0"
                  >
                    <h3 className="font-semibold mb-2">{faq.question}</h3>
                    <p className="text-muted-foreground text-sm">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <p className="text-muted-foreground mb-4">Still need help?</p>
            <Button asChild size="lg">
              <Link href="/contact">Contact Support</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
