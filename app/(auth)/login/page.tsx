"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signInWithEmail } from "@/firebase/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SaathiLogo } from "@/components/SaathiLogo";
import { FirebaseError } from "firebase/app";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const user = await signInWithEmail(email, password);
      const idToken = await user.getIdToken();

      const res = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      if (!res.ok) {
        throw new Error("Failed to create session.");
      }

      router.push("/dashboard");
    } catch (err: unknown) {
      if (err instanceof FirebaseError) {
        switch (err.code) {
          case "auth/wrong-password":
          case "auth/invalid-credential":
            setError("Invalid email or password. Please try again.");
            break;
          case "auth/user-not-found":
            setError("No account found with that email. Please sign up.");
            break;
          default:
            setError("An unexpected error occurred. Please try again.");
            break;
        }
        console.error("Login failed:", err);
      } else {
        setError("An unexpected error occurred. Please try again.");
        console.error("Login failed:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between p-6">
      <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full space-y-8">
        <SaathiLogo size="sm" className="animate-fade-in" />
        <h1 className="text-3xl font-bold text-center">
          Welcome Back to Saathi
        </h1>

        <form onSubmit={handleLogin} className="space-y-6 animate-fade-in">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 rounded-lg"
              required
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <Link
                href="/forgot-password"
                className="text-sm font-medium text-primary hover:underline"
              >
                Forgot?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 rounded-lg"
              required
            />
          </div>

          {error && (
            <p className="text-sm text-center text-destructive">{error}</p>
          )}

          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>

          <div className="text-center">
            <span className="text-muted-foreground">
              Don&apos;t have an account?{" "}
            </span>
            <Link
              href="/signup"
              className="text-primary font-medium hover:underline"
            >
              Sign Up
            </Link>
          </div>
        </form>
      </div>

      <div className="bg-card rounded-lg p-4 border border-border animate-fade-in">
        <div className="flex items-start gap-3">
          <div className="text-primary text-2xl leading-none">&quot;</div>
          <div>
            <p className="text-sm text-muted-foreground italic">
              Saathi helped me save ₹2000 this month!
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              - Raju, Chaat Vendor
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
