"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

interface ConditionalLayoutProps {
  children: React.ReactNode;
  isLoggedIn?: boolean;
}

export function ConditionalLayout({ children, isLoggedIn = false }: ConditionalLayoutProps) {
  const pathname = usePathname();
  const isAuthRoute = pathname === "/login" || pathname === "/register";

  return (
    <>
      {!isAuthRoute && <Navbar isLoggedIn={isLoggedIn} />}
      <main className="flex-grow flex flex-col">{children}</main>
      {!isAuthRoute && <Footer isLoggedIn={isLoggedIn} />}
    </>
  );
}

export default ConditionalLayout;
