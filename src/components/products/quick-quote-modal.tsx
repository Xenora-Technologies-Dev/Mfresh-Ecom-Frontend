"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitQuickQuote } from "@/lib/api/leads";
import type { Product } from "@/types";

const DIAL_CODES = [
  { code: "+971", label: "UAE (+971)" },
  { code: "+91", label: "India (+91)" },
  { code: "+65", label: "Singapore (+65)" },
  { code: "+966", label: "KSA (+966)" },
  { code: "+974", label: "Qatar (+974)" },
  { code: "+968", label: "Oman (+968)" },
  { code: "+973", label: "Bahrain (+973)" },
  { code: "+965", label: "Kuwait (+965)" },
  { code: "+1", label: "US (+1)" },
  { code: "+44", label: "UK (+44)" },
  { code: "+61", label: "AU (+61)" },
];

interface QuickQuoteModalProps {
  product: Product;
  open: boolean;
  onClose: () => void;
}

export function QuickQuoteModal({ product, open, onClose }: QuickQuoteModalProps) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    companyName: "",
    email: "",
    dialCode: "+971",
    phone: "",
    quantity: "",
    targetPrice: "",
    message: "",
  });

  if (!open) return null;

  const update = (key: keyof typeof form, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !form.firstName.trim() ||
      !form.lastName.trim() ||
      !form.companyName.trim() ||
      !form.email.trim() ||
      !form.phone.trim() ||
      !form.quantity.trim() ||
      !form.targetPrice.trim()
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    try {
      await submitQuickQuote({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        companyName: form.companyName.trim(),
        email: form.email.trim(),
        dialCode: form.dialCode,
        phone: form.phone.trim(),
        quantity: form.quantity.trim(),
        targetPrice: form.targetPrice.trim(),
        message: form.message.trim() || undefined,
        product: {
          id: product.id,
          name: product.name,
          slug: product.slug,
          price: product.price,
          currency: product.currency,
          moq: product.moq,
          moqUnit: product.moqUnit,
          country: product.country,
          image: product.image || product.displayImage || product.mainImage || "",
          categoryName: product.categoryName,
        },
      });
      toast.success("Quote request sent. Our team will contact you shortly.");
      onClose();
      setForm({
        firstName: "",
        lastName: "",
        companyName: "",
        email: "",
        dialCode: "+971",
        phone: "",
        quantity: "",
        targetPrice: "",
        message: "",
      });
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not send quote. Please try again.",
      );
    } finally {
      setLoading(false);
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
        aria-labelledby="quick-quote-title"
        className="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 id="quick-quote-title" className="text-xl font-bold text-dark-gray">
            Quick Quote
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

        <p className="mb-4 text-sm text-muted">
          Request a quote for <span className="font-semibold text-dark-gray">{product.name}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="qq-first">First Name *</Label>
              <Input
                id="qq-first"
                value={form.firstName}
                onChange={(e) => update("firstName", e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="qq-last">Last Name *</Label>
              <Input
                id="qq-last"
                value={form.lastName}
                onChange={(e) => update("lastName", e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="qq-company">Company Name *</Label>
              <Input
                id="qq-company"
                value={form.companyName}
                onChange={(e) => update("companyName", e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="qq-email">Email *</Label>
              <Input
                id="qq-email"
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="qq-code">Code *</Label>
              <select
                id="qq-code"
                value={form.dialCode}
                onChange={(e) => update("dialCode", e.target.value)}
                className="flex h-10 w-full rounded-lg border border-border bg-white px-3 text-sm"
              >
                {DIAL_CODES.map((d) => (
                  <option key={d.code} value={d.code}>
                    {d.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="qq-phone">Phone Number *</Label>
              <Input
                id="qq-phone"
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="qq-qty">Quantity (Tonne) *</Label>
              <Input
                id="qq-qty"
                value={form.quantity}
                onChange={(e) => update("quantity", e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="qq-price">Target Price ($) *</Label>
              <Input
                id="qq-price"
                value={form.targetPrice}
                onChange={(e) => update("targetPrice", e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="qq-msg">Message (Optional)</Label>
              <Textarea
                id="qq-msg"
                value={form.message}
                onChange={(e) => update("message", e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Close
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Sending…" : "Send Quote"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
