import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  try {
    // 1. Access the cookies store (awaited for Next.js 16 compatibility)
    const cookieStore = await cookies();

    // 2. Clear/Delete the JWT authentication cookie
    cookieStore.delete("token");

    // 3. Return success JSON response with 200 status code
    return NextResponse.json(
      {
        success: true,
        message: "Logged out successfully.",
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Logout error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred.";
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred during logout.",
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
