"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  initials: string;
  rating: number;
  review: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: "Sarah M.",
    role: "Daughter of Elderly Client",
    initials: "SM",
    rating: 5,
    review: "The nurse provided by Care.IO was outstanding. Her patience, medical knowledge, and gentle manner brought immense peace of mind to our family. We highly recommend their premium caregiver circle."
  },
  {
    id: 2,
    name: "David K.",
    role: "Father of Two (Baby Care)",
    initials: "DK",
    rating: 5,
    review: "Finding a trustworthy babysitter has always been stressful, but the vetting on Care.IO made it easy. Our sitter is punctual, energetic, and highly professional. We will definitely book again."
  },
  {
    id: 3,
    name: "Emily R.",
    role: "Family Nurse Partner",
    initials: "ER",
    rating: 5,
    review: "As a registered nurse, I value structured scheduling and patient dignity. The Care.IO booking layout enables us to coordinate directly with families and establish transparent safety guidelines immediately."
  },
  {
    id: 4,
    name: "James L.",
    role: "Sick Companion Client",
    initials: "JL",
    rating: 5,
    review: "After my surgery, I needed overnight support. The companion caregiver arrived exactly on time, set up my recovery environment, and helped me with daily tasks. An absolute lifesaver!"
  }
];

export function Testimonials() {
  const [activeIndex, setActiveIndex] = React.useState(0);

  // Auto-play interval configuration
  React.useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  const handleNext = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % TESTIMONIALS.length);
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 w-full flex flex-col gap-12 select-none">
      
      {/* Section Header */}
      <div className="flex flex-col items-center text-center gap-2">
        <h2 className="font-heading text-2xl font-extrabold text-foreground tracking-tight sm:text-3xl">
          What Our Families Say
        </h2>
        <p className="text-xs text-muted-foreground max-w-md leading-relaxed">
          Read genuine reviews from families who have experienced our professional caregiving network.
        </p>
      </div>

      {/* Carousel Framework */}
      <div className="relative w-full max-w-3xl mx-auto flex items-center gap-4">
        
        {/* Previous Button */}
        <button
          onClick={handlePrev}
          aria-label="Previous testimonial"
          className="hidden sm:flex size-9 border border-foreground/10 bg-card/40 hover:bg-muted/80 text-foreground items-center justify-center shrink-0 transition-colors cursor-pointer rounded-none"
        >
          <ChevronLeft className="size-5" />
        </button>

        {/* Testimonials Display Viewport */}
        <div className="flex-grow overflow-hidden relative">
          <div 
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
          >
            {TESTIMONIALS.map((t) => (
              <div key={t.id} className="w-full shrink-0 px-2 sm:px-4">
                <Card className="rounded-none border-foreground/10 bg-card/60 backdrop-blur-sm p-8 flex flex-col items-center text-center gap-5 relative">
                  
                  {/* Quote graphic icon */}
                  <Quote className="absolute top-4 right-6 size-10 text-primary/5 select-none rotate-180" />

                  {/* Customer initials badge */}
                  <div className="relative flex items-center justify-center size-14 rounded-full bg-primary/10 border border-primary/20">
                    <span className="text-sm font-black text-primary tracking-wider">{t.initials}</span>
                  </div>

                  {/* Star Ratings */}
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="size-3.5 text-amber-500 fill-amber-500" />
                    ))}
                  </div>

                  {/* Testimonial Quote */}
                  <p className="text-xs italic text-foreground leading-relaxed max-w-lg">
                    &ldquo;{t.review}&rdquo;
                  </p>

                  {/* Identity */}
                  <div className="flex flex-col gap-0.5 mt-2">
                    <span className="text-xs font-bold text-foreground">{t.name}</span>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">{t.role}</span>
                  </div>

                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* Next Button */}
        <button
          onClick={handleNext}
          aria-label="Next testimonial"
          className="hidden sm:flex size-9 border border-foreground/10 bg-card/40 hover:bg-muted/80 text-foreground items-center justify-center shrink-0 transition-colors cursor-pointer rounded-none"
        >
          <ChevronRight className="size-5" />
        </button>

      </div>

      {/* Carousel Navigation Indicators (Pill Dots) */}
      <div className="flex items-center justify-center gap-2 mt-2">
        {TESTIMONIALS.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-1.5 transition-all duration-350 cursor-pointer ${
              activeIndex === i 
                ? "w-6 bg-primary rounded-none" 
                : "w-2 bg-foreground/10 hover:bg-foreground/25 rounded-none"
            }`}
          />
        ))}
      </div>

    </section>
  );
}

export default Testimonials;
