import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: Request) {
  try {
    const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
    if (!STRIPE_SECRET_KEY) {
      return NextResponse.json(
        {
          success: false,
          message: "Stripe configuration error. STRIPE_SECRET_KEY is missing.",
        },
        { status: 500 }
      );
    }

    // Initialize Stripe (defaults to standard API versioning)
    const stripe = new Stripe(STRIPE_SECRET_KEY);

    // Parse the request body
    const body = await req.json();
    const { bookingId, price } = body;

    // Validate fields
    if (!bookingId || price === undefined || price <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Valid bookingId and positive price are required.",
        },
        { status: 400 }
      );
    }

    // Calculate amount in cents (multiply price by 100)
    const amountInCents = Math.round(price * 100);

    // Create the Payment Intent using Stripe SDK
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: "usd",
      metadata: { bookingId },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    // Return success response with clientSecret
    return NextResponse.json(
      {
        success: true,
        message: "Payment intent created successfully.",
        clientSecret: paymentIntent.client_secret,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Create payment intent error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred.";
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create payment intent.",
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
