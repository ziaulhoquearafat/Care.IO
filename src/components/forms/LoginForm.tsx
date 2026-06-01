"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IApiResponse } from "@/types";

export function LoginForm() {
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
        }, 1200);
      } else {
        setErrorMsg(result.message || "Invalid credentials.");
      }
    } catch (err) {
      console.error("Login component error:", err);
      setErrorMsg("A system error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 animate-in fade-in duration-300">
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
            className="w-full font-sans"
          />
        </div>

        {/* Password field */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="password" className="text-xs font-semibold">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full font-sans"
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={submitting}
          className="mt-2 h-11 w-full font-bold rounded-none cursor-pointer transition-transform hover:scale-[1.02] active:scale-95 text-xs"
        >
          {submitting ? "Processing..." : "Sign In"}
        </Button>
      </form>
    </div>
  );
}

export default LoginForm;
