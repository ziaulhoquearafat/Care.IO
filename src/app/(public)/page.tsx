import { dbConnect } from "@/lib/dbConnect";
import Service from "@/models/Service";
import Banner from "@/components/home/Banner";
import ServiceCard from "@/components/home/ServiceCard";
import Stats from "@/components/home/Stats";
import HowItWorks from "@/components/home/HowItWorks";
import WhyUs from "@/components/home/WhyUs";
import Testimonials from "@/components/home/Testimonials";
import FAQ from "@/components/home/FAQ";
import CTA from "@/components/home/CTA";

import FadeUp from "@/components/animations/FadeUp";

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
    <div className="flex flex-col w-full bg-background min-h-screen gap-16 lg:gap-24 pb-16">
      
      {/* 1. Hero Banner */}
      <FadeUp delay={0.05} duration={0.6}>
        <Banner />
      </FadeUp>

      {/* 2. Stats Section */}
      <FadeUp delay={0.1} duration={0.6}>
        <Stats />
      </FadeUp>

      {/* 3. Premium Services Grid Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        {/* Section Header */}
        <FadeUp duration={0.6}>
          <div className="flex flex-col items-center text-center gap-2 mb-12">
            <h2 className="font-heading text-2xl font-extrabold text-foreground sm:text-3xl tracking-tight">
              Our Premium Services
            </h2>
            <p className="text-xs text-muted-foreground max-w-md leading-relaxed">
              Explore our professional, compassionate, and certified caregiving services
              designed to provide your loved ones with safe, personalized support.
            </p>
          </div>
        </FadeUp>

        {/* Dynamic Grid Listing */}
        {services.length === 0 ? (
          <FadeUp delay={0.15} duration={0.6}>
            <div className="flex flex-col items-center justify-center py-20 border border-dashed border-foreground/10 text-center gap-2">
              <span className="text-xs font-semibold text-muted-foreground/80">
                No Premium Services Available
              </span>
              <p className="text-[10px] text-muted-foreground/60 max-w-xs">
                Check back soon! We are currently cataloging professional caregiving providers to assist you.
              </p>
            </div>
          </FadeUp>
        ) : (
          <FadeUp delay={0.1} duration={0.6}>
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
          </FadeUp>
        )}
      </section>

      {/* 4. How It Works Section */}
      <HowItWorks />

      {/* 5. Why Choose Us Section */}
      <WhyUs />

      {/* 6. Client Testimonials Carousel */}
      <FadeUp duration={0.6}>
        <Testimonials />
      </FadeUp>

      {/* 7. Collapsible FAQ Section */}
      <FadeUp duration={0.6}>
        <FAQ />
      </FadeUp>

      {/* 8. Call To Action Banner */}
      <FadeUp duration={0.6}>
        <CTA />
      </FadeUp>

    </div>
  );
}

