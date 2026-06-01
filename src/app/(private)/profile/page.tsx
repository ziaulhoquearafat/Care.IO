"use client";

import * as React from "react";
import {
  UserCheck,
  Mail,
  PhoneCall,
  IdCard,
  Calendar,
  ShieldCheck,
  Save,
  Loader2,
  User,
  Clock,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Swal from "sweetalert2";

interface UserData {
  _id: string;
  name: string;
  email: string;
  contact: string;
  nid: string;
  role: string;
  createdAt: string;
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = React.useState<"overview" | "settings">("overview");
  const [loading, setLoading] = React.useState(true);
  const [updating, setUpdating] = React.useState(false);
  const [user, setUser] = React.useState<UserData | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  // Form states
  const [name, setName] = React.useState("");
  const [contact, setContact] = React.useState("");

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/users/profile");
      const data = await res.json();
      if (data.success) {
        setUser(data.data);
        setName(data.data.name);
        setContact(data.data.contact);
      } else {
        setError(data.message || "Failed to load profile.");
      }
    } catch (err) {
      console.error("Profile page load error:", err);
      setError("An error occurred while loading your profile.");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !contact.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Validation Error",
        text: "Name and contact number cannot be empty.",
        confirmButtonColor: "var(--primary)"
      });
      return;
    }

    setUpdating(true);
    try {
      const res = await fetch("/api/users/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, contact })
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.data);
        Swal.fire({
          icon: "success",
          title: "Profile Updated",
          text: "Your profile details have been saved successfully.",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true
        });
        // Dispatch custom event to notify Navbar avatar initials to refresh
        window.dispatchEvent(new Event("profile-updated"));
      } else {
        Swal.fire({
          icon: "error",
          title: "Update Failed",
          text: data.message || "Could not update profile.",
          confirmButtonColor: "var(--primary)"
        });
      }
    } catch (err) {
      console.error("Update profile page error:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred while updating profile settings.",
        confirmButtonColor: "var(--primary)"
      });
    } finally {
      setUpdating(false);
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .trim()
      .split(/\s+/)
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  if (loading) {
    return (
      <div className="flex-grow flex flex-col w-full bg-background select-none min-h-screen">
        <section className="w-full bg-gradient-to-r from-primary/10 via-primary/5 to-background border-b border-foreground/10 py-16 px-4">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center gap-3 animate-pulse">
            <div className="h-8 w-64 bg-foreground/10 rounded-none" />
            <div className="h-4 w-96 bg-foreground/10 rounded-none" />
          </div>
        </section>
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 w-full flex-grow flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="size-8 text-primary animate-spin" />
            <span className="text-xs font-semibold text-muted-foreground/80">Loading secure profile data...</span>
          </div>
        </section>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex-grow flex flex-col w-full bg-background select-none min-h-screen">
        <section className="w-full bg-gradient-to-r from-primary/10 via-primary/5 to-background border-b border-foreground/10 py-16 px-4">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center gap-3">
            <h1 className="font-heading text-3xl font-black text-foreground tracking-tight">Profile Access Error</h1>
          </div>
        </section>
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 w-full flex-grow flex flex-col items-center justify-center text-center gap-4">
          <div className="size-12 rounded-none bg-red-500/10 border border-red-500/20 flex items-center justify-center">
            <ShieldCheck className="size-6 text-red-500" />
          </div>
          <div className="flex flex-col gap-2 max-w-md">
            <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">Authentication Required</h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {error || "We could not retrieve your user profile. Please check your connection and sign in again."}
            </p>
          </div>
          <Button onClick={() => window.location.reload()} className="h-9 px-6 text-xs font-bold rounded-none cursor-pointer">
            Retry Session
          </Button>
        </section>
      </div>
    );
  }

  const initials = getInitials(user.name);

  return (
    <div className="flex-grow flex flex-col w-full bg-background select-none min-h-screen">
      
      {/* Page Header */}
      <section className="w-full bg-gradient-to-r from-primary/10 via-primary/5 to-background border-b border-foreground/10 py-16 px-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center gap-3 animate-in fade-in slide-in-from-top-4 duration-500">
          <h1 className="font-heading text-3xl font-black text-foreground sm:text-4xl tracking-tight">
            User Profile Dashboard
          </h1>
          <p className="text-xs text-muted-foreground max-w-lg leading-relaxed">
            Manage your personal profile, review security and registration details, and configure contact configurations immediately.
          </p>
        </div>
      </section>

      {/* Profile Core Sections */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 w-full flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Summary Identity Card */}
          <div className="lg:col-span-4 flex flex-col gap-6 animate-in fade-in slide-in-from-left-4 duration-500">
            <Card className="rounded-none border-foreground/10 bg-card/60 backdrop-blur-sm flex flex-col items-center py-10 px-6 text-center gap-4 hover:shadow-md transition-all">
              <div className="relative flex items-center justify-center size-20 rounded-full bg-primary/10 border border-primary/20 shadow-inner group">
                <span className="text-2xl font-black text-primary tracking-wider transition-transform group-hover:scale-105">
                  {initials}
                </span>
                <div className="absolute -bottom-1 -right-1 size-6 rounded-full bg-primary flex items-center justify-center border-2 border-background">
                  <Sparkles className="size-3 text-primary-foreground animate-pulse" />
                </div>
              </div>

              <div className="flex flex-col gap-1 w-full">
                <h2 className="font-heading text-base font-bold text-foreground line-clamp-1">
                  {user.name}
                </h2>
                <span className="text-xs text-muted-foreground line-clamp-1">
                  {user.email}
                </span>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[9px] font-bold uppercase tracking-wider text-primary">
                {user.role} Member
              </div>
            </Card>
          </div>

          {/* Right Detailed Tabbed Board */}
          <div className="lg:col-span-8 flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <Card className="rounded-none border-foreground/10 bg-card/60 backdrop-blur-sm min-h-[380px] flex flex-col hover:shadow-md transition-all">
              
              {/* Tab Selector Header */}
              <div className="flex border-b border-foreground/10 px-6 pt-4 gap-6 bg-muted/20">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`pb-3 text-[10px] font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                    activeTab === "overview"
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab("settings")}
                  className={`pb-3 text-[10px] font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                    activeTab === "settings"
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Settings
                </button>
              </div>

              {/* Tab Content Body */}
              <CardContent className="p-6 flex-grow flex flex-col justify-center">
                
                {/* 1. Overview Tab content */}
                {activeTab === "overview" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-in fade-in duration-200">
                    
                    {/* Item 1: Name */}
                    <div className="flex items-start gap-3.5 p-4 border border-foreground/5 bg-muted/10">
                      <div className="size-8 rounded-none bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0">
                        <UserCheck className="size-4 text-primary" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[9px] uppercase font-extrabold tracking-wider text-muted-foreground/80">Full Name</span>
                        <span className="text-xs font-semibold text-foreground leading-relaxed mt-0.5">{user.name}</span>
                      </div>
                    </div>

                    {/* Item 2: Email */}
                    <div className="flex items-start gap-3.5 p-4 border border-foreground/5 bg-muted/10">
                      <div className="size-8 rounded-none bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0">
                        <Mail className="size-4 text-primary" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[9px] uppercase font-extrabold tracking-wider text-muted-foreground/80">Email Address</span>
                        <span className="text-xs font-semibold text-foreground leading-relaxed mt-0.5 break-all">{user.email}</span>
                      </div>
                    </div>

                    {/* Item 3: Contact */}
                    <div className="flex items-start gap-3.5 p-4 border border-foreground/5 bg-muted/10">
                      <div className="size-8 rounded-none bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0">
                        <PhoneCall className="size-4 text-primary" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[9px] uppercase font-extrabold tracking-wider text-muted-foreground/80">Contact Number</span>
                        <span className="text-xs font-semibold text-foreground leading-relaxed mt-0.5">{user.contact}</span>
                      </div>
                    </div>

                    {/* Item 4: NID */}
                    <div className="flex items-start gap-3.5 p-4 border border-foreground/5 bg-muted/10">
                      <div className="size-8 rounded-none bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0">
                        <IdCard className="size-4 text-primary" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[9px] uppercase font-extrabold tracking-wider text-muted-foreground/80">National ID</span>
                        <span className="text-xs font-semibold text-foreground leading-relaxed mt-0.5">{user.nid}</span>
                      </div>
                    </div>

                    {/* Item 5: Membership Type */}
                    <div className="flex items-start gap-3.5 p-4 border border-foreground/5 bg-muted/10">
                      <div className="size-8 rounded-none bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0">
                        <ShieldCheck className="size-4 text-primary" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[9px] uppercase font-extrabold tracking-wider text-muted-foreground/80">Membership Tier</span>
                        <span className="text-xs font-semibold text-foreground leading-relaxed mt-0.5">
                          {user.role === "admin" ? "Care Administrator" : "Verified Premium Partner"}
                        </span>
                      </div>
                    </div>

                    {/* Item 6: Member Since */}
                    <div className="flex items-start gap-3.5 p-4 border border-foreground/5 bg-muted/10">
                      <div className="size-8 rounded-none bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0">
                        <Clock className="size-4 text-primary" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[9px] uppercase font-extrabold tracking-wider text-muted-foreground/80">Member Since</span>
                        <span className="text-xs font-semibold text-foreground leading-relaxed mt-0.5">{formatDate(user.createdAt)}</span>
                      </div>
                    </div>

                  </div>
                )}

                {/* 2. Settings Tab content */}
                {activeTab === "settings" && (
                  <form onSubmit={handleUpdate} className="flex flex-col gap-5 animate-in fade-in duration-200 text-left">
                    
                    {/* Name Input */}
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="profile-name" className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                        Full Name
                      </Label>
                      <Input
                        id="profile-name"
                        type="text"
                        placeholder="Enter full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="rounded-none border-foreground/10 focus:border-primary/40 focus:ring-primary/20 text-xs h-10 transition-colors"
                        required
                      />
                    </div>

                    {/* Contact Input */}
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="profile-contact" className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                        Contact Number
                      </Label>
                      <Input
                        id="profile-contact"
                        type="text"
                        placeholder="Enter contact number"
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                        className="rounded-none border-foreground/10 focus:border-primary/40 focus:ring-primary/20 text-xs h-10 transition-colors"
                        required
                      />
                    </div>

                    {/* Save Button */}
                    <Button
                      type="submit"
                      disabled={updating}
                      className="h-10 px-5 gap-2 text-xs font-bold rounded-none cursor-pointer self-start transition-transform hover:scale-[1.02] active:scale-95 mt-2"
                    >
                      {updating ? (
                        <>
                          <Loader2 className="size-3.5 animate-spin" />
                          <span>Saving Changes...</span>
                        </>
                      ) : (
                        <>
                          <Save className="size-3.5" />
                          <span>Save Settings</span>
                        </>
                      )}
                    </Button>
                  </form>
                )}

              </CardContent>

            </Card>
          </div>

        </div>
      </section>

    </div>
  );
}
