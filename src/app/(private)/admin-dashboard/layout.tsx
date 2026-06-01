"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Briefcase, 
  ArrowLeft, 
  Menu, 
  X,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const menuItems = [
    {
      name: "Dashboard Overview",
      href: "/admin-dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Manage Services",
      href: "/admin-dashboard/services",
      icon: Briefcase,
    },
  ];

  return (
    <div className="flex-grow flex flex-col md:flex-row min-h-screen bg-background border-t border-foreground/5">
      
      {/* Sidebar - Desktop Layout (Hidden on Mobile) */}
      <aside className="hidden md:flex flex-col w-64 border-r border-foreground/10 bg-card/45 backdrop-blur-md shrink-0 select-none sticky top-16 h-[calc(100vh-4rem)]">

        
        {/* Sidebar Header Section */}
        <div className="p-6 border-b border-foreground/10 flex flex-col gap-1 text-left">
          <div className="flex items-center gap-1.5">
            <Sparkles className="size-4 text-primary animate-pulse" />
            <span className="text-[10px] uppercase font-bold tracking-wider text-primary">Administration</span>
          </div>
          <span className="text-xs font-bold text-foreground">Control Console</span>
        </div>
        
        {/* Navigation List */}
        <nav className="flex-grow p-4 flex flex-col gap-1.5">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 text-xs font-bold transition-all duration-200 select-none rounded-none border ${
                  isActive
                    ? "bg-primary text-primary-foreground border-primary shadow-sm shadow-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50 border-transparent"
                }`}
              >
                <Icon className="size-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
        
        {/* Sidebar Footer Link to Public Site */}
        <div className="p-4 border-t border-foreground/10">
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2.5 text-[10px] uppercase font-bold tracking-wider text-muted-foreground hover:text-foreground transition-all duration-200 select-none"
          >
            <ArrowLeft className="size-3.5" />
            <span>Back to Public Site</span>
          </Link>
        </div>
        
      </aside>

      {/* Sidebar - Mobile Header Controls */}
      <div className="md:hidden flex items-center justify-between px-6 py-4 border-b border-foreground/10 bg-card/60 backdrop-blur-md shrink-0 select-none">
        <div className="flex flex-col gap-0.5 text-left">
          <span className="text-[9px] uppercase font-bold tracking-wider text-primary">Admin Control</span>
          <span className="text-xs font-bold text-foreground">
            {menuItems.find((item) => item.href === pathname)?.name || "Console"}
          </span>
        </div>
        
        <Button
          size="icon"
          variant="outline"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle admin navigation"
          className="size-8 rounded-none border-foreground/10 cursor-pointer text-foreground"
        >
          {mobileOpen ? <X className="size-4" /> : <Menu className="size-4" />}
        </Button>
      </div>

      {/* Sidebar - Mobile Navigation Overlay Menu */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-background/95 backdrop-blur-md flex flex-col pt-20 animate-in fade-in duration-200">
          
          <div className="flex flex-col gap-1 p-6 text-left border-b border-foreground/10">
            <span className="text-[10px] uppercase font-bold tracking-wider text-primary">Administration</span>
            <span className="text-xs font-bold text-foreground">Control Console</span>
          </div>
          
          <nav className="p-6 flex flex-col gap-2">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 text-xs font-bold transition-all duration-200 rounded-none border ${
                    isActive
                      ? "bg-primary text-primary-foreground border-primary shadow-sm shadow-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50 border-transparent"
                  }`}
                >
                  <Icon className="size-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
            
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 px-4 py-3 text-[10px] uppercase font-bold tracking-wider text-muted-foreground hover:text-foreground mt-4 border-t border-foreground/10 pt-4"
            >
              <ArrowLeft className="size-3.5" />
              <span>Back to Public Site</span>
            </Link>
          </nav>
          
        </div>
      )}

      {/* Main Administrative View Pane */}
      <main className="flex-grow w-full overflow-y-auto bg-background/50 flex flex-col min-h-screen">
        {children}
      </main>
      
    </div>
  );
}
