"use client";

import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AnimatedSection } from "@/components/shared/animated-section";
import { submitLead } from "@/lib/api/leads";

export function RegistrationCTA() {
  return (
    <AnimatedSection className="py-14 sm:py-20">
      <div className="container-main">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary-dark p-8 sm:p-10 shadow-lg shadow-primary/15">
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10" />
            <div className="relative">
              <h3 className="text-2xl font-bold text-white sm:text-3xl">
                Start Buying Today
              </h3>
              <p className="mt-3 max-w-md text-white/85 leading-relaxed">
                Register as a buyer to access wholesale pricing, verified
                suppliers, and streamlined procurement.
              </p>
              <Button
                size="lg"
                variant="secondary"
                className="mt-6"
                asChild
              >
                <Link href="/become-buyer">
                  Become a Buyer
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-secondary to-secondary-dark p-8 sm:p-10">
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10" />
            <div className="relative">
              <h3 className="text-2xl font-bold text-white sm:text-3xl">
                Grow Your Business
              </h3>
              <p className="mt-3 max-w-md text-white/85 leading-relaxed">
                Join as a supplier and reach thousands of B2B buyers across the
                UAE hospitality and retail sectors.
              </p>
              <Button
                size="lg"
                className="mt-6 bg-white text-secondary hover:bg-white/90"
                asChild
              >
                <Link href="/become-seller">
                  Become a Seller
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      await submitLead({
        type: "newsletter",
        contactName: "Newsletter Subscriber",
        email: email.trim(),
      });
      setSubmitted(true);
    } catch {
      toast.error("Subscription failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatedSection className="py-14 sm:py-20 bg-primary-dark">
      <div className="container-main">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary-light/20">
            <Mail className="h-6 w-6 text-primary-light" />
          </div>
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Stay Updated
          </h2>
          <p className="mt-3 text-gray-400 leading-relaxed">
            Get the latest products, supplier updates, and marketplace insights
            delivered to your inbox.
          </p>
          {submitted ? (
            <p className="mt-6 text-primary-light font-medium">
              Thank you for subscribing!
            </p>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-2"
            >
              <Input
                type="email"
                placeholder="Enter your business email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 border-white/10 bg-white/5 text-white placeholder:text-gray-500"
              />
              <Button type="submit" variant="secondary" size="lg" disabled={loading}>
                {loading ? "Subscribing..." : "Subscribe"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </AnimatedSection>
  );
}
