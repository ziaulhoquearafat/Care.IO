import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import Booking from "@/models/Booking";
// Import Service model to register it in Mongoose context for populating
import "@/models/Service";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

interface DecodedToken {
  _id: string;
  email: string;
  role?: string;
}

export async function GET() {
  try {
    // 1. Establish database connection
    await dbConnect();

    // 2. Extract JWT token from cookies (awaited for Next.js 16 compatibility)
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Please log in first." },
        { status: 401 }
      );
    }

    // 3. Verify JWT token
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET environment variable is missing.");
    }

    let decoded: DecodedToken;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
    } catch (err) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Invalid token." },
        { status: 401 }
      );
    }

    const userId = decoded._id;
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Invalid user payload." },
        { status: 401 }
      );
    }

    // 4. Fetch all bookings for this user, populate service details, sort by newest
    const bookings = await Booking.find({ userId })
      .populate("serviceId")
      .sort({ createdAt: -1 });

    return NextResponse.json(
      {
        success: true,
        message: "My bookings fetched successfully.",
        data: bookings,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Fetch my bookings error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred.";
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while fetching your bookings.",
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
