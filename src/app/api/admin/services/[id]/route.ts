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

interface ParamsProps {
  params: Promise<{ id: string }>;
}

export async function PATCH(req: Request, { params }: ParamsProps) {
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

    // 3. Unwrap page parameters
    const resolvedParams = await params;
    const serviceId = resolvedParams.id;

    if (!serviceId) {
      return NextResponse.json(
        { success: false, message: "Service ID parameter is missing." },
        { status: 400 }
      );
    }

    // 4. Parse request body for update payload
    const body = await req.json();
    const { title, description, category, price, imageUrl } = body;

    // Validate inputs if they are provided
    if (price !== undefined && (isNaN(Number(price)) || Number(price) < 0)) {
      return NextResponse.json(
        { success: false, message: "Price must be a valid positive number." },
        { status: 400 }
      );
    }

    if (category) {
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
    }

    // 5. Update the Service document in MongoDB
    const updatedService = await Service.findByIdAndUpdate(
      serviceId,
      {
        ...(title && { title }),
        ...(description && { description }),
        ...(category && { category }),
        ...(price !== undefined && { price: Number(price) }),
        ...(imageUrl !== undefined && { imageUrl })
      },
      { new: true }
    );

    if (!updatedService) {
      return NextResponse.json(
        { success: false, message: "Target care service catalog could not be found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Care service updated successfully.",
        data: updatedService
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Admin update service error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred.";
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while updating the service.",
        error: errorMessage
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, { params }: ParamsProps) {
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

    // 3. Unwrap page parameters
    const resolvedParams = await params;
    const serviceId = resolvedParams.id;

    if (!serviceId) {
      return NextResponse.json(
        { success: false, message: "Service ID parameter is missing." },
        { status: 400 }
      );
    }

    // 4. Delete the Service document by ID
    const deletedService = await Service.findByIdAndDelete(serviceId);

    if (!deletedService) {
      return NextResponse.json(
        { success: false, message: "Target care service could not be found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Care service successfully removed from catalog."
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Admin delete service error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred.";
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while deleting the service.",
        error: errorMessage
      },
      { status: 500 }
    );
  }
}
