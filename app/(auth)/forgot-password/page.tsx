"use client";

import { useState } from "react";
import Link from "next/link";
import { resetPassword } from "@/firebase/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SaathiLogo } from "@/components/SaathiLogo";
import { MailCheck } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      await resetPassword(email);
      setMessage(
        "If an account with that email exists, a password reset link has been sent."
      );
    } catch (err: any) {
      setError("Failed to send reset email. Please try again.");
      console.error("Password reset failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between p-6">
      <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full space-y-8">
        <SaathiLogo size="sm" className="animate-fade-in" />
        <h1 className="text-3xl font-bold text-center">Reset Your Password</h1>

        {message ? (
          <div className="space-y-6 text-center bg-card border border-border p-6 rounded-lg animate-fade-in">
            <MailCheck className="h-12 w-12 text-green-500 mx-auto" />
            <h2 className="text-xl font-semibold">Check your inbox!</h2>
            <p className="text-muted-foreground text-sm">{message}</p>
            <Button asChild className="w-full" size="lg">
              <Link href="/login">Back to Login</Link>
            </Button>
          </div>
        ) : (
          <form
            onSubmit={handlePasswordReset}
            className="space-y-6 animate-fade-in"
          >
            <p className="text-center text-sm text-muted-foreground">
              No problem! Enter your email address and we'll send you a link to
              get back into your account.
            </p>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your registered email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 rounded-lg"
                required
              />
            </div>

            {error && (
              <p className="text-sm text-center text-destructive">{error}</p>
            )}

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={loading}
            >
              {loading ? "Sending Link..." : "Send Reset Link"}
            </Button>

            <div className="text-center">
              <span className="text-muted-foreground">
                Remembered your password?{" "}
              </span>
              <Link
                href="/login"
                className="text-primary font-medium hover:underline"
              >
                Login
              </Link>
            </div>
          </form>
        )}
      </div>

      <div className="bg-card rounded-lg p-4 border border-border animate-fade-in">
        <div className="flex items-start gap-3">
          <div className="text-primary text-2xl leading-none">"</div>
          <div>
            <p className="text-sm text-muted-foreground italic">
              Accessing my account is always simple and secure with Saathi.
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              - A Happy Vendor
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
