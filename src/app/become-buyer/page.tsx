"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";
import { PageHero } from "@/components/shared/page-hero";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AnimatedSection } from "@/components/shared/animated-section";
import { submitLead } from "@/lib/api/leads";

const benefits = [
  "Access wholesale pricing from verified suppliers",
  "Browse premium food products across categories",
  "Transparent MOQs and competitive rates",
  "Dedicated account support",
];

export default function BecomeBuyerPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setLoading(true);
    try {
      await submitLead({
        type: "buyer",
        contactName: String(fd.get("contact")),
        email: String(fd.get("email")),
        businessName: String(fd.get("business")),
        businessType: String(fd.get("type")),
        phone: String(fd.get("phone")),
        message: String(fd.get("notes") || ""),
      });
      setSubmitted(true);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to submit application");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHero
        title="Become a Buyer"
        subtitle="Register your business and unlock premium wholesale food sourcing"
      />
      <AnimatedSection className="py-14 sm:py-20">
        <div className="container-main">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 className="text-2xl font-bold text-dark-gray">
                Why register as a buyer?
              </h2>
              <ul className="mt-6 space-y-4">
                {benefits.map((b) => (
                  <li key={b} className="flex items-start gap-3 text-muted">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
              {submitted ? (
                <div className="py-8 text-center">
                  <CheckCircle2 className="mx-auto h-14 w-14 text-primary" />
                  <h3 className="mt-4 text-xl font-semibold">Application Received</h3>
                  <p className="mt-2 text-muted">
                    We&apos;ll review your application and contact you within 48 hours.
                  </p>
                  <Button className="mt-6" asChild>
                    <Link href="/products">Browse Products</Link>
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <h3 className="text-lg font-semibold text-dark-gray">
                    Buyer Registration
                  </h3>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="business">Business Name *</Label>
                      <Input id="business" name="business" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="type">Business Type *</Label>
                      <Input
                        id="type"
                        name="type"
                        required
                        placeholder="Hotel, Restaurant, Retail..."
                      />
                    </div>
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="contact">Contact Person *</Label>
                      <Input id="contact" name="contact" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input id="email" name="email" type="email" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      placeholder="+971..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes">Tell us about your needs</Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      rows={4}
                      placeholder="Product categories, volume, etc."
                    />
                  </div>
                  <Button type="submit" size="lg" className="w-full" disabled={loading}>
                    {loading ? "Submitting..." : "Submit Application"}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </AnimatedSection>
    </>
  );
}
