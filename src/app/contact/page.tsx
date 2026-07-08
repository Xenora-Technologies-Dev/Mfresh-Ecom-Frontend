"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { PageHero } from "@/components/shared/page-hero";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AnimatedSection } from "@/components/shared/animated-section";
import { getSiteSettings } from "@/lib/api/settings";
import { submitLead } from "@/lib/api/leads";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const { data: settings } = useQuery({
    queryKey: ["site-settings"],
    queryFn: getSiteSettings,
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setLoading(true);
    try {
      await submitLead({
        type: "contact",
        contactName: String(fd.get("name")),
        email: String(fd.get("email")),
        businessName: String(fd.get("company") || ""),
        subject: String(fd.get("subject")),
        message: String(fd.get("message")),
      });
      setSubmitted(true);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHero
        title="Contact Us"
        subtitle="We'd love to hear from you. Reach out for support, partnerships, or inquiries."
      />
      <AnimatedSection className="py-14 sm:py-20">
        <div className="container-main">
          <div className="grid gap-10 lg:grid-cols-5">
            <div className="lg:col-span-2 space-y-6">
              <div className="rounded-2xl border border-gray-100 bg-light-gray/50 p-6">
                <h3 className="font-semibold text-dark-gray">Get in Touch</h3>
                <ul className="mt-4 space-y-4 text-sm text-muted">
                  {settings?.support_address && (
                    <li className="flex items-start gap-3">
                      <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                      <span>{settings.support_address}</span>
                    </li>
                  )}
                  {settings?.contact_email && (
                    <li className="flex items-center gap-3">
                      <Mail className="h-5 w-5 shrink-0 text-primary" />
                      <a
                        href={`mailto:${settings.contact_email}`}
                        className="hover:text-primary"
                      >
                        {settings.contact_email}
                      </a>
                    </li>
                  )}
                  {settings?.contact_phone && (
                    <li className="flex items-center gap-3">
                      <Phone className="h-5 w-5 shrink-0 text-primary" />
                      <span>{settings.contact_phone}</span>
                    </li>
                  )}
                </ul>
              </div>
              <p className="text-sm text-muted leading-relaxed">
                Our team typically responds within 24 hours on business days.
              </p>
            </div>

            <div className="lg:col-span-3">
              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
                {submitted ? (
                  <div className="py-12 text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                      <Send className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-dark-gray">
                      Message Sent!
                    </h3>
                    <p className="mt-2 text-muted">
                      Thank you for reaching out. We&apos;ll get back to you soon.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" name="name" required placeholder="Your name" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          required
                          placeholder="you@company.com"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company">Company</Label>
                      <Input id="company" name="company" placeholder="Your company name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        name="subject"
                        required
                        placeholder="How can we help?"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        name="message"
                        required
                        placeholder="Tell us more..."
                        rows={5}
                      />
                    </div>
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full sm:w-auto"
                      disabled={loading}
                    >
                      {loading ? "Sending..." : "Send Message"}
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>
    </>
  );
}
