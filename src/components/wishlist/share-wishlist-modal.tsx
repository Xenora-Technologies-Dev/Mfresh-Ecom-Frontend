"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { shareWishlist } from "@/lib/api/leads";
import type { Product } from "@/types";

interface ShareWishlistModalProps {
  open: boolean;
  onClose: () => void;
  products: Product[];
}

export function ShareWishlistModal({
  open,
  onClose,
  products,
}: ShareWishlistModalProps) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
    company: "",
  });
  const [sending, setSending] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim()) {
      toast.error("Please fill in name, email, and phone number.");
      return;
    }
    setSending(true);
    try {
      await shareWishlist({
        contactName: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        country: form.country.trim(),
        companyName: form.company.trim(),
        products: products.map((p) => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          price: p.price,
          currency: p.currency,
          country: p.country,
          image: p.image,
        })),
      });
      toast.success("Your wishlist has been shared with M Fresh!");
      onClose();
      setForm({ name: "", email: "", phone: "", country: "", company: "" });
    } catch {
      toast.error("Could not send your wishlist. Please try again later.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h3 className="text-lg font-bold text-dark-gray">Share with M Fresh</h3>
        <p className="mt-1 text-sm text-muted">
          We&apos;ll receive your wishlist and contact you shortly.
        </p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="wishlist-name">Name *</Label>
            <Input
              id="wishlist-name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="wishlist-email">Email *</Label>
            <Input
              id="wishlist-email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="wishlist-phone">Phone Number *</Label>
            <Input
              id="wishlist-phone"
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="wishlist-country">Country</Label>
            <Input
              id="wishlist-country"
              value={form.country}
              onChange={(e) => setForm({ ...form, country: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="wishlist-company">Company Name</Label>
            <Input
              id="wishlist-company"
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={sending}>
              {sending ? "Sending..." : "Send"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
