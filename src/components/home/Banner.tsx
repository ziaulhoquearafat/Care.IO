"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Heart } from "lucide-react";

export function Banner() {
  return (
    <section className="relative min-h-[80vh] w-full flex items-center justify-center overflow-hidden bg-background">
      {/* Background Image with subtle scaling effect */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-500 scale-105"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1600&q=80')`,
        }}
      />
      {/* Glassmorphism gradient overlay adapting automatically to Light/Dark themes */}
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/50 md:to-transparent transition-all" />

      {/* Hero Content Area */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-20 w-full sm:px-6 lg:px-8 flex flex-col items-start text-left gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        {/* Modern Accent Badge */}
        <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary transition-all">
          <Heart className="size-3.5 fill-primary text-primary animate-pulse" />
          <span>Trusted Caregiving Support 24/7</span>
        </div>

        {/* Large, Bold Responsive Heading */}
        <h1 className="font-heading text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl max-w-2xl leading-none">
          Compassionate Care, <br />
          <span className="text-primary bg-clip-text bg-gradient-to-r from-primary to-emerald-500">
            Right at Your Doorstep
          </span>
        </h1>

        {/* Soft, Readable Sub-heading */}
        <p className="text-base text-muted-foreground sm:text-lg max-w-xl leading-relaxed">
          Professional nurses, babysitters, and elderly companions ready to support your
          loved ones 24/7. Dedicated to bringing comfort, safety, and happiness.
        </p>

        {/* Call to Actions (stacked on mobile, inline on desktop) */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto mt-2">
          <Link href="/service" className="w-full sm:w-auto">
            <Button
              size="lg"
              className="w-full sm:w-auto h-11 px-6 gap-2 text-xs font-semibold rounded-none cursor-pointer transition-transform hover:scale-[1.02] active:scale-95"
            >
              Book a Service
              <ArrowRight className="size-4" />
            </Button>
          </Link>
          <Link href="/service" className="w-full sm:w-auto">
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto h-11 px-6 text-xs font-semibold rounded-none cursor-pointer transition-transform hover:scale-[1.02] active:scale-95"
            >
              Explore Services
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Banner;
