import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ShieldCheck, Heart, Clock, Users, ArrowRight } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="flex flex-col w-full bg-background min-h-screen select-none">
      
      {/* 1. Top Hero Section (Split Screen Layout) */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Text Column */}
          <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-left-4 duration-500">
            <div className="inline-flex items-center gap-1.5 self-start rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">
              Our Vision & Mission
            </div>
            <h1 className="font-heading text-3xl font-extrabold text-foreground sm:text-4xl lg:text-5xl leading-tight">
              Committed to <br />
              <span className="text-primary bg-clip-text bg-gradient-to-r from-primary to-emerald-500">
                Compassionate Care
              </span>
            </h1>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-lg">
              At Care.IO, we believe that high-quality caregiving is not just a service—it is a commitment to dignity, respect, and wellness. Our platform connects certified healthcare providers, compassionate elderly companions, and specialized babysitters directly with families seeking safe and trustworthy care.
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-lg">
              Every caregiver in our circle goes through a strict background validation and qualification audit so that you can have absolute peace of mind while your loved ones receive professional assistance.
            </p>
          </div>

          {/* Right Image Column */}
          <div className="relative w-full h-[350px] sm:h-[400px] overflow-hidden shadow-lg border border-foreground/10 rounded-2xl animate-in fade-in slide-in-from-right-4 duration-500">
            <Image
              src="https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=800&q=80"
              alt="Caregivers caring for an elderly patient"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover transition-transform duration-500 hover:scale-105"
              priority
            />
          </div>

        </div>
      </section>

      {/* 2. Middle Section ("Why Choose Us") */}
      <section className="bg-muted/30 border-y border-foreground/10 py-16 px-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full flex flex-col gap-12">
          
          {/* Section Header */}
          <div className="flex flex-col items-center text-center gap-2">
            <h2 className="font-heading text-2xl font-extrabold text-foreground tracking-tight sm:text-3xl">
              Why Choose Care.IO
            </h2>
            <p className="text-xs text-muted-foreground max-w-md leading-relaxed">
              We stand apart through our strict quality benchmarks and a deep, empathetic focus on your family&apos;s peace of mind.
            </p>
          </div>

          {/* 4 Cards Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            
            {/* Card 1: Verified Professionals */}
            <Card className="rounded-none border-foreground/10 bg-card/60 backdrop-blur-sm flex flex-col justify-between hover:border-primary/25 hover:shadow-md transition-all">
              <CardHeader className="p-5 pb-0 flex flex-col gap-3">
                <div className="size-8 rounded-none bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <ShieldCheck className="size-4 text-primary" />
                </div>
                <CardTitle className="font-heading text-xs font-bold text-foreground uppercase tracking-wider">
                  Verified Professionals
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 pt-2 text-[11px] text-muted-foreground leading-relaxed">
                All listed caregivers are fully vetted with comprehensive background checks and certification audits.
              </CardContent>
            </Card>

            {/* Card 2: Empathetic Hearts */}
            <Card className="rounded-none border-foreground/10 bg-card/60 backdrop-blur-sm flex flex-col justify-between hover:border-primary/25 hover:shadow-md transition-all">
              <CardHeader className="p-5 pb-0 flex flex-col gap-3">
                <div className="size-8 rounded-none bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                  <Heart className="size-4 text-red-500 fill-red-500/10" />
                </div>
                <CardTitle className="font-heading text-xs font-bold text-foreground uppercase tracking-wider">
                  Empathetic Hearts
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 pt-2 text-[11px] text-muted-foreground leading-relaxed">
                We onboard caregivers who display exceptional empathy, patience, and a natural calling to comfort.
              </CardContent>
            </Card>

            {/* Card 3: 24/7 Availability */}
            <Card className="rounded-none border-foreground/10 bg-card/60 backdrop-blur-sm flex flex-col justify-between hover:border-primary/25 hover:shadow-md transition-all">
              <CardHeader className="p-5 pb-0 flex flex-col gap-3">
                <div className="size-8 rounded-none bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <Clock className="size-4 text-emerald-500" />
                </div>
                <CardTitle className="font-heading text-xs font-bold text-foreground uppercase tracking-wider">
                  24/7 Availability
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 pt-2 text-[11px] text-muted-foreground leading-relaxed">
                Whether you need emergency support, night shifts, or continuous nursing, we are active 24/7.
              </CardContent>
            </Card>

            {/* Card 4: Family First Focus */}
            <Card className="rounded-none border-foreground/10 bg-card/60 backdrop-blur-sm flex flex-col justify-between hover:border-primary/25 hover:shadow-md transition-all">
              <CardHeader className="p-5 pb-0 flex flex-col gap-3">
                <div className="size-8 rounded-none bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                  <Users className="size-4 text-amber-500" />
                </div>
                <CardTitle className="font-heading text-xs font-bold text-foreground uppercase tracking-wider">
                  Family First Focus
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 pt-2 text-[11px] text-muted-foreground leading-relaxed">
                We customize and adapt our service guidelines to respect your family dynamics and home environments.
              </CardContent>
            </Card>

          </div>
        </div>
      </section>

      {/* 3. Bottom Section (CTA Banner) */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 w-full">
        <div className="bg-primary/5 border border-primary/10 p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 rounded-none text-center md:text-left">
          <div className="flex flex-col gap-2 max-w-lg">
            <h3 className="font-heading text-lg font-black text-foreground">
              Find the right care for your loved ones today.
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Connect with vetted nurses, experienced sitters, and compassionate companions immediately. Scheduling takes less than 2 minutes.
            </p>
          </div>
          <Link href="/service">
            <Button className="h-11 px-6 gap-2 text-xs font-bold rounded-none cursor-pointer transition-transform hover:scale-[1.02] active:scale-95">
              Book a Service
              <ArrowRight className="size-4" />
            </Button>
          </Link>
        </div>
      </section>

    </div>
  );
}

export const metadata = {
  title: "About Us | Care.IO",
  description: "Learn about our vision, strict background checking, and commitment to compassionate caregiver support.",
};
