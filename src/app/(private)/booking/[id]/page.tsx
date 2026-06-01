import { dbConnect } from "@/lib/dbConnect";
import Service from "@/models/Service";
import BookingForm from "@/components/forms/BookingForm";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function BookingPage({ params }: PageProps) {
  // 1. Establish direct database connection on the server
  await dbConnect();

  // 2. Await and unwrap dynamic routing parameters safely on the server (Next.js 16 App Router)
  const resolvedParams = await params;
  const serviceId = resolvedParams.id;

  let service = null;
  let error = null;

  try {
    const serviceDoc = await Service.findById(serviceId);
    if (serviceDoc) {
      const obj = serviceDoc.toObject();
      service = {
        _id: obj._id ? obj._id.toString() : "",
        title: obj.title,
        description: obj.description,
        category: obj.category,
        price: obj.price,
        imageUrl: obj.imageUrl || "",
      };
    } else {
      error = "Service catalog item could not be found.";
    }
  } catch (err: any) {
    console.error("Booking page server fetch error:", err);
    error = "An error occurred while loading details.";
  }

  // Render Error state directly on the server if query failed
  if (error || !service) {
    return (
      <div className="flex-grow flex items-center justify-center py-20 px-4 bg-background min-h-screen">
        <Card className="max-w-md w-full border-destructive/20 bg-destructive/5 rounded-none p-6 text-center flex flex-col gap-4">
          <span className="text-xs font-bold text-destructive">Error Loading Page</span>
          <p className="text-xs text-muted-foreground">{error || "Catalog item not found"}</p>
          <Link href="/" className="inline-block">
            <Button size="sm" className="rounded-none cursor-pointer">Go Back Home</Button>
          </Link>
        </Card>
      </div>
    );
  }

  // Render structural wrapper and load the stateful Client Form component
  return <BookingForm service={service} />;
}
