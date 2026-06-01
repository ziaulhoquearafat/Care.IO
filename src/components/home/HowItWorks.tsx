import * as React from "react";
import { Search, Calendar, UserCheck } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function HowItWorks() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 w-full">
      {/* Section Header */}
      <div className="flex flex-col items-center text-center gap-2 mb-12">
        <h2 className="font-heading text-2xl font-extrabold text-foreground sm:text-3xl tracking-tight">
          How to Get Started
        </h2>
        <p className="text-xs text-muted-foreground max-w-md leading-relaxed">
          Schedule professional, compassionate care for your family in three incredibly simple steps.
        </p>
      </div>

      {/* Steps Grid */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        
        {/* Step 1 */}
        <Card className="rounded-none border-foreground/10 bg-card/60 backdrop-blur-sm relative hover:border-primary/20 transition-all flex flex-col justify-between p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="size-10 rounded-none bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Search className="size-5 text-primary" />
            </div>
            <span className="text-3xl font-black text-foreground/5 select-none leading-none">01</span>
          </div>
          <div className="text-left flex flex-col gap-1.5">
            <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-foreground">
              Choose a Service
            </h3>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Explore our certified platforms catalog, including childcare, specialized nurse assistance, and senior companionship.
            </p>
          </div>
        </Card>

        {/* Step 2 */}
        <Card className="rounded-none border-foreground/10 bg-card/60 backdrop-blur-sm relative hover:border-primary/20 transition-all flex flex-col justify-between p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="size-10 rounded-none bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Calendar className="size-5 text-primary" />
            </div>
            <span className="text-3xl font-black text-foreground/5 select-none leading-none">02</span>
          </div>
          <div className="text-left flex flex-col gap-1.5">
            <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-foreground">
              Set Location & Schedule
            </h3>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Input your division, district, city details, select your dates, and proceed with our Stripe Payment gateway.
            </p>
          </div>
        </Card>

        {/* Step 3 */}
        <Card className="rounded-none border-foreground/10 bg-card/60 backdrop-blur-sm relative hover:border-primary/20 transition-all flex flex-col justify-between p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="size-10 rounded-none bg-primary/10 border border-primary/20 flex items-center justify-center">
              <UserCheck className="size-5 text-primary" />
            </div>
            <span className="text-3xl font-black text-foreground/5 select-none leading-none">03</span>
          </div>
          <div className="text-left flex flex-col gap-1.5">
            <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-foreground">
              Caregiver Arrives
            </h3>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Our verified caregiver reaches your doorstep right on time, fully informed on your family’s safety parameters.
            </p>
          </div>
        </Card>

      </div>
    </section>
  );
}

export default HowItWorks;
