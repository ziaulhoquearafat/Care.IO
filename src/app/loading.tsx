"use client";

import * as React from "react";
import { Loader2, Sparkles } from "lucide-react";

export default function RootLoading() {
  return (
    <div className="flex-grow w-full flex flex-col items-center justify-center min-h-[70vh] bg-background select-none animate-in fade-in duration-300">
      
      {/* Premium Loader Panel */}
      <div className="flex flex-col items-center gap-5 border border-foreground/10 bg-card/60 backdrop-blur-sm p-8 max-w-sm w-full text-center shadow-lg shadow-black/5 relative overflow-hidden rounded-none">
        
        {/* Glow border overlay */}
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-primary/30 via-primary to-primary/30" />
        
        {/* Brand Icon & Spinner container */}
        <div className="relative flex items-center justify-center">
          <Loader2 className="size-10 text-primary animate-spin" />
          <div className="absolute">
            <Sparkles className="size-4.5 text-primary animate-pulse" />
          </div>
        </div>

        {/* Text descriptions */}
        <div className="flex flex-col gap-1.5">
          <h2 className="font-heading text-xs font-black uppercase tracking-wider text-foreground">
            Loading Care.IO
          </h2>
          <p className="text-[10px] text-muted-foreground max-w-xs leading-relaxed">
            Please wait while we establish database handshakes and retrieve safe care provider networks...
          </p>
        </div>

        {/* Progress slide indicator */}
        <div className="w-24 h-1 bg-muted relative overflow-hidden mt-1">
          <div className="absolute h-full w-10 bg-primary animate-progress rounded-full" />
        </div>

      </div>
      
    </div>
  );
}
