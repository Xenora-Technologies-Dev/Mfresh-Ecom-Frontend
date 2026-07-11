"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Droplets, Leaf, Send, Truck } from "lucide-react";
import { PageHero } from "@/components/shared/page-hero";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AnimatedSection } from "@/components/shared/animated-section";
import { submitLead } from "@/lib/api/leads";
import { cn } from "@/lib/utils";

const INTEREST_OPTIONS = [
  { value: "mfresh-food", label: "M Fresh — Food brand" },
  { value: "mr-fresh-cleaning", label: "MR Fresh — Cleaning liquids" },
  { value: "both", label: "Both brands" },
] as const;

export default function DistributionPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [interest, setInterest] = useState<string>("both");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const interestLabel =
      INTEREST_OPTIONS.find((o) => o.value === interest)?.label ?? interest;

    setLoading(true);
    try {
      await submitLead({
        type: "distribution",
        contactName: String(fd.get("name")),
        email: String(fd.get("email")),
        phone: String(fd.get("phone") || ""),
        businessName: String(fd.get("company") || ""),
        country: String(fd.get("country") || ""),
        businessType: interest,
        subject: `Distribution enquiry: ${interestLabel}`,
        message: JSON.stringify({
          kind: "distribution",
          interest,
          interestLabel,
          territory: String(fd.get("territory") || ""),
          note: String(fd.get("message") || ""),
        }),
      });
      setSubmitted(true);
      toast.success("Request submitted — our team will follow up soon.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to submit");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHero
        title="Distribution"
        subtitle="Partner with M Fresh and MR Fresh across food and cleaning categories."
      />

      <AnimatedSection className="py-12 sm:py-16">
        <div className="container-main space-y-12">
          <div className="grid gap-6 lg:grid-cols-2">
            <article className="rounded-2xl border border-primary/15 bg-primary-muted/40 p-6 sm:p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white">
                <Leaf className="h-6 w-6" />
              </div>
              <h2 className="mt-4 text-xl font-bold text-dark-gray">M Fresh</h2>
              <p className="mt-1 text-sm font-medium text-primary">Food brand</p>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                Premium wholesale foods for HORECA, retailers, and distributors —
                produce, proteins, pantry, and specialty lines sourced through our
                verified supply network. Ideal partners stock reliable volume with
                clear cold-chain and quality standards.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-dark-gray/80">
                <li className="flex gap-2">
                  <Truck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  Regional coverage across UAE, Singapore &amp; key trade hubs
                </li>
                <li className="flex gap-2">
                  <Truck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  Consistent SKUs with wholesale MOQs and trade packaging
                </li>
              </ul>
            </article>

            <article className="rounded-2xl border border-secondary/15 bg-secondary-muted/50 p-6 sm:p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-white">
                <Droplets className="h-6 w-6" />
              </div>
              <h2 className="mt-4 text-xl font-bold text-dark-gray">MR Fresh</h2>
              <p className="mt-1 text-sm font-medium text-secondary">
                Cleaning liquid brand
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                Professional cleaning liquids for kitchens, hospitality, and
                facilities — formulated for everyday commercial use. We work with
                distributors who can place MR Fresh next to foodservice and
                facility-care ranges.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-dark-gray/80">
                <li className="flex gap-2">
                  <Truck className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                  Hospitality &amp; commercial cleaning channels
                </li>
                <li className="flex gap-2">
                  <Truck className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                  Bulk and retail-ready pack formats for trade partners
                </li>
              </ul>
            </article>
          </div>

          <div className="mx-auto max-w-2xl rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8">
            <h3 className="text-lg font-bold text-dark-gray">
              Request distribution details
            </h3>
            <p className="mt-1 text-sm text-muted">
              Tell us about your territory and interest — we&apos;ll share pack
              lists, MOQs, and next steps.
            </p>

            {submitted ? (
              <div className="py-12 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <Send className="h-6 w-6 text-primary" />
                </div>
                <h4 className="text-xl font-semibold text-dark-gray">
                  Request received
                </h4>
                <p className="mt-2 text-sm text-muted">
                  Our distribution team will contact you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div className="space-y-2">
                  <Label>I&apos;m interested in</Label>
                  <div className="grid gap-2 sm:grid-cols-3">
                    {INTEREST_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setInterest(opt.value)}
                        className={cn(
                          "rounded-xl border px-3 py-2.5 text-left text-xs font-medium transition sm:text-sm",
                          interest === opt.value
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border bg-fresh-mint/40 text-dark-gray hover:border-primary/30",
                        )}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="name">Contact name</Label>
                    <Input id="name" name="name" required />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" required />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" name="phone" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="company">Company</Label>
                    <Input id="company" name="company" />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="country">Country</Label>
                    <Input id="country" name="country" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="territory">Target territory / cities</Label>
                    <Input id="territory" name="territory" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="message">Notes</Label>
                  <Textarea
                    id="message"
                    name="message"
                    rows={4}
                    placeholder="Channels you cover, current brands, expected volumes…"
                  />
                </div>

                <Button type="submit" disabled={loading} className="w-full sm:w-auto">
                  {loading ? "Submitting…" : "Submit request"}
                </Button>
              </form>
            )}
          </div>
        </div>
      </AnimatedSection>
    </>
  );
}
