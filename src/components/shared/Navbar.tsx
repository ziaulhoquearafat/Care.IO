"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, User, Calendar, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/shared/ThemeToggle";

interface NavbarProps {
  isLoggedIn?: boolean;
}

export function Navbar({ isLoggedIn = false }: NavbarProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const [userProfile, setUserProfile] = React.useState<{ name: string; email: string } | null>(null);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  // Helper to fetch user profile client-side for dynamic name/initials
  React.useEffect(() => {
    const fetchProfile = () => {
      if (isLoggedIn) {
        fetch("/api/users/profile")
          .then((res) => res.json())
          .then((data) => {
            if (data.success && data.data) {
              setUserProfile(data.data);
            }
          })
          .catch((err) => console.error("Error fetching profile in Navbar:", err));
      } else {
        setUserProfile(null);
      }
    };

    fetchProfile();

    // Listen for custom profile update events to refresh initials in real-time
    window.addEventListener("profile-updated", fetchProfile);
    return () => {
      window.removeEventListener("profile-updated", fetchProfile);
    };
  }, [isLoggedIn]);

  // Click outside handler for dropdown
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsDropdownOpen(false);
    setIsOpen(false);
    try {
      const response = await fetch("/api/auth/logout");
      const result = await response.json();
      if (result.success) {
        router.push("/login");
        router.refresh();
      } else {
        alert(result.message || "Failed to log out.");
      }
    } catch (error) {
      console.error("Logout error:", error);
      alert("An error occurred during logout.");
    }
  };

  // Helper to calculate initials from user name
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

  const initials = getInitials(userProfile?.name);

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
        </nav>

        {/* Desktop Action Buttons & ThemeToggle */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          {isLoggedIn ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center justify-center size-8 rounded-full border border-foreground/10 bg-primary/10 hover:border-primary/30 hover:bg-primary/20 transition-all cursor-pointer select-none"
              >
                <span className="text-[11px] font-bold text-primary tracking-wider">
                  {initials}
                </span>
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-card/95 backdrop-blur-md border border-foreground/10 p-1.5 shadow-lg shadow-black/5 animate-in fade-in slide-in-from-top-1 duration-200 z-50 rounded-none">
                  {/* User Profile Summary Header */}
                  <div className="px-2.5 py-2 flex flex-col gap-0.5 border-b border-foreground/5 mb-1.5 text-left">
                    <span className="text-xs font-bold text-foreground line-clamp-1">
                      {userProfile?.name || "Care User"}
                    </span>
                    <span className="text-[10px] text-muted-foreground line-clamp-1">
                      {userProfile?.email || ""}
                    </span>
                  </div>

                  {/* Dropdown Navigation Links */}
                  <Link
                    href="/profile"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors rounded-none w-full text-left"
                  >
                    <User className="size-3.5 text-primary" />
                    <span>My Profile</span>
                  </Link>

                  <Link
                    href="/my-bookings"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors rounded-none w-full text-left"
                  >
                    <Calendar className="size-3.5 text-primary" />
                    <span>My Bookings</span>
                  </Link>

                  <div className="h-[1px] bg-foreground/10 my-1.5" />

                  {/* Logout Action */}
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-destructive/90 hover:text-destructive hover:bg-destructive/10 transition-colors rounded-none w-full text-left cursor-pointer font-medium"
                  >
                    <LogOut className="size-3.5" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
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
              <>
                <Link
                  href="/profile"
                  onClick={() => setIsOpen(false)}
                  className={getMobileStyles("/profile")}
                >
                  My Profile
                </Link>
                <Link
                  href="/my-bookings"
                  onClick={() => setIsOpen(false)}
                  className={getMobileStyles("/my-bookings")}
                >
                  My Bookings
                </Link>
              </>
            )}

            <div className="mt-4 border-t border-foreground/10 pt-4 flex flex-col gap-2">
              {isLoggedIn ? (
                <div className="w-full flex flex-col items-center gap-3">
                  {/* Mobile user profile info bar */}
                  <div className="flex items-center gap-3 self-start px-3 py-1">
                    <div className="flex items-center justify-center size-8 rounded-full bg-primary/10 border border-primary/20">
                      <span className="text-[11px] font-bold text-primary">{initials}</span>
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-xs font-bold text-foreground leading-tight">
                        {userProfile?.name || "Care User"}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {userProfile?.email || ""}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 bg-destructive/10 hover:bg-destructive/20 border border-destructive/20 hover:border-destructive/30 text-destructive text-xs font-bold py-2.5 rounded-none transition-all cursor-pointer"
                  >
                    <LogOut className="size-3.5" />
                    <span>Logout</span>
                  </button>
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
