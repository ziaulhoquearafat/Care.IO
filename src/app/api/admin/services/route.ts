import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import Service from "@/models/Service";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

interface DecodedToken {
  _id: string;
  email: string;
  role?: string;
}

export async function POST(req: Request) {
  try {
    // 1. Establish database connection
    await dbConnect();

    // 2. Authenticate and authorize as Admin (awaited for Next.js 16 compatibility)
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Please log in first." },
        { status: 401 }
      );
    }

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

    if (decoded.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Forbidden. Admin privileges required." },
        { status: 403 }
      );
    }

    // 3. Parse request body for service details
    const body = await req.json();
    const { title, description, category, price, imageUrl } = body;

    // Validate inputs
    if (!title || !description || !category || price === undefined) {
      return NextResponse.json(
        {
          success: false,
          message: "All core fields (title, description, category, price) are required."
        },
        { status: 400 }
      );
    }

    // Validate category selection matches schema enum
    const validCategories = ["Baby Care", "Elderly Service", "Sick People Service"];
    if (!validCategories.includes(category)) {
      return NextResponse.json(
        {
          success: false,
          message: `Category must be one of: ${validCategories.join(", ")}`
        },
        { status: 400 }
      );
    }

    if (isNaN(Number(price)) || Number(price) < 0) {
      return NextResponse.json(
        { success: false, message: "Price must be a valid positive number." },
        { status: 400 }
      );
    }

    // 4. Create and save the new Service in MongoDB
    const newService = await Service.create({
      title,
      description,
      category,
      price: Number(price),
      imageUrl: imageUrl || ""
    });

    return NextResponse.json(
      {
        success: true,
        message: "New care service added successfully to the catalog.",
        data: newService
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Admin create service error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred.";
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while creating the service.",
        error: errorMessage
      },
      { status: 500 }
    );
  }
}
