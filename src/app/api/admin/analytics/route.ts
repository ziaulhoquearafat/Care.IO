import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import Booking from "@/models/Booking";
import User from "@/models/User";
import Service from "@/models/Service";
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

    // 3. Compute timestamps for key comparison periods
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    const startOfYesterday = new Date(startOfToday);
    startOfYesterday.setDate(startOfYesterday.getDate() - 1);
    
    const startOfWeek = new Date(startOfToday);
    startOfWeek.setDate(startOfWeek.getDate() - 6); // Includes today + 6 previous days = 7 days
    
    const startOfMonth = new Date(startOfToday);
    startOfMonth.setDate(startOfMonth.getDate() - 29); // 30 days including today

    // 4. Calculate Analytics Metrics via Aggregation and Queries
    
    // Total Revenue (All bookings Confirmed / Completed)
    const totalRevResult = await Booking.aggregate([
      { $match: { status: { $in: ["Confirmed", "Completed"] } } },
      { $group: { _id: null, total: { $sum: "$totalCost" } } }
    ]);
    const totalRevenue = totalRevResult[0]?.total || 0;

    // Today's Revenue
    const todayRevResult = await Booking.aggregate([
      { $match: { status: { $in: ["Confirmed", "Completed"] }, createdAt: { $gte: startOfToday } } },
      { $group: { _id: null, total: { $sum: "$totalCost" } } }
    ]);
    const todayRevenue = todayRevResult[0]?.total || 0;

    // Yesterday's Revenue
    const yesterdayRevResult = await Booking.aggregate([
      { $match: { status: { $in: ["Confirmed", "Completed"] }, createdAt: { $gte: startOfYesterday, $lt: startOfToday } } },
      { $group: { _id: null, total: { $sum: "$totalCost" } } }
    ]);
    const yesterdayRevenue = yesterdayRevResult[0]?.total || 0;

    // Growth Percentage (Today vs Yesterday)
    let growthPercentage = 0;
    if (yesterdayRevenue > 0) {
      growthPercentage = ((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100;
    } else if (todayRevenue > 0) {
      growthPercentage = 100; // 100% growth since yesterday was 0
    }

    // Weekly Revenue (Last 7 Days)
    const weeklyRevResult = await Booking.aggregate([
      { $match: { status: { $in: ["Confirmed", "Completed"] }, createdAt: { $gte: startOfWeek } } },
      { $group: { _id: null, total: { $sum: "$totalCost" } } }
    ]);
    const weeklyRevenue = weeklyRevResult[0]?.total || 0;

    // Monthly Revenue (Last 30 Days)
    const monthlyRevResult = await Booking.aggregate([
      { $match: { status: { $in: ["Confirmed", "Completed"] }, createdAt: { $gte: startOfMonth } } },
      { $group: { _id: null, total: { $sum: "$totalCost" } } }
    ]);
    const monthlyRevenue = monthlyRevResult[0]?.total || 0;

    // Total Bookings Count
    const totalBookings = await Booking.countDocuments({});

    // 5. Generate 7-day Chart Data (Timezone-Safe and filled for zero days)
    const last7DaysBookings = await Booking.find({
      status: { $in: ["Confirmed", "Completed"] },
      createdAt: { $gte: startOfWeek }
    });

    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const chartData = [];

    for (let i = 0; i < 7; i++) {
      const targetDate = new Date(startOfWeek);
      targetDate.setDate(targetDate.getDate() + i);
      
      const targetDateString = targetDate.toDateString();
      const dayName = dayNames[targetDate.getDay()];

      const dailySales = last7DaysBookings
        .filter((b) => (b.createdAt ? new Date(b.createdAt).toDateString() : "") === targetDateString)
        .reduce((sum, b) => sum + b.totalCost, 0);

      chartData.push({
        day: dayName,
        sales: dailySales
      });
    }

    // 6. Fetch Recent 5 Bookings (populating user and service models)
    // Make sure User and Service models are pre-loaded in Mongoose context
    const recentBookings = await Booking.find({})
      .populate("userId", "name email")
      .populate("serviceId", "title")
      .sort({ createdAt: -1 })
      .limit(5);

    // 7. Return structured Analytics Response
    return NextResponse.json(
      {
        success: true,
        message: "Admin business intelligence statistics fetched successfully.",
        data: {
          totalRevenue,
          todayRevenue,
          yesterdayRevenue,
          growthPercentage,
          weeklyRevenue,
          monthlyRevenue,
          totalBookings,
          chartData,
          recentBookings
        }
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Admin analytics fetching error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred.";
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while building admin intelligence statistics.",
        error: errorMessage
      },
      { status: 500 }
    );
  }
}
