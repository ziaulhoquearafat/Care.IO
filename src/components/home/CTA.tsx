import * as React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTA() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 w-full select-none">
      <div className="relative overflow-hidden bg-gradient-to-r from-primary via-primary to-emerald-500 text-primary-foreground border border-foreground/10 px-8 py-12 sm:p-16 flex flex-col items-center text-center gap-6 rounded-none shadow-lg">
        
        {/* Glow vector effect */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent select-none pointer-events-none" />

        {/* Dynamic accent icon */}
        <div className="size-9 rounded-full bg-white/10 flex items-center justify-center border border-white/20 shadow-inner animate-pulse">
          <Sparkles className="size-4.5 text-primary-foreground" />
        </div>

        {/* Content */}
        <div className="flex flex-col gap-2 max-w-xl relative z-10">
          <h2 className="font-heading text-xl sm:text-2xl font-black tracking-tight leading-tight">
            Ready to give your loved ones the care they deserve?
          </h2>
          <p className="text-xs text-primary-foreground/80 leading-relaxed">
            Connect with certified care professionals, dedicated elderly companions, and specialized nurses immediately. Submission takes less than 2 minutes.
          </p>
        </div>

        {/* Inverse Button action */}
        <Link href="/service" className="relative z-10">
          <Button 
            className="h-11 px-8 gap-2 text-xs font-bold bg-background text-primary hover:bg-muted active:scale-95 transition-all cursor-pointer rounded-none border border-foreground/10"
          >
            Book an Appointment
            <ArrowRight className="size-4" />
          </Button>
        </Link>

      </div>
    </section>
  );
}

export default CTA;
