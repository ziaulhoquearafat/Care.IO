"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle, Heart, Sparkles } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import locationsData from "@/data/locations.json";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CheckoutForm from "@/components/forms/CheckoutForm";
import { IService, IApiResponse } from "@/types";

// 1. Initialize Stripe promise on the client side
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
);

interface PageProps {
  params: Promise<{ id: string }>;
}

interface LocationItem {
  region: string;
  district: string;
  city: string;
  covered_area: string[];
}

export default function BookingPage({ params }: PageProps) {
  // Setup & Param Unwrapping
  const resolvedParams = React.use(params);
  const serviceId = resolvedParams.id;

  const locations: LocationItem[] = locationsData as LocationItem[];

  const [service, setService] = React.useState<IService | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Form State
  const [selectedRegion, setSelectedRegion] = React.useState<string>("");
  const [selectedDistrict, setSelectedDistrict] = React.useState<string>("");
  const [selectedCity, setSelectedCity] = React.useState<string>("");
  const [selectedArea, setSelectedArea] = React.useState<string>("");
  const [duration, setDuration] = React.useState<number>(1);
  const [durationType, setDurationType] = React.useState<"days" | "hours">("days");

  // Submission & Stripe State
  const [bookingId, setBookingId] = React.useState<string>("");
  const [clientSecret, setClientSecret] = React.useState<string>("");
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  // Fetch Service Details
  React.useEffect(() => {
    const fetchServiceDetails = async () => {
      try {
        const response = await fetch("/api/services");
        if (!response.ok) {
          throw new Error("Failed to load services database.");
        }
        const result: IApiResponse<IService[]> = await response.json();
        if (result.success && result.data) {
          const found = result.data.find((item) => item._id === serviceId);
          if (found) {
            setService(found);
          } else {
            setError("Service catalog item could not be found.");
          }
        } else {
          setError(result.message || "Failed to load services.");
        }
      } catch (err: any) {
        setError(err.message || "An error occurred while loading details.");
      } finally {
        setLoading(false);
      }
    };

    fetchServiceDetails();
  }, [serviceId]);

  // Cascading Dropdown Memoized Calculations
  const regions = React.useMemo(() => {
    const unique = new Set(locations.map((loc) => loc.region));
    return Array.from(unique).sort();
  }, [locations]);

  const districts = React.useMemo(() => {
    if (!selectedRegion) return [];
    const filtered = locations.filter((loc) => loc.region === selectedRegion);
    const unique = new Set(filtered.map((loc) => loc.district));
    return Array.from(unique).sort();
  }, [selectedRegion, locations]);

  const cities = React.useMemo(() => {
    if (!selectedDistrict) return [];
    const filtered = locations.filter((loc) => loc.district === selectedDistrict);
    const unique = new Set(filtered.map((loc) => loc.city));
    return Array.from(unique).sort();
  }, [selectedDistrict, locations]);

  const areas = React.useMemo(() => {
    if (!selectedCity) return [];
    const matched = locations.find((loc) => loc.city === selectedCity);
    return matched ? matched.covered_area.sort() : [];
  }, [selectedCity, locations]);

  const handleRegionChange = (value: string) => {
    setSelectedRegion(value);
    setSelectedDistrict("");
    setSelectedCity("");
    setSelectedArea("");
  };

  const handleDistrictChange = (value: string) => {
    setSelectedDistrict(value);
    setSelectedCity("");
    setSelectedArea("");
  };

  const handleCityChange = (value: string) => {
    setSelectedCity(value);
    setSelectedArea("");
  };

  // Dynamic Price Calculation
  const totalCost = React.useMemo(() => {
    if (!service) return 0;
    return service.price * (duration > 0 ? duration : 1);
  }, [service, duration]);

  // Form Submission Handler (Bookings creation + Stripe session initialization)
  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedRegion || !selectedDistrict || !selectedCity || !selectedArea) {
      alert("Please complete the entire geographical location address.");
      return;
    }

    setSubmitting(true);

    try {
      // 1. Create the booking entry in MongoDB
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          serviceId,
          duration,
          durationType,
          location: {
            division: selectedRegion,
            district: selectedDistrict,
            city: selectedCity,
            area: selectedArea,
          },
        }),
      });

      const result: IApiResponse<{ _id: string }> = await response.json();

      if (result.success && result.data) {
        const createdBookingId = result.data._id;
        setBookingId(createdBookingId);
        setIsSuccess(true);

        // 2. Immediately trigger Stripe Payment Intent creation with calculated price
        try {
          const paymentResponse = await fetch("/api/create-payment-intent", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              bookingId: createdBookingId,
              price: totalCost,
            }),
          });

          const paymentResult: IApiResponse & { clientSecret?: string } =
            await paymentResponse.json();

          if (paymentResult.success && paymentResult.clientSecret) {
            setClientSecret(paymentResult.clientSecret);
          } else {
            console.error("Payment intent creation failed:", paymentResult.message);
          }
        } catch (paymentErr) {
          console.error("Failed to communicate with Stripe creation API:", paymentErr);
        }
      } else {
        alert(result.message || "Failed to initialize the booking.");
      }
    } catch (err) {
      console.error("Booking error:", err);
      alert("A system error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Render State 1: Loading
  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3">
          <Sparkles className="size-8 text-primary animate-spin" />
          <span className="text-xs text-muted-foreground">Loading care service details...</span>
        </div>
      </div>
    );
  }

  // Render State 2: Error
  if (error || !service) {
    return (
      <div className="flex-grow flex items-center justify-center py-20 px-4">
        <Card className="max-w-md w-full border-destructive/20 bg-destructive/5 rounded-none p-6 text-center flex flex-col gap-4">
          <span className="text-xs font-bold text-destructive">Error Loading Page</span>
          <p className="text-xs text-muted-foreground">{error || "Catalog item not found"}</p>
          <Link href="/" className="inline-block">
            <Button size="sm">Go Back Home</Button>
          </Link>
        </Card>
      </div>
    );
  }

  // Render State 3: Submission Success & Stripe checkout Gateway
  if (isSuccess) {
    return (
      <div className="flex-grow flex items-center justify-center py-20 px-4 bg-background">
        <Card className="max-w-md w-full border-foreground/10 bg-card/60 backdrop-blur-sm rounded-none p-8 text-center flex flex-col items-center gap-6 animate-in zoom-in-95 duration-300">
          {clientSecret ? (
            // If ClientSecret is fetched from Stripe, render CheckoutForm wrapped in Elements
            <div className="w-full flex flex-col gap-6">
              <div className="flex flex-col items-center gap-2">
                <CheckCircle className="size-12 text-emerald-500 animate-in fade-in zoom-in duration-300" />
                <h2 className="font-heading text-lg font-bold text-foreground">
                  Booking Initialized
                </h2>
                <p className="text-xs text-muted-foreground leading-normal">
                  Your appointment ID is{" "}
                  <code className="text-[10px] bg-muted px-1.5 py-0.5 rounded font-mono text-primary font-bold">
                    {bookingId}
                  </code>
                </p>
              </div>
              
              <div className="w-full border-t border-foreground/10 pt-5 text-left">
                <h3 className="text-xs font-bold text-foreground mb-4">
                  Complete Secure Payment
                </h3>
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <CheckoutForm totalCost={totalCost} />
                </Elements>
              </div>
            </div>
          ) : (
            // Loader shown while the Stripe intent is created asynchronously
            <>
              <CheckCircle className="size-16 text-emerald-500 animate-bounce" />
              <div className="flex flex-col gap-2">
                <h2 className="font-heading text-lg font-bold text-foreground">
                  Booking Successfully Initialized
                </h2>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Your appointment request is saved under ID: <br />
                  <code className="text-[10px] bg-muted px-1.5 py-0.5 rounded font-mono select-all text-primary font-bold">
                    {bookingId}
                  </code>
                </p>
              </div>
              <div className="w-full border-t border-foreground/10 pt-4 flex flex-col items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="relative flex size-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full size-2 bg-primary"></span>
                  </span>
                  <span className="text-[10px] font-semibold text-primary uppercase tracking-wider">
                    Loading Payment Gateway...
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground/60 max-w-xs leading-normal">
                  Please do not refresh the browser. We are setting up your secure checkout session.
                </p>
              </div>
            </>
          )}
        </Card>
      </div>
    );
  }

  // Render State 4: Standard Booking Form Page
  return (
    <div className="flex-grow bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl flex flex-col gap-6">
        {/* Back Link */}
        <Link
          href="/"
          className="self-start inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to Home</span>
        </Link>

        {/* Header Card: Service Details Display */}
        <Card className="border-foreground/10 bg-primary/5 rounded-none p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-col gap-2">
            <div className="inline-flex items-center gap-1 text-[9px] font-extrabold text-primary uppercase tracking-wider">
              <Heart className="size-3 fill-primary text-primary" />
              <span>{service.category}</span>
            </div>
            <h1 className="font-heading text-lg font-black text-foreground">
              {service.title}
            </h1>
            <p className="text-xs text-muted-foreground max-w-lg leading-relaxed line-clamp-2">
              {service.description}
            </p>
          </div>
          <div className="sm:text-right flex flex-col justify-center">
            <span className="text-[9px] uppercase font-bold text-muted-foreground/80">
              Base Price Rate
            </span>
            <span className="font-heading text-xl font-black text-primary">
              ${service.price}
            </span>
          </div>
        </Card>

        {/* Main Booking Form Wrapper */}
        <Card className="border-foreground/10 bg-card/60 backdrop-blur-sm rounded-none shadow-sm overflow-hidden">
          <CardHeader className="border-b border-foreground/10 p-6">
            <CardTitle className="font-heading text-sm font-bold text-foreground">
              Complete Your Appointment Details
            </CardTitle>
          </CardHeader>

          <CardContent className="p-6">
            <form onSubmit={handleBookingSubmit} className="flex flex-col gap-6">
              {/* Dynamic Location Cascading Dropdowns */}
              <div className="flex flex-col gap-4">
                <h3 className="text-xs font-bold text-foreground border-b border-foreground/10 pb-1.5">
                  1. Service Delivery Location
                </h3>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* Division (Region) */}
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="region" className="text-xs font-semibold">
                      Division (Region)
                    </Label>
                    <Select value={selectedRegion} onValueChange={handleRegionChange}>
                      <SelectTrigger id="region" className="w-full">
                        <SelectValue placeholder="Select Division" />
                      </SelectTrigger>
                      <SelectContent>
                        {regions.map((region) => (
                          <SelectItem key={region} value={region}>
                            {region}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* District */}
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="district" className="text-xs font-semibold">
                      District
                    </Label>
                    <Select
                      value={selectedDistrict}
                      onValueChange={handleDistrictChange}
                      disabled={!selectedRegion}
                    >
                      <SelectTrigger id="district" className="w-full">
                        <SelectValue placeholder="Select District" />
                      </SelectTrigger>
                      <SelectContent>
                        {districts.map((district) => (
                          <SelectItem key={district} value={district}>
                            {district}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* City */}
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="city" className="text-xs font-semibold">
                      City
                    </Label>
                    <Select
                      value={selectedCity}
                      onValueChange={handleCityChange}
                      disabled={!selectedDistrict}
                    >
                      <SelectTrigger id="city" className="w-full">
                        <SelectValue placeholder="Select City" />
                      </SelectTrigger>
                      <SelectContent>
                        {cities.map((city) => (
                          <SelectItem key={city} value={city}>
                            {city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Area */}
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="area" className="text-xs font-semibold">
                      Covered Area (Address)
                    </Label>
                    <Select
                      value={selectedArea}
                      onValueChange={setSelectedArea}
                      disabled={!selectedCity}
                    >
                      <SelectTrigger id="area" className="w-full">
                        <SelectValue placeholder="Select Area" />
                      </SelectTrigger>
                      <SelectContent>
                        {areas.map((area) => (
                          <SelectItem key={area} value={area}>
                            {area}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Service Duration Details */}
              <div className="flex flex-col gap-4">
                <h3 className="text-xs font-bold text-foreground border-b border-foreground/10 pb-1.5">
                  2. Service Duration Details
                </h3>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* Duration Value */}
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="duration" className="text-xs font-semibold">
                      Duration
                    </Label>
                    <Input
                      id="duration"
                      type="number"
                      min={1}
                      value={duration}
                      onChange={(e) =>
                        setDuration(Math.max(1, parseInt(e.target.value) || 1))
                      }
                      required
                      className="w-full"
                    />
                  </div>

                  {/* Duration Type */}
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="durationType" className="text-xs font-semibold">
                      Duration Type
                    </Label>
                    <Select
                      value={durationType}
                      onValueChange={(value) => setDurationType(value as "days" | "hours")}
                    >
                      <SelectTrigger id="durationType" className="w-full">
                        <SelectValue placeholder="Select Duration Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="days">Days</SelectItem>
                        <SelectItem value="hours">Hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Dynamic Calculation & Submission Bar */}
              <div className="mt-4 border-t border-foreground/10 pt-6 flex flex-col sm:flex-row items-stretch sm:items-center sm:justify-between gap-6">
                {/* Total Cost Presentation */}
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground/80 tracking-wider">
                    Calculated Total Cost
                  </span>
                  <span className="font-heading text-xl font-black text-primary">
                    Total Cost: ${totalCost}
                  </span>
                </div>

                {/* Submit button */}
                <Button
                  type="submit"
                  disabled={submitting}
                  className="h-11 px-6 font-bold rounded-none cursor-pointer transition-transform hover:scale-[1.02] active:scale-95 text-xs"
                >
                  {submitting ? "Processing..." : "Confirm Booking & Proceed to Payment"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
