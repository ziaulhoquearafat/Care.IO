"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface FooterProps {
  isLoggedIn?: boolean;
}

export function Footer({ isLoggedIn = false }: FooterProps) {
  const pathname = usePathname();

  // Helper to determine active styles
  const getLinkStyles = (path: string) => {
    const isActive = path === "/" ? pathname === "/" : pathname.startsWith(path);
    return isActive
      ? "text-primary font-semibold hover:text-primary transition-colors"
      : "hover:text-foreground transition-colors";
  };

  return (
    <footer className="w-full border-t border-foreground/10 bg-muted/30 text-muted-foreground transition-all">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Column 1: Company Info */}
          <div className="flex flex-col gap-4">
            <span className="font-heading text-base font-bold tracking-tight text-foreground">
              Care.IO
            </span>
            <p className="text-xs leading-relaxed max-w-sm">
              Providing professional, trusted, and compassionate care-giving services.
              From baby care to elderly support and specialized nursing care, we connect you
              with the caregivers you can trust.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="flex flex-col gap-4">
            <span className="font-heading text-xs font-bold uppercase tracking-wider text-foreground">
              Quick Links
            </span>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className={getLinkStyles("/")}>
                  Home
                </Link>
              </li>
              <li>
                <Link href="/service" className={getLinkStyles("/service")}>
                  Services
                </Link>
              </li>
              <li>
                <Link href="/about" className={getLinkStyles("/about")}>
                  About Us
                </Link>
              </li>
              {isLoggedIn ? (
                <li>
                  <Link href="/my-bookings" className={getLinkStyles("/my-bookings")}>
                    My Bookings
                  </Link>
                </li>
              ) : (
                <li>
                  <Link href="/login" className={getLinkStyles("/login")}>
                    Login
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div className="flex flex-col gap-4">
            <span className="font-heading text-xs font-bold uppercase tracking-wider text-foreground">
              Contact Us
            </span>
            <ul className="space-y-2 text-xs">
              <li className="flex flex-col">
                <span className="font-medium text-foreground">Email:</span>
                <span>support@care.io</span>
              </li>
              <li className="flex flex-col">
                <span className="font-medium text-foreground">Phone:</span>
                <span>+880 1234 567890</span>
              </li>
              <li className="flex flex-col">
                <span className="font-medium text-foreground">Address:</span>
                <span>Dhaka, Bangladesh</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="mt-8 border-t border-foreground/10 pt-8 flex items-center justify-center">
          <p className="text-xs text-muted-foreground/60 text-center">
            &copy; {new Date().getFullYear()} Care.IO. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
