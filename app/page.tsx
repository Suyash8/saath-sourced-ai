"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

import { SaathiLogo } from "@/components/SaathiLogo";
import { useAuth } from "@/components/AuthProvider";
import { ThemeToggler } from "@/components/ThemeToggler";
import { FeatureCard } from "@/components/FeatureCard";
import { HowItWorksStep } from "@/components/HowItWorksStep";
import { StatCard } from "@/components/StatCard";
import { BenefitItem } from "@/components/BenefitItem";
import {
  features,
  howItWorksSteps,
  statistics,
  benefits,
} from "@/data/homepage";
import { ArrowRight } from "lucide-react";

export default function Home() {
  const { user, loading } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <SaathiLogo size="xs" />
          <div className="flex items-center gap-4">
            <ThemeToggler />
            {!loading &&
              (user ? (
                <Button asChild>
                  <Link href="/dashboard">Go to Dashboard</Link>
                </Button>
              ) : (
                <>
                  <Button variant="ghost" asChild>
                    <Link href="/login">Sign In</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/signup">Get Started</Link>
                  </Button>
                </>
              ))}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent animate-in fade-in-0 slide-in-from-bottom-6 duration-700">
            Bulk Buying Made Simple for Street Food Vendors
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-200">
            Join group purchases, get wholesale prices, and grow your street
            food business with Saathi - your trusted supply chain partner.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-400">
            {!loading &&
              (user ? (
                <Button
                  size="lg"
                  asChild
                  className="transition-all duration-300 hover:scale-105 hover:shadow-lg group"
                >
                  <Link href="/dashboard">
                    Go to Dashboard{" "}
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                </Button>
              ) : (
                <>
                  <Button
                    size="lg"
                    asChild
                    className="transition-all duration-300 hover:scale-105 hover:shadow-lg group"
                  >
                    <Link href="/signup">
                      Start Saving Today{" "}
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    asChild
                    className="transition-all duration-300 hover:scale-105"
                  >
                    <Link href="/login">Sign In</Link>
                  </Button>
                </>
              ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16 animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why Choose Saathi?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Built specifically for Indian street food vendors to reduce costs
            and increase profits
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={200 + index * 200}
            />
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground">
              Simple steps to start saving
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {howItWorksSteps.map((step, index) => (
              <HowItWorksStep
                key={step.title}
                step={index + 1}
                title={step.title}
                description={step.description}
                delay={200 + index * 200}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Built for Indian Street Food Vendors
            </h2>
            <div className="space-y-4">
              {benefits.map((benefit) => (
                <BenefitItem
                  key={benefit.title}
                  title={benefit.title}
                  description={benefit.description}
                />
              ))}
            </div>
          </div>
          <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-8 animate-in fade-in-0 slide-in-from-right-6 duration-700 delay-400 hover:shadow-lg transition-shadow duration-300">
            <div className="grid grid-cols-2 gap-6">
              {statistics.map((stat) => (
                <StatCard
                  key={stat.label}
                  value={stat.value}
                  label={stat.label}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
            Ready to Start Saving?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-200">
            Join thousands of street food vendors who are already reducing costs
            and growing their business with Saathi.
          </p>
          <Button
            size="lg"
            variant="secondary"
            asChild
            className="transition-all duration-300 hover:scale-105 hover:shadow-lg group animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-400"
          >
            <Link href="/signup">
              Get Started Free{" "}
              <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <SaathiLogo size="sm" />
              <p className="text-sm text-muted-foreground mt-4">
                Empowering street food vendors across India with smart bulk
                buying solutions.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <div className="space-y-2 text-sm">
                <Link
                  href="/group-buying"
                  className="block text-muted-foreground hover:text-foreground"
                >
                  Group Buying
                </Link>
                <Link
                  href="/ai-assistant"
                  className="block text-muted-foreground hover:text-foreground"
                >
                  AI Assistant
                </Link>
                <Link
                  href="/hub-network"
                  className="block text-muted-foreground hover:text-foreground"
                >
                  Hub Network
                </Link>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <div className="space-y-2 text-sm">
                <Link
                  href="/help-center"
                  className="block text-muted-foreground hover:text-foreground"
                >
                  Help Center
                </Link>
                <Link
                  href="/contact"
                  className="block text-muted-foreground hover:text-foreground"
                >
                  Contact Us
                </Link>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <div className="space-y-2 text-sm">
                <Link
                  href="/about"
                  className="block text-muted-foreground hover:text-foreground"
                >
                  About Us
                </Link>
                <Link
                  href="/privacy"
                  className="block text-muted-foreground hover:text-foreground"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/terms"
                  className="block text-muted-foreground hover:text-foreground"
                >
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 Saathi. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
