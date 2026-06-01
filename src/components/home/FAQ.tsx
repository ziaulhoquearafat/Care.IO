"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    question: "How do you screen and vet your caregivers?",
    answer: "All Care.IO caregivers undergo a strict multi-tier screening process, including comprehensive criminal background verification, national identity (NID) checks, certified healthcare qualification audits, and formal reference reviews. We onboard only the top-vetted professionals to ensure absolute safety."
  },
  {
    question: "Can I change my assigned caregiver if we aren't a good fit?",
    answer: "Yes, absolutely. We believe that professional companionship is built on trust and mutual comfort. If at any point you feel that the caregiver isn't the perfect fit, you can coordinate with our support team to schedule an immediate caregiver transition."
  },
  {
    question: "How does your pricing work?",
    answer: "Our rates starting range is clearly shown on each service card (e.g. Baby Care, Elderly Care, and Sick Companion support). There are no hidden scheduling fees. Total costs are automatically calculated during checkout based on the duration you input."
  },
  {
    question: "Are your caregivers available during emergencies or holidays?",
    answer: "Yes, our certified caregiver network runs 24 hours a day, 7 days a week, including weekends and public holidays. When submitting a scheduling form, you can select custom night shifts or continuous holiday coverage as needed."
  },
  {
    question: "How does the payment confirmation system operate?",
    answer: "After completing checkout via our secure Stripe Payment gateway, our verification pipelines immediately confirm your transaction, generate your bookings ID, and mark your schedule status as 'Paid/Confirmed' inside your My Bookings dashboard."
  }
];

export function FAQ() {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 w-full flex flex-col gap-12 select-none">
      
      {/* Section Header */}
      <div className="flex flex-col items-center text-center gap-2">
        <h2 className="font-heading text-2xl font-extrabold text-foreground tracking-tight sm:text-3xl">
          Frequently Asked Questions
        </h2>
        <p className="text-xs text-muted-foreground max-w-md leading-relaxed">
          Find fast answers to common questions about screening, schedules, payments, and safety.
        </p>
      </div>

      {/* Accordion List container */}
      <div className="w-full max-w-3xl mx-auto flex flex-col border border-foreground/10 bg-card/60 backdrop-blur-sm divide-y divide-foreground/10 rounded-none overflow-hidden">
        {FAQS.map((faq, index) => {
          const isOpen = openIndex === index;
          
          return (
            <div key={index} className="flex flex-col text-left">
              {/* Accordion Trigger Header */}
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 flex items-center justify-between text-left font-heading text-[11px] sm:text-xs font-bold uppercase tracking-wider text-foreground hover:text-primary transition-colors cursor-pointer"
              >
                <span>{faq.question}</span>
                <ChevronDown 
                  className={`size-4 text-muted-foreground transition-transform duration-300 ${
                    isOpen ? "rotate-180 text-primary" : ""
                  }`} 
                />
              </button>

              {/* Accordion Content Box */}
              <div 
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  isOpen ? "max-h-[200px]" : "max-h-0"
                }`}
              >
                <p className="px-6 pb-5 pt-1 text-[11px] sm:text-xs text-muted-foreground leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          );
        })}
      </div>

    </section>
  );
}

export default FAQ;
