"use client";

import * as React from "react";
import { ShieldCheck, Tag, Eye, Heart } from "lucide-react";
import { Card } from "@/components/ui/card";
import { motion, Variants } from "framer-motion";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

export function WhyUs() {
  return (
    <section className="bg-muted/30 border-y border-foreground/10 py-16 px-4">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full flex flex-col gap-12">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center gap-2">
          <h2 className="font-heading text-2xl font-extrabold text-foreground tracking-tight sm:text-3xl">
            Why Choose Care.IO?
          </h2>
          <p className="text-xs text-muted-foreground max-w-md leading-relaxed">
            We provide verified, compassionate, and highly professional care solutions customized for your household.
          </p>
        </div>

        {/* 2x2 Responsive Grid with Stagger Entrance */}
        <motion.div 
          className="grid grid-cols-1 gap-6 sm:grid-cols-2"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
        >
          
          {/* Card 1: Background Checked Staff */}
          <motion.div variants={itemVariants} className="h-full">
            <Card className="rounded-none border-foreground/10 bg-card/60 backdrop-blur-sm p-6 text-left flex gap-4 hover:-translate-y-1 hover:shadow-md hover:border-primary/20 hover:bg-card/85 transition-all duration-300 h-full">
              <div className="size-9 rounded-none bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                <ShieldCheck className="size-4.5 text-primary" />
              </div>
              <div className="flex flex-col gap-1.5">
                <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-foreground">
                  Background Checked Staff
                </h3>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  All caregivers undergo strict identity validation, criminal records checks, and comprehensive certifications auditing.
                </p>
              </div>
            </Card>
          </motion.div>

          {/* Card 2: Affordable Pricing */}
          <motion.div variants={itemVariants} className="h-full">
            <Card className="rounded-none border-foreground/10 bg-card/60 backdrop-blur-sm p-6 text-left flex gap-4 hover:-translate-y-1 hover:shadow-md hover:border-primary/20 hover:bg-card/85 transition-all duration-300 h-full">
              <div className="size-9 rounded-none bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                <Tag className="size-4.5 text-primary" />
              </div>
              <div className="flex flex-col gap-1.5">
                <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-foreground">
                  Affordable Pricing
                </h3>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  No hidden setup charges. Enjoy completely transparent hourly or daily pricing packages suited to your family constraints.
                </p>
              </div>
            </Card>
          </motion.div>

          {/* Card 3: Real-time Monitoring */}
          <motion.div variants={itemVariants} className="h-full">
            <Card className="rounded-none border-foreground/10 bg-card/60 backdrop-blur-sm p-6 text-left flex gap-4 hover:-translate-y-1 hover:shadow-md hover:border-primary/20 hover:bg-card/85 transition-all duration-300 h-full">
              <div className="size-9 rounded-none bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                <Eye className="size-4.5 text-primary" />
              </div>
              <div className="flex flex-col gap-1.5">
                <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-foreground">
                  Real-time Monitoring
                </h3>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Stay updated with our online status ledgers, automated schedule logging, and direct administrator support panels.
                </p>
              </div>
            </Card>
          </motion.div>

          {/* Card 4: Compassionate Care */}
          <motion.div variants={itemVariants} className="h-full">
            <Card className="rounded-none border-foreground/10 bg-card/60 backdrop-blur-sm p-6 text-left flex gap-4 hover:-translate-y-1 hover:shadow-md hover:border-primary/20 hover:bg-card/85 transition-all duration-300 h-full">
              <div className="size-9 rounded-none bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                <Heart className="size-4.5 text-primary" />
              </div>
              <div className="flex flex-col gap-1.5">
                <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-foreground">
                  Compassionate Care
                </h3>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  We select and onboard professionals who showcase genuine empathy, patient-first caregiving values, and comforting hearts.
                </p>
              </div>
            </Card>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}

export default WhyUs;
