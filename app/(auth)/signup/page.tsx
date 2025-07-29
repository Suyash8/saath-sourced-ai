"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { updateProfile } from "firebase/auth";
import { signUpWithEmail } from "@/firebase/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SaathiLogo } from "@/components/SaathiLogo";
import { FirebaseError } from "firebase/app";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    try {
      const user = await signUpWithEmail(formData.email, formData.password);

      const displayName = `${formData.firstName} ${formData.lastName}`;
      await updateProfile(user, { displayName });

      // Create session first
      const idToken = await user.getIdToken();
      const sessionRes = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      if (!sessionRes.ok) {
        throw new Error("Failed to create session.");
      }

      // Now create the user document using the server-side API
      const userProfileRes = await fetch("/api/user/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: user.uid,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
        }),
      });

      if (!userProfileRes.ok) {
        console.error("Failed to create user profile on server");
        // Still proceed to onboarding as the user exists in Firebase Auth
      }

      router.push("/onboarding");
    } catch (err: unknown) {
      if (
        err instanceof FirebaseError &&
        err.code === "auth/email-already-in-use"
      ) {
        setError("This email address is already in use.");
      } else if (err instanceof Error) {
        setError(`Failed to create an account: ${err.message}`);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
      console.error("Signup failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between p-6">
      <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full space-y-8">
        <SaathiLogo size="sm" className="animate-fade-in rounded-full" />
        <h1 className="text-3xl font-bold text-center">
          Create your Saathi Account
        </h1>

        <form onSubmit={handleSignup} className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-sm font-medium">
                First Name
              </Label>
              <Input
                id="firstName"
                type="text"
                placeholder="First name"
                value={formData.firstName}
                onChange={handleChange("firstName")}
                className="h-12 rounded-lg"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-sm font-medium">
                Last Name
              </Label>
              <Input
                id="lastName"
                type="text"
                placeholder="Last name"
                value={formData.lastName}
                onChange={handleChange("lastName")}
                className="h-12 rounded-lg"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={handleChange("email")}
              className="h-12 rounded-lg"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Create a password (min. 6 characters)"
              value={formData.password}
              onChange={handleChange("password")}
              className="h-12 rounded-lg"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm font-medium">
              Confirm Password
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange("confirmPassword")}
              className="h-12 rounded-lg"
              required
            />
          </div>

          {error && (
            <p className="text-sm text-center text-destructive">{error}</p>
          )}

          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? "Creating Account..." : "Sign Up"}
          </Button>

          <div className="text-center">
            <span className="text-muted-foreground">
              Already have an account?{" "}
            </span>
            <Link
              href="/login"
              className="text-primary font-medium hover:underline"
            >
              Login
            </Link>
          </div>
        </form>
      </div>

      <div className="bg-card rounded-lg p-4 border border-border animate-fade-in">
        <div className="flex items-start gap-3">
          <div className="text-primary text-2xl leading-none">&quot;</div>
          <div>
            <p className="text-sm text-muted-foreground italic">
              Join thousands of vendors saving money with Saathi&apos;s
              community sourcing!
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              - Start saving today
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
