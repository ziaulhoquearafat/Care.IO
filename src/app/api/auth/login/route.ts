import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    // 1. Connect to the database
    await dbConnect();

    // 2. Parse the request body to extract credentials
    const body = await req.json();
    const { email, password } = body;

    // Check for required fields
    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Email and password are required.",
        },
        { status: 400 }
      );
    }

    // 3. Find the user by email (selecting password explicitly as select is false in model)
    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password.",
        },
        { status: 401 }
      );
    }

    // 4. Compare passwords using bcryptjs
    const isPasswordMatch = await bcrypt.compare(password, user.password!);

    if (!isPasswordMatch) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password.",
        },
        { status: 401 }
      );
    }

    // 5. Generate a JWT token using jsonwebtoken
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET environment variable is missing.");
    }

    const token = jwt.sign(
      { _id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 6. Set the JWT token as an HTTP-only, secure cookie (awaited for Next.js 16 compatibility)
    const cookieStore = await cookies();
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
      path: "/",
    });

    // Extract user details to return (excluding the password)
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      contact: user.contact,
      nid: user.nid,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    // 7. Return success response with 200 status code
    return NextResponse.json(
      {
        success: true,
        message: "Logged in successfully.",
        data: userResponse,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Login error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred.";
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred during user login.",
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
