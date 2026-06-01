import { dbConnect } from "@/lib/dbConnect";
import Service from "@/models/Service";
import ServiceCard from "@/components/home/ServiceCard";

export default async function ServiceListPage() {
  // 1. Establish database connection directly on the server
  await dbConnect();

  // 2. Fetch all services directly from MongoDB on the server
  const servicesDocs = await Service.find({}).sort({ createdAt: -1 });

  // 3. Safe Mongoose serialization for client-side prop transmission
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
    <div className="flex flex-col w-full bg-background min-h-screen select-none">
      
      {/* Premium Header Banner */}
      <section className="w-full bg-gradient-to-r from-primary/10 via-primary/5 to-background border-b border-foreground/10 py-16 px-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center gap-3 animate-in fade-in slide-in-from-top-4 duration-500">
          <h1 className="font-heading text-3xl font-black text-foreground sm:text-4xl tracking-tight">
            Our Premium Care Services
          </h1>
          <p className="text-xs text-muted-foreground max-w-lg leading-relaxed">
            Discover a wide range of professional, compassionate, and certified caregiving
            services. From specialized nursing care to trustworthy babysitting and dedicated
            companions, we are here to support your family.
          </p>
        </div>
      </section>

      {/* Services Grid Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 w-full">
        
        {services.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 border border-dashed border-foreground/10 text-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground/80">
              No Premium Services Cataloged
            </span>
            <p className="text-[10px] text-muted-foreground/60 max-w-xs leading-normal">
              We are currently onboarding professional caregivers. Please check back shortly!
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
export const metadata = {
  title: "Premium Care Services | Care.IO",
  description: "Certified caregiving, babysitting, elderly, and medical nurse care at your doorstep.",
};
