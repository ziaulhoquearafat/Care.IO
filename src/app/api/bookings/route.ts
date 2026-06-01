import { dbConnect } from "@/lib/dbConnect";
import Booking from "@/models/Booking";
import Service from "@/models/Service";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

interface DecodedToken {
  _id: string;
  email: string;
  role?: string;
}

export async function GET() {
  try {
    await dbConnect();
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Please log in first." },
        { status: 401 },
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
        { status: 401 },
      );
    }

    const userId = decoded._id;
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Invalid user payload." },
        { status: 401 },
      );
    }

    // 4. Fetch all bookings for the logged-in user and populate service details
    const bookings = await Booking.find({ userId })
      .populate("serviceId")
      .sort({ createdAt: -1 });

    return NextResponse.json(
      {
        success: true,
        message: "Bookings fetched successfully.",
        data: bookings,
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    console.error("Fetch bookings error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred.";
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while fetching bookings.",
        error: errorMessage,
      },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();

    // 2. Extract token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Please log in first." },
        { status: 401 },
      );
    }

    // Verify JWT token
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
        { status: 401 },
      );
    }

    const userId = decoded._id;
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Invalid user payload." },
        { status: 401 },
      );
    }

    // 3. Parse request body for booking details
    const body = await req.json();
    const { serviceId, duration, durationType, location } = body;

    // Validation: Check for required fields
    if (!serviceId || !duration || !durationType || !location) {
      return NextResponse.json(
        {
          success: false,
          message:
            "All fields (serviceId, duration, durationType, location) are required.",
        },
        { status: 400 },
      );
    }

    // Validate location properties
    const { division, district, city, area } = location;
    if (!division || !district || !city || !area) {
      return NextResponse.json(
        {
          success: false,
          message: "Location must include: division, district, city, and area.",
        },
        { status: 400 },
      );
    }

    // Validate duration type matches schema enums
    if (durationType !== "days" && durationType !== "hours") {
      return NextResponse.json(
        {
          success: false,
          message: "Duration type must be either 'days' or 'hours'.",
        },
        { status: 400 },
      );
    }

    // 4. Retrieve Service to fetch price
    const service = await Service.findById(serviceId);
    if (!service) {
      return NextResponse.json(
        {
          success: false,
          message: "Service not found.",
        },
        { status: 404 },
      );
    }

    // 5. Calculate total cost based on service price and booking duration
    const totalCost = service.price * duration;

    // 6. Create and save new Booking in MongoDB
    const newBooking = await Booking.create({
      userId,
      serviceId,
      duration,
      durationType,
      location,
      totalCost,
      status: "Pending", // defaults to 'Pending'
    });

    // 7. Return 210/201 success response with new booking details
    return NextResponse.json(
      {
        success: true,
        message: "Booking created successfully.",
        data: newBooking,
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    console.error("Create booking error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred.";
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while creating your booking.",
        error: errorMessage,
      },
      { status: 500 },
    );
  }
}
