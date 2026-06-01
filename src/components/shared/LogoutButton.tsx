"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { IApiResponse } from "@/types";

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/auth/logout");
      const result: IApiResponse = await response.json();

      if (result.success) {
        // Redirect to login and refresh routing state to clear authenticated context
        router.push("/login");
        router.refresh();
      } else {
        alert(result.message || "Failed to log out.");
      }
    } catch (error) {
      console.error("Logout button error:", error);
      alert("An error occurred during logout.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleLogout}
      disabled={loading}
      className="h-8 gap-1.5 px-3 text-[10px] font-bold rounded-none cursor-pointer border-destructive/20 hover:border-destructive/40 hover:bg-destructive/10 hover:text-destructive transition-all"
    >
      <LogOut className="size-3.5" />
      <span>{loading ? "Logging out..." : "Logout"}</span>
    </Button>
  );
}

export default LogoutButton;
