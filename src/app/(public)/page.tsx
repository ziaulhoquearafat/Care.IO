import { dbConnect } from "@/lib/dbConnect";
import Service from "@/models/Service";
import Banner from "@/components/home/Banner";
import ServiceCard from "@/components/home/ServiceCard";

export default async function Home() {
  // 1. Establish direct database connection on the server
  await dbConnect();

  // 2. Fetch all services directly from MongoDB on the server
  const servicesDocs = await Service.find({}).sort({ createdAt: -1 });

  // 3. Serialize Mongoose documents to plain objects for client-safe prop passing
  const services = servicesDocs.map((doc) => {
    const obj = doc.toObject();
    return {
      _id: obj._id ? obj._id.toString() : "",
      title: obj.title,
      description: obj.description,
      category: obj.category,
      price: obj.price,
      imageUrl: obj.imageUrl || "",
    };
  });

  return (
    <div className="flex flex-col w-full bg-background min-h-screen">
      {/* Hero Banner */}
      <Banner />

      {/* Premium Services Grid Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 w-full">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center gap-2 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h2 className="font-heading text-2xl font-extrabold text-foreground sm:text-3xl tracking-tight">
            Our Premium Services
          </h2>
          <p className="text-xs text-muted-foreground max-w-md leading-relaxed">
            Explore our professional, compassionate, and certified caregiving services
            designed to provide your loved ones with safe, personalized support.
          </p>
        </div>

        {/* Dynamic Grid Listing */}
        {services.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 border border-dashed border-foreground/10 text-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground/80">
              No Premium Services Available
            </span>
            <p className="text-[10px] text-muted-foreground/60 max-w-xs">
              Check back soon! We are currently cataloging professional caregiving providers to assist you.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard
                key={service._id}
                _id={service._id}
                title={service.title}
                description={service.description}
                category={service.category}
                price={service.price}
                imageUrl={service.imageUrl}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
