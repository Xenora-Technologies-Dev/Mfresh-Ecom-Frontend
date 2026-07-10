"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Mail, Phone } from "lucide-react";
import { getSiteSettings } from "@/lib/api/settings";

export function ContactCTABar() {
  const { data: settings } = useQuery({
    queryKey: ["site-settings"],
    queryFn: getSiteSettings,
    staleTime: 5 * 60 * 1000,
  });

  const phone = settings?.contact_phone ?? "+971 4 337 8629";
  const email = settings?.contact_email ?? "customerservice@mfresh.com";

  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-secondary via-secondary to-secondary-dark text-white">
      <div className="container-main flex flex-col items-center justify-between gap-4 py-5 sm:flex-row sm:py-6">
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-8">
          <a
            href={`tel:${phone.replace(/\s/g, "")}`}
            className="inline-flex items-center gap-2 text-sm font-medium hover:underline sm:text-base"
          >
            <Phone className="h-4 w-4 shrink-0" />
            {phone}
          </a>
          <a
            href={`mailto:${email}`}
            className="inline-flex items-center gap-2 text-sm font-medium hover:underline sm:text-base"
          >
            <Mail className="h-4 w-4 shrink-0" />
            {email}
          </a>
        </div>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 rounded-lg border-2 border-white/90 bg-white/10 px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-white hover:text-secondary"
        >
          Get in touch
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
