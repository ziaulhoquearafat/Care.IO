import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import Booking from "@/models/Booking";
import Stripe from "stripe";

export async function POST(req: Request) {
  try {
    // 1. Establish database connection
    await dbConnect();

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

    // 2. Parse request body for paymentIntentId
    const body = await req.json();
    const { paymentIntentId } = body;

    if (!paymentIntentId) {
      return NextResponse.json(
        { success: false, message: "paymentIntentId parameter is required." },
        { status: 400 }
      );
    }

    // 3. Initialize Stripe and retrieve the payment intent details
    const stripe = new Stripe(STRIPE_SECRET_KEY);
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    // 4. Verify the payment status succeeded
    if (paymentIntent.status !== "succeeded") {
      return NextResponse.json(
        {
          success: false,
          message: `Payment status is not successful: ${paymentIntent.status}`,
        },
        { status: 400 }
      );
    }

    // 5. Extract bookingId from metadata
    const bookingId = paymentIntent.metadata.bookingId;
    if (!bookingId) {
      return NextResponse.json(
        {
          success: false,
          message: "bookingId is missing from Stripe metadata.",
        },
        { status: 400 }
      );
    }

    // 6. Update Mongoose Booking status to "Confirmed" (representing Paid)
    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      { status: "Confirmed" },
      { new: true }
    );

    if (!updatedBooking) {
      return NextResponse.json(
        { success: false, message: "Target booking record could not be found." },
        { status: 404 }
      );
    }

    // 7. Return success response
    return NextResponse.json(
      {
        success: true,
        message: "Payment successfully confirmed and booking marked as Confirmed/Paid.",
        data: updatedBooking,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Confirm payment API error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred.";
    return NextResponse.json(
      {
        success: false,
        message: "Failed to verify and confirm payment.",
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
