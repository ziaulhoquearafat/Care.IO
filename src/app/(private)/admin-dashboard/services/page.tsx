"use client";

import * as React from "react";
import { Plus, Edit, Trash2, Loader2, Activity, Heart } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IService, IApiResponse } from "@/types";
import ServiceModal from "@/components/admin/ServiceModal";
import Swal from "sweetalert2";

export default function ManageServicesPage() {
  const [services, setServices] = React.useState<IService[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Modal Control States
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingService, setEditingService] = React.useState<IService | null>(null);

  const fetchServices = async () => {
    try {
      const res = await fetch("/api/services");
      const result: IApiResponse<IService[]> = await res.json();
      if (result.success && result.data) {
        setServices(result.data);
      } else {
        setError(result.message || "Failed to load services database.");
      }
    } catch (err) {
      console.error("Manage services fetching error:", err);
      setError("An error occurred while fetching care services.");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchServices();
  }, []);

  const handleAddNew = () => {
    setEditingService(null);
    setIsModalOpen(true);
  };

  const handleEdit = (service: IService) => {
    setEditingService(service);
    setIsModalOpen(true);
  };

  const handleDelete = (serviceId: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This care service will be permanently deleted from the active catalog!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "var(--primary)",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      background: "var(--background)",
      color: "var(--foreground)"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(`/api/admin/services/${serviceId}`, {
            method: "DELETE"
          });
          const data = await res.json();

          if (data.success) {
            Swal.fire({
              icon: "success",
              title: "Removed Successfully",
              text: "The service has been successfully removed from Care.IO.",
              toast: true,
              position: "top-end",
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true
            });
            // Update local state list for instant UI feedback
            setServices((prev) => prev.filter((s) => s._id !== serviceId));
          } else {
            Swal.fire({
              icon: "error",
              title: "Deletion Failed",
              text: data.message || "Could not delete the care service.",
              confirmButtonColor: "var(--primary)"
            });
          }
        } catch (err) {
          console.error("Delete service action error:", err);
          Swal.fire({
            icon: "error",
            title: "System Error",
            text: "An error occurred while deleting the care service.",
            confirmButtonColor: "var(--primary)"
          });
        }
      }
    });
  };

  // Skeleton Loader structure
  if (loading) {
    return (
      <div className="flex-grow flex flex-col w-full bg-background select-none min-h-screen">
        <section className="w-full bg-gradient-to-r from-primary/10 via-primary/5 to-background border-b border-foreground/10 py-16 px-4">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center gap-3 animate-pulse">
            <div className="h-8 w-64 bg-foreground/10 rounded-none" />
            <div className="h-4 w-96 bg-foreground/10 rounded-none" />
          </div>
        </section>
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 w-full flex-grow flex flex-col gap-8 animate-pulse">
          <div className="h-72 border border-foreground/10 bg-card/60 rounded-none p-6" />
        </section>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-grow flex flex-col w-full bg-background select-none min-h-screen">
        <section className="w-full bg-gradient-to-r from-primary/10 via-primary/5 to-background border-b border-foreground/10 py-16 px-4">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center gap-3">
            <h1 className="font-heading text-3xl font-black text-foreground tracking-tight">Access Control Warning</h1>
          </div>
        </section>
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 w-full flex-grow flex flex-col items-center justify-center text-center gap-4">
          <div className="size-12 rounded-none bg-red-500/10 border border-red-500/20 flex items-center justify-center">
            <Activity className="size-6 text-red-500" />
          </div>
          <div className="flex flex-col gap-2 max-w-md">
            <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">Restricted Administration Node</h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {error || "Business services catalog administration is strictly restricted. Please authenticate with administrator credentials."}
            </p>
          </div>
          <Button onClick={() => window.location.reload()} className="h-9 px-6 text-xs font-bold rounded-none cursor-pointer">
            Re-Authenticate
          </Button>
        </section>
      </div>
    );
  }

  return (
    <div className="flex-grow flex flex-col w-full bg-background select-none min-h-screen">
      
      {/* Page Header */}
      <section className="w-full bg-gradient-to-r from-primary/10 via-primary/5 to-background border-b border-foreground/10 py-16 px-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center gap-3 animate-in fade-in slide-in-from-top-4 duration-500">
          <h1 className="font-heading text-3xl font-black text-foreground sm:text-4xl tracking-tight">
            Manage Care Services
          </h1>
          <p className="text-xs text-muted-foreground max-w-lg leading-relaxed">
            Create new service categories, edit caregiver price metrics, map illustration banners, and update descriptions.
          </p>
        </div>
      </section>

      {/* Main Content Ledger Section */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 w-full flex-grow flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Actions bar header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-foreground/10 pb-4">
          <div className="flex flex-col gap-1 text-left">
            <span className="text-[10px] uppercase font-bold text-muted-foreground/80 tracking-wider">Services Catalog Directory</span>
            <span className="text-xs font-bold text-foreground">Active Care Services: {services.length}</span>
          </div>
          <Button
            onClick={handleAddNew}
            className="h-10 px-5 gap-2 text-xs font-bold rounded-none cursor-pointer transition-transform hover:scale-[1.02] active:scale-95"
          >
            <Plus className="size-4" />
            <span>Add New Service</span>
          </Button>
        </div>

        {/* Services Database Table */}
        <div className="overflow-x-auto w-full border border-foreground/10 bg-card/60 backdrop-blur-sm shadow-sm">
          <table className="w-full text-left text-xs border-collapse divide-y divide-foreground/10">
            <thead>
              <tr className="border-b border-foreground/10 text-muted-foreground text-[10px] uppercase font-bold tracking-wider bg-muted/20">
                <th className="p-4 font-semibold">Image</th>
                <th className="p-4 font-semibold">Title</th>
                <th className="p-4 font-semibold">Category</th>
                <th className="p-4 font-semibold">Base Price</th>
                <th className="p-4 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-foreground/5">
              {services.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground text-[11px]">
                    No care services found. Click &quot;Add New Service&quot; to build the active catalog.
                  </td>
                </tr>
              ) : (
                services.map((service) => {
                  const fallbackImage = "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=600&q=80";
                  
                  return (
                    <tr key={service._id} className="hover:bg-muted/10 transition-colors">
                      {/* Column 1: Image Thumbnail */}
                      <td className="p-4 shrink-0">
                        <div className="relative size-10 overflow-hidden border border-foreground/10 bg-muted rounded-none flex items-center justify-center">
                          <img
                            src={service.imageUrl || fallbackImage}
                            alt={service.title}
                            className="object-cover h-full w-full"
                          />
                        </div>
                      </td>

                      {/* Column 2: Title & Description */}
                      <td className="p-4 flex flex-col gap-0.5 justify-center max-w-sm sm:max-w-md lg:max-w-lg">
                        <span className="font-semibold text-foreground leading-tight text-xs">{service.title}</span>
                        <span className="text-[10px] text-muted-foreground line-clamp-1 mt-0.5 leading-normal">
                          {service.description}
                        </span>
                      </td>

                      {/* Column 3: Category Badge */}
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-[9px] font-bold uppercase tracking-wider text-primary">
                          {service.category}
                        </span>
                      </td>

                      {/* Column 4: Base Rate */}
                      <td className="p-4 font-heading font-black text-primary text-xs">
                        ${service.price}
                      </td>

                      {/* Column 5: Action Triggers */}
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleEdit(service)}
                            aria-label="Edit service"
                            className="size-7 rounded-none cursor-pointer text-muted-foreground hover:text-blue-500 hover:bg-blue-500/10 border border-transparent hover:border-blue-500/20 transition-all"
                          >
                            <Edit className="size-3.5" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleDelete(service._id!)}
                            aria-label="Delete service"
                            className="size-7 rounded-none cursor-pointer text-muted-foreground hover:text-red-500 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all"
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

      </section>

      {/* Stateful Create/Edit Dialog Modal */}
      <ServiceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchServices}
        service={editingService}
      />

    </div>
  );
}
