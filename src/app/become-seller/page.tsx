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
  "Reach B2B buyers on a verified marketplace",
  "Showcase your full product catalog",
  "Manage inquiries in one place",
  "Verified supplier badge for trust",
  "Featured listing opportunities",
];

export default function BecomeSellerPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setLoading(true);
    try {
      await submitLead({
        type: "seller",
        contactName: String(fd.get("contact")),
        email: String(fd.get("email")),
        businessName: String(fd.get("company")),
        businessType: String(fd.get("categories")),
        country: String(fd.get("country")),
        message: String(fd.get("about") || ""),
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
        title="Become a Seller"
        subtitle="Join our marketplace and grow your B2B food business"
      />
      <AnimatedSection className="py-14 sm:py-20">
        <div className="container-main">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 className="text-2xl font-bold text-dark-gray">
                Why sell on MFresh?
              </h2>
              <ul className="mt-6 space-y-4">
                {benefits.map((b) => (
                  <li key={b} className="flex items-start gap-3 text-muted">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-secondary" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
              {submitted ? (
                <div className="py-8 text-center">
                  <CheckCircle2 className="mx-auto h-14 w-14 text-secondary" />
                  <h3 className="mt-4 text-xl font-semibold">Application Received</h3>
                  <p className="mt-2 text-muted">
                    Our team will review your supplier application within 3-5 business days.
                  </p>
                  <Button className="mt-6" variant="secondary" asChild>
                    <Link href="/">Back to Home</Link>
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <h3 className="text-lg font-semibold text-dark-gray">
                    Supplier Registration
                  </h3>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="company">Company Name *</Label>
                      <Input id="company" name="company" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">Country *</Label>
                      <Input id="country" name="country" required />
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
                    <Label htmlFor="categories">Product Categories *</Label>
                    <Input
                      id="categories"
                      name="categories"
                      required
                      placeholder="Produce, Dairy, Seafood..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="about">About Your Business</Label>
                    <Textarea id="about" name="about" rows={4} />
                  </div>
                  <Button
                    type="submit"
                    size="lg"
                    variant="secondary"
                    className="w-full"
                    disabled={loading}
                  >
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
