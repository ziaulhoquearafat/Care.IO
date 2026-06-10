"use client";

import { Button } from "@/components/ui/button";
import { motion, Variants } from "framer-motion";
import { Compass, Home, Search, Sparkles } from "lucide-react";
import Link from "next/link";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 25 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1], // easeOutExpo
    },
  },
};

export default function NotFound() {
  return (
    <div className="flex-grow w-full flex flex-col items-center justify-center min-h-[75vh] bg-background py-16 md:py-24 px-6 select-none relative overflow-hidden">

      {/* Background soft glowing circles */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-primary/5 rounded-full blur-[80px] pointer-events-none animate-pulse" />

      {/* Main glassmorphic card */}
      <motion.div
        className="max-w-md w-full border border-foreground/10 bg-card/60 backdrop-blur-md p-8 text-center flex flex-col items-center gap-6 relative shadow-lg shadow-black/5 rounded-none"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* Top visual glow bar */}
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-primary/30 via-primary to-primary/30" />

        {/* Slow Rotating Icon */}
        <motion.div
          className="size-16 rounded-none bg-primary/10 border border-primary/20 flex items-center justify-center text-primary relative"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
        >
          <Compass className="size-8 text-primary" />
          <div className="absolute -top-1 -right-1">
            <Sparkles className="size-3.5 text-primary animate-pulse" />
          </div>
        </motion.div>

        {/* Big 404 Text */}
        <motion.div
          className="flex flex-col items-center gap-1.5"
          variants={itemVariants}
        >
          <h1 className="font-heading text-6xl font-black text-primary tracking-tighter drop-shadow-sm leading-none">
            404
          </h1>
          <span className="text-[10px] uppercase font-bold text-muted-foreground/80 tracking-widest border-t border-foreground/10 pt-1.5 px-3 mt-1.5">
            Path Unavailable
          </span>
        </motion.div>

        {/* Explanatory Message */}
        <motion.div className="flex flex-col gap-2" variants={itemVariants}>
          <h2 className="font-heading text-xs font-bold uppercase tracking-wider text-foreground">
            Care Network Node Unresolved
          </h2>
          <p className="text-[11px] text-muted-foreground leading-relaxed max-w-xs mx-auto">
            The page you requested could not be resolved. It might have been
            relocated, renamed, or your temporary session has expired.
          </p>
        </motion.div>

        {/* Action Button Links */}
        <motion.div
          className="flex flex-col sm:flex-row gap-3 w-full border-t border-foreground/10 pt-6 mt-2"
          variants={itemVariants}
        >
          <Link href="/" className="flex-1">
            <Button className="w-full h-10 text-[10px] uppercase font-bold rounded-none cursor-pointer gap-2 transition-transform hover:scale-[1.02] active:scale-95 shadow-sm text-xs">
              <Home className="size-3.5" />
              <span>Return Home</span>
            </Button>
          </Link>
          <Link href="/service" className="flex-1">
            <Button
              variant="outline"
              className="w-full h-10 text-[10px] uppercase font-bold rounded-none cursor-pointer gap-2 border-foreground/10 hover:bg-muted/50 transition-transform hover:scale-[1.02] active:scale-95 text-xs"
            >
              <Search className="size-3.5" />
              <span>Browse Catalog</span>
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
