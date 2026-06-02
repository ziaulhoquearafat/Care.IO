"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { IApiResponse } from "@/types";
import Swal from "sweetalert2";

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
        Swal.fire({
          icon: "error",
          title: "Logout Failed",
          text: result.message || "Failed to log out.",
          confirmButtonColor: "var(--primary)"
        });
      }
    } catch (error) {
      console.error("Logout button error:", error);
      Swal.fire({
        icon: "error",
        title: "Logout Error",
        text: "An error occurred during logout.",
        confirmButtonColor: "var(--primary)"
      });
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
