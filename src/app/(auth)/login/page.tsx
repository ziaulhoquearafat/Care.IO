"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IApiResponse } from "@/types";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email || !password) {
      setErrorMsg("Please enter both email and password.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const result: IApiResponse = await response.json();

      if (result.success) {
        setSuccessMsg("Logged in successfully! Redirecting...");
        setTimeout(() => {
          router.push("/");
          router.refresh();
        }, 1500);
      } else {
        setErrorMsg(result.message || "Invalid credentials.");
      }
    } catch (err) {
      console.error("Login client error:", err);
      setErrorMsg("A system error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2 bg-background select-none">
      
      {/* Left Column (Branding & Visuals) */}
      <div
        className="relative hidden lg:flex flex-col justify-between p-12 bg-cover bg-center text-white"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1000&q=80')`,
        }}
      >
        {/* Visual Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/60 to-neutral-950/80" />

        {/* Logo at Top Left */}
        <Link href="/" className="relative z-10 self-start flex items-center gap-2">
          <Heart className="size-5 text-primary fill-primary animate-pulse" />
          <span className="font-heading text-lg font-black tracking-tight text-white">
            Care.IO
          </span>
        </Link>

        {/* Captivating Message at Bottom */}
        <div className="relative z-10 flex flex-col gap-4 max-w-md">
          <div className="inline-flex items-center gap-1.5 self-start rounded-full bg-white/10 border border-white/20 px-3 py-1 text-[10px] font-bold tracking-wider uppercase">
            <Sparkles className="size-3.5 text-yellow-400" />
            <span>Premium Healthcare Services</span>
          </div>
          <h2 className="font-heading text-3xl font-black leading-tight text-white md:text-4xl">
            Compassionate Care, <br />
            Connected.
          </h2>
          <p className="text-xs text-neutral-300 leading-relaxed">
            Access certified caregiving professionals tailored to provide the finest physical
            and emotional support for your beloved family members, 24 hours a day.
          </p>
        </div>
      </div>

      {/* Right Column (Form Container) */}
      <div className="flex items-center justify-center p-8 lg:p-16">
        <div className="w-full max-w-md flex flex-col gap-8 animate-in fade-in duration-300">
          
          {/* Logo in Mobile View */}
          <Link href="/" className="flex lg:hidden items-center gap-2 self-start mb-2">
            <Heart className="size-5 text-primary fill-primary" />
            <span className="font-heading text-base font-black tracking-tight text-foreground">
              Care.IO
            </span>
          </Link>

          {/* Header */}
          <div className="flex flex-col gap-2">
            <h1 className="font-heading text-2xl font-black text-foreground">
              Welcome Back
            </h1>
            <p className="text-xs text-muted-foreground">
              Sign in to manage bookings, track appointments, and secure care.
            </p>
          </div>

          {/* Alert messages */}
          {errorMsg && (
            <div className="rounded-none border border-destructive/20 bg-destructive/5 px-4 py-3 text-xs text-destructive">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="rounded-none border border-emerald-500/20 bg-emerald-500/5 px-4 py-3 text-xs text-emerald-600">
              {successMsg}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            
            {/* Email field */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email" className="text-xs font-semibold">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full"
              />
            </div>

            {/* Password field */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs font-semibold">
                  Password
                </Label>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full"
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={submitting}
              className="mt-2 h-11 w-full font-bold rounded-none cursor-pointer transition-transform hover:scale-[1.02] active:scale-95 text-xs"
            >
              {submitting ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          {/* Direct link to Register */}
          <div className="text-center text-xs text-muted-foreground border-t border-foreground/10 pt-6">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-semibold text-primary hover:underline">
              Sign up
            </Link>
          </div>

        </div>
      </div>

    </div>
  );
}
