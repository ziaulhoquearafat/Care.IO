import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  // 1. Extract the authentication token from cookies
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // 2. Identify protected routes (startsWith is used to cover dynamic sub-paths)
  const isProtectedRoute =
    pathname.startsWith("/booking") ||
    pathname.startsWith("/my-bookings") ||
    pathname.startsWith("/admin-dashboard");

  // 3. Identify authentication routes
  const isAuthRoute = pathname === "/login" || pathname === "/register";

  // 4. Route Protection Logic
  if (isProtectedRoute && !token) {
    // Redirect unauthenticated users to the login page
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthRoute && token) {
    // Redirect already authenticated users away from login/register to the home page
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Allow the request to proceed normally
  return NextResponse.next();
}

// 5. Optimizing Matcher Configurations for efficiency
export const config = {
  matcher: [
    "/booking/:path*",
    "/my-bookings",
    "/admin-dashboard",
    "/login",
    "/register",
  ],
};
