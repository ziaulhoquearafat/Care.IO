"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardHeader, CardFooter, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ServiceCardProps {
  _id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  imageUrl?: string;
}

export function ServiceCard({
  _id,
  title,
  description,
  category,
  price,
  imageUrl,
}: ServiceCardProps) {
  // Fallback image if none is provided
  const displayImage =
    imageUrl ||
    "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=600&q=80";

  return (
    <Card className="group flex flex-col h-full overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg border-foreground/10 hover:border-primary/20 bg-card/60 hover:bg-card/85 backdrop-blur-sm rounded-none">
      {/* Top Image Section */}

      <div className="relative w-full h-[200px] overflow-hidden bg-muted">
        <Image
          src={displayImage}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1000px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          priority
        />
      </div>

      {/* Middle Card Content */}
      <CardHeader className="flex-grow flex flex-col gap-2 pt-4 px-4 pb-0">
        {/* Category Badge */}
        <div className="self-start inline-flex items-center rounded-full bg-primary/10 border border-primary/25 px-2.5 py-0.5 text-[9px] font-bold text-primary uppercase tracking-wider">
          {category}
        </div>

        {/* Title */}
        <h3 className="font-heading text-sm font-bold tracking-tight text-foreground line-clamp-1 group-hover:text-primary transition-colors">
          {title}
        </h3>

        {/* Description (max 2 lines) */}
        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
          {description}
        </p>
      </CardHeader>

      {/* Required spacing to maintain layout standard */}
      <CardContent className="px-4 pb-4 pt-0" />

      {/* Bottom Footer Area */}
      <CardFooter className="flex items-center justify-between border-t border-foreground/10 p-4 bg-muted/20">
        <div className="flex flex-col">
          <span className="text-[9px] uppercase font-extrabold tracking-wider text-muted-foreground/80">
            Rate starting at
          </span>
          <span className="font-heading text-sm font-black text-primary">
            ${price}
          </span>
        </div>

        <Link href={`/booking/${_id}`}>
          <Button
            size="sm"
            className="h-8 px-4 text-[10px] font-bold rounded-none cursor-pointer transition-transform hover:scale-[1.02] active:scale-95"
          >
            Book Now
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

export default ServiceCard;
