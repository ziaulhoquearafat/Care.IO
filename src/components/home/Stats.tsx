import * as React from "react";
import { Heart, ShieldCheck, Clock } from "lucide-react";

export function Stats() {
  return (
    <section className="w-full bg-primary/5 border-y border-foreground/10 py-10 px-4">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4">
          
          {/* Stat 1 */}
          <div className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-4 md:px-4">
            <div className="size-10 rounded-none bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
              <Heart className="size-5 text-red-500 fill-red-500/10" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="font-heading text-lg font-black text-foreground">500+</span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Happy Families</span>
            </div>
          </div>

          {/* Divider */}
          <div className="hidden md:block h-8 w-[1px] bg-foreground/10" />

          {/* Stat 2 */}
          <div className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-4 md:px-4">
            <div className="size-10 rounded-none bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
              <ShieldCheck className="size-5 text-primary" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="font-heading text-lg font-black text-foreground">50+</span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Certified Professionals</span>
            </div>
          </div>

          {/* Divider */}
          <div className="hidden md:block h-8 w-[1px] bg-foreground/10" />

          {/* Stat 3 */}
          <div className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-4 md:px-4">
            <div className="size-10 rounded-none bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
              <Clock className="size-5 text-emerald-500" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="font-heading text-lg font-black text-foreground">24/7</span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Premium Support</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default Stats;
