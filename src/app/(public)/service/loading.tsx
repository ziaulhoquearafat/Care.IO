import * as React from "react";
import { Card } from "@/components/ui/card";

export default function ServicesLoading() {
  return (
    <div className="flex-grow flex flex-col w-full bg-background select-none min-h-screen">
      
      {/* 1. Header Banner Skeleton */}
      <section className="w-full bg-gradient-to-r from-primary/10 via-primary/5 to-background border-b border-foreground/10 py-16 px-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center gap-4 animate-pulse">
          {/* Pulsing Title Bar */}
          <div className="h-8 w-64 sm:w-80 bg-foreground/10 rounded-none" />
          {/* Pulsing Description Double-line */}
          <div className="flex flex-col items-center gap-2">
            <div className="h-3.5 w-80 sm:w-[480px] bg-foreground/10 rounded-none" />
            <div className="h-3.5 w-64 sm:w-[320px] bg-foreground/10 rounded-none" />
          </div>
        </div>
      </section>

      {/* 2. Services Grid Section Skeleton */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 w-full animate-pulse">
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, idx) => (
            <Card 
              key={idx} 
              className="flex flex-col h-[380px] overflow-hidden border-foreground/10 bg-card/60 backdrop-blur-sm rounded-none p-0"
            >
              
              {/* Cover Image Placeholder */}
              <div className="relative w-full h-[200px] bg-foreground/5 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-foreground/5 to-transparent -translate-x-full animate-shimmer" />
              </div>

              {/* Card Header area */}
              <div className="flex-grow flex flex-col gap-3 pt-4 px-4 pb-0 text-left">
                {/* Category Pill */}
                <div className="h-4.5 w-20 bg-foreground/10 rounded-none" />
                {/* Title */}
                <div className="h-4 w-48 bg-foreground/10 rounded-none" />
                {/* Descriptive Double-line */}
                <div className="flex flex-col gap-1.5 mt-1">
                  <div className="h-3 w-full bg-foreground/5 rounded-none" />
                  <div className="h-3 w-[85%] bg-foreground/5 rounded-none" />
                </div>
              </div>

              {/* Card Footer area */}
              <div className="flex items-center justify-between border-t border-foreground/10 p-4 bg-muted/10">
                {/* Rate details */}
                <div className="flex flex-col gap-1 text-left">
                  <div className="h-2.5 w-16 bg-foreground/5 rounded-none" />
                  <div className="h-4 w-12 bg-foreground/10 rounded-none" />
                </div>
                {/* Button shape */}
                <div className="h-8 w-24 bg-foreground/10 rounded-none" />
              </div>

            </Card>
          ))}
        </div>

      </section>

    </div>
  );
}
