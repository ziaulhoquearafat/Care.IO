"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Heart,
  Baby,
  Activity,
  MapPin,
  Clock,
  ShieldCheck,
  Calendar,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Loader2,
} from "lucide-react";
import { IApiResponse } from "@/types";

interface ServiceDetails {
  _id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  imageUrl?: string;
}

interface PopulatedBooking {
  _id: string;
  userId: string;
  serviceId: ServiceDetails;
  duration: number;
  durationType: "days" | "hours";
  location: {
    division: string;
    district: string;
    city: string;
    area: string;
  };
  totalCost: number;
  status: "Pending" | "Confirmed" | "Completed" | "Cancelled";
  createdAt: string;
  updatedAt: string;
}

// Inner Component containing page content and search params logic
function MyBookingsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [bookings, setBookings] = React.useState<PopulatedBooking[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Payment Verification States
  const [verifyingPayment, setVerifyingPayment] = React.useState(false);
  const [verificationSuccess, setVerificationSuccess] = React.useState<string | null>(null);

  // URL parameters for payment redirection
  const payment_intent = searchParams.get("payment_intent");
  const redirect_status = searchParams.get("redirect_status");

  // Function to fetch bookings from the database
  const fetchMyBookings = async () => {
    try {
      const response = await fetch("/api/my-bookings");
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Unauthorized. Please sign in to view your bookings.");
        }
        throw new Error("Failed to load your booking database.");
      }
      const result: IApiResponse<PopulatedBooking[]> = await response.json();
      if (result.success && result.data) {
        setBookings(result.data);
      } else {
        setError(result.message || "Failed to load bookings.");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // 1. Initial Load of Bookings
  React.useEffect(() => {
    fetchMyBookings();
  }, []);

  // 2. Stripe Redirect Payment Verification Effect
  React.useEffect(() => {
    const verifyPayment = async () => {
      if (payment_intent && redirect_status === "succeeded") {
        setVerifyingPayment(true);
        try {
          const response = await fetch("/api/confirm-payment", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ paymentIntentId: payment_intent }),
          });

          const result: IApiResponse = await response.json();

          if (result.success) {
            setVerificationSuccess("Payment successfully verified!");
            // Re-fetch listing data to display updated 'Paid' status in UI instantly
            await fetchMyBookings();
          } else {
            console.error("Payment verification failed:", result.message);
          }
        } catch (err) {
          console.error("Payment verification network error:", err);
        } finally {
          setVerifyingPayment(false);
          // Clean up the URL parameters so that page refresh does not trigger re-verification
          router.replace("/my-bookings");
        }
      }
    };

    verifyPayment();
  }, [payment_intent, redirect_status, router]);

  // Icon mapping helper based on service category
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Baby Care":
        return <Baby className="size-4 text-pink-500" />;
      case "Elderly Service":
        return <Heart className="size-4 text-red-500 fill-red-500/10" />;
      case "Sick People Service":
        return <Activity className="size-4 text-emerald-500 animate-pulse" />;
      default:
        return <ShieldCheck className="size-4 text-primary" />;
    }
  };

  // Render State 1: Loading skeleton
  if (loading) {
    return (
      <div className="flex-grow bg-background py-16 px-4">
        <div className="mx-auto max-w-5xl flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <div className="h-6 w-32 bg-muted animate-pulse" />
            <div className="h-4 w-48 bg-muted animate-pulse" />
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="rounded-none border-foreground/10 p-6 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="h-5 w-32 bg-muted animate-pulse" />
                  <div className="h-4 w-16 bg-muted animate-pulse" />
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-full bg-muted animate-pulse" />
                  <div className="h-4 w-3/4 bg-muted animate-pulse" />
                </div>
                <div className="border-t border-foreground/10 pt-4 flex justify-between">
                  <div className="h-5 w-20 bg-muted animate-pulse" />
                  <div className="h-5 w-16 bg-muted animate-pulse" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Render State 2: General Error Card
  if (error) {
    return (
      <div className="flex-grow flex items-center justify-center py-20 px-4 bg-background">
        <Card className="max-w-md w-full border-destructive/20 bg-destructive/5 rounded-none p-6 text-center flex flex-col gap-4">
          <ShieldAlert className="size-12 text-destructive mx-auto" />
          <span className="text-xs font-bold text-destructive">Account Validation Error</span>
          <p className="text-xs text-muted-foreground">{error}</p>
          <Link href="/login" className="inline-block">
            <Button size="sm">Go to Login Page</Button>
          </Link>
        </Card>
      </div>
    );
  }

  // Render State 3: Empty Bookings State
  if (bookings.length === 0) {
    return (
      <div className="flex-grow bg-background py-20 px-4 flex items-center justify-center">
        <Card className="max-w-md w-full border-foreground/10 bg-card/60 backdrop-blur-sm rounded-none p-8 text-center flex flex-col items-center gap-6 animate-in zoom-in-95 duration-300">
          <Calendar className="size-16 text-muted-foreground/60" />
          <div className="flex flex-col gap-2">
            <h2 className="font-heading text-lg font-bold text-foreground">
              No Appointments Yet
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-xs mx-auto">
              You haven&apos;t scheduled any certified caregivers yet. Let&apos;s find the perfect companion for your family.
            </p>
          </div>
          <Link href="/" className="w-full">
            <Button className="w-full gap-2 rounded-none h-11 text-xs font-bold cursor-pointer">
              Explore Services
              <ArrowRight className="size-4" />
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  // Render State 4: Responsive Grid Layout
  return (
    <div className="flex-grow bg-background py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl flex flex-col gap-8">
        
        {/* Verification banner overlay */}
        {verifyingPayment && (
          <div className="w-full bg-primary/10 border border-primary/25 text-primary text-xs font-bold flex items-center justify-center gap-2 p-3 select-none animate-pulse rounded-none">
            <Loader2 className="size-4 animate-spin" />
            <span>Verifying Secure Payment Session...</span>
          </div>
        )}

        {verificationSuccess && (
          <div className="w-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 text-xs font-bold flex items-center justify-center gap-2 p-3 select-none rounded-none animate-in fade-in duration-300">
            <ShieldCheck className="size-4 text-emerald-500" />
            <span>{verificationSuccess}</span>
          </div>
        )}

        {/* Header Block */}
        <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h1 className="font-heading text-2xl font-black text-foreground tracking-tight sm:text-3xl">
            My Appointments
          </h1>
          <p className="text-xs text-muted-foreground">
            Track, monitor, and check payment status details for all caregiving bookings.
          </p>
        </div>

        {/* CSS Grid Card Listing */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {bookings.map((booking) => {
            const isPaid = booking.status === "Confirmed" || booking.status === "Completed";
            const isCancelled = booking.status === "Cancelled";

            return (
              <Card
                key={booking._id}
                className="group flex flex-col justify-between rounded-none border-foreground/10 bg-card/50 backdrop-blur-sm hover:border-primary/20 transition-all hover:shadow-md animate-in fade-in slide-in-from-bottom-4 duration-500"
              >
                {/* Header Section */}
                <CardHeader className="p-5 pb-0 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between gap-4">
                    <div className="inline-flex items-center gap-1.5 text-[9px] font-extrabold uppercase tracking-wider text-muted-foreground/80">
                      {booking.serviceId ? (
                        <>
                          {getCategoryIcon(booking.serviceId.category)}
                          <span>{booking.serviceId.category}</span>
                        </>
                      ) : (
                        <span>Service Deleted</span>
                      )}
                    </div>
                    {/* Compact Date Stamp */}
                    <span className="text-[10px] text-muted-foreground/60 font-mono">
                      {new Date(booking.createdAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>

                  <CardTitle className="font-heading text-sm font-bold text-foreground leading-tight line-clamp-1 group-hover:text-primary transition-colors mt-1">
                    {booking.serviceId ? booking.serviceId.title : "Care Service Info Unavailable"}
                  </CardTitle>
                </CardHeader>

                {/* Body Details */}
                <CardContent className="p-5 flex flex-col gap-3">
                  <div className="flex flex-col gap-2 text-xs text-muted-foreground leading-relaxed">
                    {/* Location */}
                    <div className="flex items-start gap-2">
                      <MapPin className="size-4 text-primary shrink-0 mt-0.5" />
                      <span>
                        {booking.location.area}, {booking.location.city},{" "}
                        {booking.location.district}
                      </span>
                    </div>

                    {/* Duration */}
                    <div className="flex items-center gap-2">
                      <Clock className="size-4 text-primary shrink-0" />
                      <span>
                        Scheduled for {booking.duration} {booking.durationType}
                      </span>
                    </div>
                  </div>
                </CardContent>

                {/* Footer Section */}
                <CardFooter className="border-t border-foreground/10 p-5 bg-muted/20 flex items-center justify-between">
                  {/* Total Cost */}
                  <div className="flex flex-col">
                    <span className="text-[9px] uppercase font-extrabold tracking-wider text-muted-foreground/80">
                      Amount Paid
                    </span>
                    <span className="font-heading text-sm font-black text-primary">
                      ${booking.totalCost}
                    </span>
                  </div>

                  {/* Payment Status Badging */}
                  {isPaid ? (
                    <span className="inline-flex items-center rounded-none bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-600">
                      Paid
                    </span>
                  ) : isCancelled ? (
                    <span className="inline-flex items-center rounded-none bg-destructive/10 border border-destructive/30 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-destructive">
                      Cancelled
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-none bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-amber-600 animate-pulse">
                      Pending
                    </span>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>

      </div>
    </div>
  );
}

// 5. Wrap inside Suspense Boundary to prevent de-optimizations in static builds due to useSearchParams
export default function MyBookingsPage() {
  return (
    <React.Suspense
      fallback={
        <div className="flex-grow flex items-center justify-center py-20 bg-background">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="size-8 text-primary animate-spin" />
            <span className="text-xs text-muted-foreground">Loading appointment dashboard...</span>
          </div>
        </div>
      }
    >
      <MyBookingsContent />
    </React.Suspense>
  );
}
