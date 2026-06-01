import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // 1. Connect to the database
    await dbConnect();

    // 2. Parse the request body to extract user details
    const body = await req.json();
    const { nid, name, email, contact, password } = body;

    // Check for required fields
    if (!nid || !name || !email || !contact || !password) {
      return NextResponse.json(
        {
          success: false,
          message:
            "All fields (nid, name, email, contact, password) are required.",
        },
        { status: 400 },
      );
    }

    // 3. Strict Password Validation: At least 6 characters, one uppercase, and one lowercase letter
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
    if (!passwordRegex.test(password)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Password must be at least 6 characters long, and contain at least one uppercase and one lowercase letter.",
        },
        { status: 400 },
      );
    }

    // 4. Check if a user with the same email or NID already exists in the database
    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { nid }],
    });

    if (existingUser) {
      if (existingUser.email === email.toLowerCase()) {
        return NextResponse.json(
          {
            success: false,
            message: "A user with this email is already registered.",
          },
          { status: 400 },
        );
      }
      if (existingUser.nid === nid) {
        return NextResponse.json(
          {
            success: false,
            message: "A user with this NID is already registered.",
          },
          { status: 400 },
        );
      }
    }

    // 5. Hash the password using bcryptjs
    const hashedPassword = await bcrypt.hash(password, 10);

    // 6. Create and save the new User in the database
    const newUser = await User.create({
      name,
      email: email.toLowerCase(),
      contact,
      nid,
      password: hashedPassword,
      role: "user", // defaults to 'user'
    });

    // 7. Generate a JWT token using jsonwebtoken
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET environment variable is missing.");
    }

    const token = jwt.sign(
      { _id: newUser._id, email: newUser.email },
      JWT_SECRET,
      { expiresIn: "7d" },
    );

    // 8. Set the JWT token as an HTTP-only, secure cookie (awaited for Next.js 16 compatibility)
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
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      contact: newUser.contact,
      nid: newUser.nid,
      role: newUser.role,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt,
    };

    // 9. Return success response with 201 status code
    return NextResponse.json(
      {
        success: true,
        message: "User registered successfully.",
        data: userResponse,
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    console.error("Registration error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred.";
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred during user registration.",
        error: errorMessage,
      },
      { status: 500 },
    );
  }
}
