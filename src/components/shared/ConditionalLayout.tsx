"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  const isAuthRoute = pathname === "/login" || pathname === "/register";

  return (
    <>
      {!isAuthRoute && <Navbar />}
      <main className="flex-grow flex flex-col">{children}</main>
      {!isAuthRoute && <Footer />}
    </>
  );
}

export default ConditionalLayout;
