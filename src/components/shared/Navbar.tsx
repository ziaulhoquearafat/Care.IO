"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/shared/ThemeToggle";
import LogoutButton from "@/components/shared/LogoutButton";

interface NavbarProps {
  isLoggedIn?: boolean;
}

export function Navbar({ isLoggedIn = false }: NavbarProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const pathname = usePathname();

  // Helper to determine if a route is currently active
  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(path);
  };

  // Helper to get desktop link styles
  const getDesktopStyles = (path: string) => {
    const active = isActive(path);
    return active
      ? "text-xs font-semibold text-primary transition-colors"
      : "text-xs font-medium text-muted-foreground hover:text-foreground transition-colors";
  };

  // Helper to get mobile link styles
  const getMobileStyles = (path: string) => {
    const active = isActive(path);
    return active
      ? "block rounded-md px-3 py-2 text-base font-semibold text-primary bg-primary/5 transition-all"
      : "block rounded-md px-3 py-2 text-base font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-all";
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-foreground/10 bg-background/80 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="font-heading text-lg font-bold tracking-tight text-primary">
            Care.IO
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className={getDesktopStyles("/")}>
            Home
          </Link>
          <Link href="/service" className={getDesktopStyles("/service")}>
            Services
          </Link>
          <Link href="/about" className={getDesktopStyles("/about")}>
            About
          </Link>
          {isLoggedIn && (
            <Link href="/my-bookings" className={getDesktopStyles("/my-bookings")}>
              My Bookings
            </Link>
          )}
        </nav>

        {/* Desktop Action Buttons & ThemeToggle */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          {isLoggedIn ? (
            <LogoutButton />
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm" className="h-8 text-[11px] font-bold rounded-none cursor-pointer">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="h-8 text-[11px] font-bold rounded-none cursor-pointer">
                  Register
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile View Toggles */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
            className="size-8"
          >
            {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden border-t border-foreground/10 bg-background/95 backdrop-blur-lg animate-in slide-in-from-top duration-200">
          <div className="space-y-1 px-4 py-4 sm:px-6">
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className={getMobileStyles("/")}
            >
              Home
            </Link>
            <Link
              href="/service"
              onClick={() => setIsOpen(false)}
              className={getMobileStyles("/service")}
            >
              Services
            </Link>
            <Link
              href="/about"
              onClick={() => setIsOpen(false)}
              className={getMobileStyles("/about")}
            >
              About
            </Link>
            {isLoggedIn && (
              <Link
                href="/my-bookings"
                onClick={() => setIsOpen(false)}
                className={getMobileStyles("/my-bookings")}
              >
                My Bookings
              </Link>
            )}

            <div className="mt-4 border-t border-foreground/10 pt-4 flex flex-col gap-2">
              {isLoggedIn ? (
                <div onClick={() => setIsOpen(false)} className="w-full flex justify-center">
                  <LogoutButton />
                </div>
              ) : (
                <>
                  <Link href="/login" onClick={() => setIsOpen(false)} className="w-full">
                    <Button variant="outline" className="w-full justify-center rounded-none h-9 text-xs font-semibold">
                      Login
                    </Button>
                  </Link>
                  <Link href="/register" onClick={() => setIsOpen(false)} className="w-full">
                    <Button className="w-full justify-center rounded-none h-9 text-xs font-semibold">
                      Register
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
