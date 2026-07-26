"use client";

import { useState } from "react";
import { X, Upload, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CountrySelect } from "@/components/auth/country-select";
import { uploadImage, storageUrl } from "@/lib/api/client";
import { createSellerListing } from "@/lib/api/orders";
import type { PortalUser } from "@/lib/auth/roles";

const MOQ_UNITS = ["Kg", "Ton", "Carton", "Pallet", "Container", "Unit"];

interface SellProductModalProps {
  open: boolean;
  onClose: () => void;
  user: PortalUser;
  clerkUserId: string;
  onCreated?: () => void;
}

export function SellProductModal({
  open,
  onClose,
  user,
  clerkUserId,
  onCreated,
}: SellProductModalProps) {
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [origin, setOrigin] = useState("");
  const [price, setPrice] = useState("");
  const [moq, setMoq] = useState("");
  const [moqUnit, setMoqUnit] = useState(MOQ_UNITS[0]);
  const [imagePath, setImagePath] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (!open) return null;

  const reset = () => {
    setProductName("");
    setDescription("");
    setOrigin("");
    setPrice("");
    setMoq("");
    setMoqUnit(MOQ_UNITS[0]);
    setImagePath("");
    setImagePreview("");
  };

  const handleFile = async (file: File) => {
    setUploading(true);
    try {
      const result = await uploadImage(file, "DISPLAY", true);
      setImagePath(result.urls.display);
      setImagePreview(storageUrl(result.urls.display));
    } catch {
      toast.error("Image upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName.trim()) {
      toast.error("Product name is required.");
      return;
    }

    setSubmitting(true);
    try {
      await createSellerListing({
        clerkUserId,
        userName: user.name,
        userEmail: user.email,
        userPhone: user.whatsapp,
        userCompany: user.company,
        userCountry: user.country,
        productName: productName.trim(),
        productDescription: description.trim() || undefined,
        productOrigin: origin.trim() || undefined,
        productImage: imagePath || undefined,
        productMoq: moq ? Number(moq) : undefined,
        productMoqUnit: moq ? moqUnit : undefined,
        productPrice: price ? Number(price) : undefined,
      });
      toast.success("Listing submitted for verification.");
      reset();
      onCreated?.();
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not submit listing.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/45"
        aria-label="Close"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal
        aria-labelledby="sell-product-title"
        className="relative z-10 max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 id="sell-product-title" className="text-xl font-bold text-dark-gray">
            List a product
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-muted hover:bg-light-gray"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="sp-name">Product name *</Label>
            <Input
              id="sp-name"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="sp-desc">Description</Label>
            <Textarea
              id="sp-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-1.5">
            <Label>Origin / country</Label>
            <CountrySelect value={origin} onChange={setOrigin} />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="sp-price">Price (USD)</Label>
              <Input
                id="sp-price"
                type="number"
                min={0}
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="sp-moq">MOQ</Label>
              <Input
                id="sp-moq"
                type="number"
                min={1}
                value={moq}
                onChange={(e) => setMoq(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="sp-moq-unit">MOQ unit</Label>
              <select
                id="sp-moq-unit"
                value={moqUnit}
                onChange={(e) => setMoqUnit(e.target.value)}
                className="flex h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
              >
                {MOQ_UNITS.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Product image</Label>
            <div className="flex items-center gap-3">
              <label className="flex h-20 w-28 shrink-0 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-white text-muted transition-colors hover:border-primary/40">
                {imagePreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-full w-full rounded-xl object-cover"
                  />
                ) : uploading ? (
                  <span className="text-xs">Uploading…</span>
                ) : (
                  <>
                    <Upload className="mb-1 h-5 w-5" />
                    <span className="text-xs">Upload</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={uploading}
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) void handleFile(f);
                  }}
                />
              </label>
              {!imagePreview && !uploading && (
                <p className="flex items-center gap-1.5 text-xs text-muted">
                  <ImageIcon className="h-3.5 w-3.5" />
                  JPG or PNG, up to 5MB
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting || uploading}>
              {submitting ? "Submitting…" : "Submit listing"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
