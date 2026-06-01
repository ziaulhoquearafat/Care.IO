"use client";

import * as React from "react";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  Activity,
  Loader2,
  Sparkles,
  Clock,
  User,
  Briefcase
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

interface BookingItem {
  _id: string;
  userId?: {
    name: string;
    email: string;
  };
  serviceId?: {
    title: string;
  };
  totalCost: number;
  status: string;
  createdAt: string;
}

interface AnalyticsData {
  totalRevenue: number;
  todayRevenue: number;
  yesterdayRevenue: number;
  growthPercentage: number;
  weeklyRevenue: number;
  monthlyRevenue: number;
  totalBookings: number;
  chartData: { day: string; sales: number }[];
  recentBookings: BookingItem[];
}

export default function AdminDashboardPage() {
  const [data, setData] = React.useState<AnalyticsData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [mounted, setMounted] = React.useState(false);

  // Set mounted true on client-side to prevent Recharts SSR hydration mismatches
  React.useEffect(() => {
    setMounted(true);
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await fetch("/api/admin/analytics");
      const result = await res.json();
      if (result.success) {
        setData(result.data);
      } else {
        setError(result.message || "Failed to load metrics.");
      }
    } catch (err) {
      console.error("Dashboard page loading error:", err);
      setError("An error occurred while loading dashboard metrics.");
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .trim()
      .split(/\s+/)
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  // Custom Chart Tooltip Component
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card/95 backdrop-blur-md border border-foreground/10 p-2.5 shadow-md rounded-none text-left">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Daily Revenue</p>
          <p className="text-xs font-black text-primary mt-0.5">${payload[0].value.toLocaleString()}</p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex-grow flex flex-col w-full bg-background select-none min-h-screen">
        <section className="w-full bg-gradient-to-r from-primary/10 via-primary/5 to-background border-b border-foreground/10 py-16 px-4">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center gap-3 animate-pulse">
            <div className="h-8 w-64 bg-foreground/10 rounded-none" />
            <div className="h-4 w-96 bg-foreground/10 rounded-none" />
          </div>
        </section>
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 w-full flex-grow flex flex-col gap-8 animate-pulse">
          {/* Skeleton Metric Cards */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-28 border border-foreground/10 bg-card/60 rounded-none p-6" />
            ))}
          </div>
          {/* Skeleton Chart */}
          <div className="h-96 border border-foreground/10 bg-card/60 rounded-none p-6" />
          {/* Skeleton Table */}
          <div className="h-72 border border-foreground/10 bg-card/60 rounded-none p-6" />
        </section>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex-grow flex flex-col w-full bg-background select-none min-h-screen">
        <section className="w-full bg-gradient-to-r from-primary/10 via-primary/5 to-background border-b border-foreground/10 py-16 px-4">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center gap-3">
            <h1 className="font-heading text-3xl font-black text-foreground tracking-tight">Access Control Warning</h1>
          </div>
        </section>
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 w-full flex-grow flex flex-col items-center justify-center text-center gap-4">
          <div className="size-12 rounded-none bg-red-500/10 border border-red-500/20 flex items-center justify-center">
            <Activity className="size-6 text-red-500" />
          </div>
          <div className="flex flex-col gap-2 max-w-md">
            <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">Restricted Administration Node</h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {error || "Business analytics and transaction summaries are strictly restricted. Please authenticate with administrator credentials."}
            </p>
          </div>
          <Button onClick={() => window.location.reload()} className="h-9 px-6 text-xs font-bold rounded-none cursor-pointer">
            Re-Authenticate
          </Button>
        </section>
      </div>
    );
  }

  return (
    <div className="flex-grow flex flex-col w-full bg-background select-none min-h-screen">
      
      {/* Page Header Banner */}
      <section className="w-full bg-gradient-to-r from-primary/10 via-primary/5 to-background border-b border-foreground/10 py-16 px-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center gap-3 animate-in fade-in slide-in-from-top-4 duration-500">
          <h1 className="font-heading text-3xl font-black text-foreground sm:text-4xl tracking-tight">
            Admin Analytics Dashboard
          </h1>
          <p className="text-xs text-muted-foreground max-w-lg leading-relaxed">
            Real-time business intelligence metrics, aggregated revenue tracking, vector sales graphs, and comprehensive booking details.
          </p>
        </div>
      </section>

      {/* Main Dashboard Panel */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 w-full flex-grow flex flex-col gap-8">
        
        {/* 1. Top Section - 4 Metric Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* Card 1: Total Revenue */}
          <Card className="rounded-none border-foreground/10 bg-card/60 backdrop-blur-sm p-6 hover:shadow-md hover:border-primary/20 transition-all flex flex-col justify-between h-28">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Total Revenue</span>
              <div className="size-7 rounded-none bg-primary/10 border border-primary/20 flex items-center justify-center">
                <DollarSign className="size-3.5 text-primary" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-heading text-xl font-black text-foreground">${data.totalRevenue.toLocaleString()}</span>
              <span className="text-[9px] text-muted-foreground/80 mt-0.5">Aggregated platform sales</span>
            </div>
          </Card>

          {/* Card 2: Today's Revenue & Growth */}
          <Card className="rounded-none border-foreground/10 bg-card/60 backdrop-blur-sm p-6 hover:shadow-md hover:border-primary/20 transition-all flex flex-col justify-between h-28">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Today&apos;s Revenue</span>
              <div className="size-7 rounded-none bg-primary/10 border border-primary/20 flex items-center justify-center">
                {data.growthPercentage >= 0 ? (
                  <TrendingUp className="size-3.5 text-emerald-500" />
                ) : (
                  <TrendingDown className="size-3.5 text-red-500" />
                )}
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-baseline gap-2">
                <span className="font-heading text-xl font-black text-foreground">${data.todayRevenue.toLocaleString()}</span>
                {data.growthPercentage >= 0 ? (
                  <span className="inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[9px] font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
                    +{data.growthPercentage.toFixed(0)}%
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[9px] font-bold bg-red-500/10 border border-red-500/20 text-red-500">
                    {data.growthPercentage.toFixed(0)}%
                  </span>
                )}
              </div>
              <span className="text-[9px] text-muted-foreground/80 mt-0.5">Vs. yesterday (${data.yesterdayRevenue})</span>
            </div>
          </Card>

          {/* Card 3: Weekly Sales */}
          <Card className="rounded-none border-foreground/10 bg-card/60 backdrop-blur-sm p-6 hover:shadow-md hover:border-primary/20 transition-all flex flex-col justify-between h-28">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Weekly Revenue</span>
              <div className="size-7 rounded-none bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Calendar className="size-3.5 text-primary" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-heading text-xl font-black text-foreground">${data.weeklyRevenue.toLocaleString()}</span>
              <span className="text-[9px] text-muted-foreground/80 mt-0.5">Last 7 days dynamic index</span>
            </div>
          </Card>

          {/* Card 4: Total Bookings */}
          <Card className="rounded-none border-foreground/10 bg-card/60 backdrop-blur-sm p-6 hover:shadow-md hover:border-primary/20 transition-all flex flex-col justify-between h-28">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Total Bookings</span>
              <div className="size-7 rounded-none bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Activity className="size-3.5 text-primary" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-heading text-xl font-black text-foreground">{data.totalBookings}</span>
              <span className="text-[9px] text-muted-foreground/80 mt-0.5">Total scheduled care requests</span>
            </div>
          </Card>

        </div>

        {/* 2. Middle Section - Recharts Sales Trends Graph */}
        <Card className="rounded-none border-foreground/10 bg-card/60 backdrop-blur-sm p-6 hover:shadow-md transition-all animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
          <div className="flex flex-col gap-1 mb-6 text-left">
            <h3 className="font-heading text-xs font-black uppercase tracking-wider text-foreground">Sales Revenue Index</h3>
            <p className="text-[10px] text-muted-foreground leading-normal">Visual representation of platform sales index compiled daily over the last 7 active periods.</p>
          </div>

          <div className="w-full">
            {mounted && (
              <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={data.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(var(--foreground), 0.05)" />
                  <XAxis
                    dataKey="day"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: 'var(--muted-foreground)', fontSize: 10, fontWeight: 500 }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: 'var(--muted-foreground)', fontSize: 10, fontWeight: 500 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="sales"
                    stroke="var(--primary)"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorSales)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        {/* 3. Bottom Section - Recent Bookings Ledger */}
        <Card className="rounded-none border-foreground/10 bg-card/60 backdrop-blur-sm p-6 hover:shadow-md transition-all animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
          <div className="flex flex-col gap-1 mb-6 text-left">
            <h3 className="font-heading text-xs font-black uppercase tracking-wider text-foreground">Recent Bookings & Customers</h3>
            <p className="text-[10px] text-muted-foreground leading-normal">Audit trail mapping the 5 most recent caregiver platform schedules, payments, and client profiles.</p>
          </div>

          <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-foreground/10 text-muted-foreground text-[10px] uppercase font-bold tracking-wider">
                  <th className="pb-3 font-semibold">Customer Details</th>
                  <th className="pb-3 font-semibold">Care Service</th>
                  <th className="pb-3 font-semibold">Schedule Date</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold text-right">Invoice Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-foreground/5">
                {data.recentBookings.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-muted-foreground text-[11px]">
                      No scheduled bookings logged in the system.
                    </td>
                  </tr>
                ) : (
                  data.recentBookings.map((booking) => {
                    const initials = getInitials(booking.userId?.name);
                    const isPaid = booking.status === "Confirmed" || booking.status === "Completed";
                    
                    return (
                      <tr key={booking._id} className="hover:bg-muted/10 transition-colors">
                        {/* Column 1: Customer Profile */}
                        <td className="py-3.5 pr-4 flex items-center gap-3">
                          <div className="flex items-center justify-center size-8 rounded-full bg-primary/10 border border-primary/20 shrink-0 select-none">
                            <span className="text-[10px] font-bold text-primary tracking-wider">{initials}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="font-semibold text-foreground leading-tight">{booking.userId?.name || "Anonymous Client"}</span>
                            <span className="text-[10px] text-muted-foreground/80 mt-0.5">{booking.userId?.email || "No email"}</span>
                          </div>
                        </td>

                        {/* Column 2: Service Title */}
                        <td className="py-3.5 px-4 text-foreground/90 font-medium">
                          {booking.serviceId?.title || "Specialized Care Service"}
                        </td>

                        {/* Column 3: Date */}
                        <td className="py-3.5 px-4 text-muted-foreground">
                          {formatDate(booking.createdAt)}
                        </td>

                        {/* Column 4: Status Badge */}
                        <td className="py-3.5 px-4">
                          {isPaid ? (
                            <span className="inline-flex items-center rounded px-2 py-0.5 text-[9px] font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
                              Paid
                            </span>
                          ) : (
                            <span className="inline-flex items-center rounded px-2 py-0.5 text-[9px] font-bold bg-amber-500/10 border border-amber-500/20 text-amber-500">
                              {booking.status}
                            </span>
                          )}
                        </td>

                        {/* Column 5: totalCost */}
                        <td className="py-3.5 pl-4 text-right font-heading font-black text-primary">
                          ${booking.totalCost}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </Card>

      </section>

    </div>
  );
}
