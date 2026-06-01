import { dbConnect } from "@/lib/dbConnect";
import Service from "@/models/Service";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();
    const services = await Service.find({}).sort({ createdAt: -1 });
    return NextResponse.json(
      {
        success: true,
        message: "Services fetched successfully.",
        data: services,
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    console.error("Fetch services error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred.";
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while fetching services.",
        error: errorMessage,
      },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const { title, description, category, price, imageUrl } = body;

    if (!title || !description || !category || price === undefined) {
      return NextResponse.json(
        {
          success: false,
          message:
            "All core fields (title, description, category, price) are required.",
        },
        { status: 400 },
      );
    }

    // Validate category selection matches schema enum
    const validCategories = [
      "Baby Care",
      "Elderly Service",
      "Sick People Service",
    ];
    if (!validCategories.includes(category)) {
      return NextResponse.json(
        {
          success: false,
          message: `Category must be one of: ${validCategories.join(", ")}`,
        },
        { status: 400 },
      );
    }

    // 3. Create and save the new Service in MongoDB
    const newService = await Service.create({
      title,
      description,
      category,
      price,
      imageUrl,
    });

    // 4. Return 201 success response with new service data
    return NextResponse.json(
      {
        success: true,
        message: "Service created successfully.",
        data: newService,
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    console.error("Create service error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred.";
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while creating the service.",
        error: errorMessage,
      },
      { status: 500 },
    );
  }
}
