"use client";

import * as React from "react";
import { X, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IService } from "@/types";
import Swal from "sweetalert2";

interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  service?: IService | null;
}

export function ServiceModal({ isOpen, onClose, onSuccess, service }: ServiceModalProps) {
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [category, setCategory] = React.useState("Baby Care");
  const [price, setPrice] = React.useState("");
  const [imageUrl, setImageUrl] = React.useState("");
  const [saving, setSaving] = React.useState(false);

  // Pre-populate fields on edit mode or reset on create mode
  React.useEffect(() => {
    if (isOpen) {
      if (service) {
        setTitle(service.title);
        setDescription(service.description);
        setCategory(service.category);
        setPrice(service.price.toString());
        setImageUrl(service.imageUrl || "");
      } else {
        setTitle("");
        setDescription("");
        setCategory("Baby Care");
        setPrice("");
        setImageUrl("");
      }
    }
  }, [service, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim() || !category || price === "") {
      Swal.fire({
        icon: "warning",
        title: "Validation Error",
        text: "Please complete all required fields.",
        confirmButtonColor: "var(--primary)"
      });
      return;
    }

    if (isNaN(Number(price)) || Number(price) < 0) {
      Swal.fire({
        icon: "warning",
        title: "Validation Error",
        text: "Price must be a valid positive number.",
        confirmButtonColor: "var(--primary)"
      });
      return;
    }

    setSaving(true);

    try {
      const url = service 
        ? `/api/admin/services/${service._id}`
        : "/api/admin/services";
      
      const method = service ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          category,
          price: Number(price),
          imageUrl
        })
      });

      const data = await res.json();

      if (data.success) {
        Swal.fire({
          icon: "success",
          title: service ? "Service Updated" : "Service Added",
          text: data.message || "Your care catalog changes have been saved.",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true
        });
        onSuccess();
        onClose();
      } else {
        Swal.fire({
          icon: "error",
          title: "Execution Error",
          text: data.message || "Failed to submit care service specifications.",
          confirmButtonColor: "var(--primary)"
        });
      }
    } catch (err) {
      console.error("Service form submission error:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An unexpected system error occurred during catalog submission.",
        confirmButtonColor: "var(--primary)"
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      
      {/* Modal Dialog Card */}
      <div className="bg-card border border-foreground/10 p-6 max-w-md w-full animate-in zoom-in-95 duration-200 rounded-none relative text-left shadow-lg">
        
        {/* Close Button */}
        <button 
          onClick={onClose} 
          aria-label="Close dialog"
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
        >
          <X className="size-4" />
        </button>

        {/* Modal Header */}
        <div className="flex flex-col gap-1 mb-6 border-b border-foreground/10 pb-4">
          <h2 className="font-heading text-sm font-black uppercase tracking-wider text-foreground">
            {service ? "Edit Service Settings" : "Add New Care Service"}
          </h2>
          <p className="text-[10px] text-muted-foreground leading-normal">
            Configure the name, categorizations, pricing metrics, and illustration mappings.
          </p>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          {/* Title Field */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="title" className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
              Service Title *
            </Label>
            <Input
              id="title"
              type="text"
              placeholder="e.g. Premium Babysitting Support"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="rounded-none border-foreground/10 text-xs h-9"
              required
            />
          </div>

          {/* Category Select */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="category" className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
              Service Category *
            </Label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full h-9 rounded-none border border-foreground/10 bg-background text-xs px-3 focus:outline-none focus:ring-1 focus:ring-primary/20 focus:border-primary/45 transition-all text-foreground"
            >
              <option value="Baby Care">Baby Care</option>
              <option value="Elderly Service">Elderly Service</option>
              <option value="Sick People Service">Sick People Service</option>
            </select>
          </div>

          {/* Price Field */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="price" className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
              Price Rate ($ / period) *
            </Label>
            <Input
              id="price"
              type="number"
              min={0}
              placeholder="e.g. 25"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="rounded-none border-foreground/10 text-xs h-9"
              required
            />
          </div>

          {/* Image URL Field */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="imageUrl" className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
              Illustration Image URL
            </Label>
            <Input
              id="imageUrl"
              type="text"
              placeholder="https://images.unsplash.com/..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="rounded-none border-foreground/10 text-xs h-9"
            />
          </div>

          {/* Description Field */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="description" className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
              Detailed Description *
            </Label>
            <textarea
              id="description"
              rows={3}
              placeholder="Enter a descriptive summary of care support tasks..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-none border border-foreground/10 bg-background text-xs p-3 focus:outline-none focus:ring-1 focus:ring-primary/20 focus:border-primary/45 transition-all text-foreground resize-none"
              required
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 mt-4 border-t border-foreground/10 pt-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={saving}
              className="rounded-none h-9 text-[10px] uppercase font-bold cursor-pointer px-4"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={saving}
              className="rounded-none h-9 text-[10px] uppercase font-bold cursor-pointer gap-1.5 px-4"
            >
              {saving ? (
                <>
                  <Loader2 className="size-3 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="size-3" />
                  <span>Save Catalog</span>
                </>
              )}
            </Button>
          </div>

        </form>

      </div>
    </div>
  );
}
export default ServiceModal;
