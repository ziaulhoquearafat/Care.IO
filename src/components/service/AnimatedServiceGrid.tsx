"use client";

import * as React from "react";
import { motion, Variants } from "framer-motion";
import ServiceCard from "@/components/home/ServiceCard";

interface ServiceItem {
  _id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  imageUrl?: string;
}

interface AnimatedServiceGridProps {
  services: ServiceItem[];
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const cardVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  show: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1] // premium easeOutExpo cubic bezier array
    }
  }
};

export function AnimatedServiceGrid({ services }: AnimatedServiceGridProps) {
  return (
    <motion.div
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-50px" }}
    >
      {services.map((service) => (
        <motion.div key={service._id} variants={cardVariants} className="h-full">
          <ServiceCard
            _id={service._id}
            title={service.title}
            description={service.description}
            category={service.category}
            price={service.price}
            imageUrl={service.imageUrl}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}

export default AnimatedServiceGrid;
