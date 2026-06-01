"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IApiResponse } from "@/types";

export function RegisterForm() {
  const router = useRouter();
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [contact, setContact] = React.useState("");
  const [nid, setNid] = React.useState("");
  const [password, setPassword] = React.useState("");

  const [submitting, setSubmitting] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    // Strict client-side password validation check
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
    if (!passwordRegex.test(password)) {
      setErrorMsg(
        "Password must be at least 6 characters long and contain both uppercase and lowercase letters."
      );
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, contact, nid, password }),
      });

      const result: IApiResponse = await response.json();

      if (result.success) {
        setSuccessMsg("Account registered successfully! Redirecting to login...");
        setTimeout(() => {
          router.push("/login");
        }, 1500);
      } else {
        setErrorMsg(result.message || "Registration failed.");
      }
    } catch (err) {
      console.error("Registration component error:", err);
      setErrorMsg("A system error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-5 animate-in fade-in duration-300">
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
        {/* Full Name */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="name" className="text-xs font-semibold">
            Full Name
          </Label>
          <Input
            id="name"
            type="text"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full font-sans"
          />
        </div>

        {/* Email Address */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email" className="text-xs font-semibold">
            Email Address
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="john@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full font-sans"
          />
        </div>

        {/* Contact and NID fields (Required by DB Schema) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="contact" className="text-xs font-semibold">
              Contact Number
            </Label>
            <Input
              id="contact"
              type="tel"
              placeholder="+880 17..."
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              required
              className="w-full font-sans"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="nid" className="text-xs font-semibold">
              NID Number
            </Label>
            <Input
              id="nid"
              type="text"
              placeholder="199923..."
              value={nid}
              onChange={(e) => setNid(e.target.value)}
              required
              className="w-full font-sans"
            />
          </div>
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="password" className="text-xs font-semibold">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="Min. 6 chars, 1 uppercase, 1 lowercase"
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
          {submitting ? "Processing..." : "Create Account"}
        </Button>
      </form>
    </div>
  );
}

export default RegisterForm;
