"use client";

import * as React from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";

interface CheckoutFormProps {
  totalCost: number;
}

export function CheckoutForm({ totalCost }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          // Redirect page after successful stripe payment
          return_url: `${window.location.origin}/my-bookings`,
        },
      });

      if (error) {
        // This will only execute if stripe encounters an immediate failure
        setErrorMessage(error.message || "An unexpected payment error occurred.");
      }
    } catch (err) {
      console.error("Payment confirmation error:", err);
      setErrorMessage("A network error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5 animate-in fade-in duration-300">
      
      {/* Stripe Payment Element Wrapper */}
      <div className="w-full bg-background min-h-[120px] rounded-none">
        <PaymentElement />
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="rounded-none border border-destructive/20 bg-destructive/5 px-4 py-3 text-xs text-destructive text-left leading-normal">
          {errorMessage}
        </div>
      )}

      {/* Checkout Submission Button */}
      <Button
        type="submit"
        disabled={!stripe || !elements || submitting}
        className="w-full h-11 font-bold rounded-none cursor-pointer gap-2 transition-transform hover:scale-[1.02] active:scale-95 text-xs"
      >
        <CreditCard className="size-4 animate-pulse" />
        <span>
          {submitting ? "Processing Payment..." : `Pay $${totalCost}`}
        </span>
      </Button>
    </form>
  );
}

export default CheckoutForm;
