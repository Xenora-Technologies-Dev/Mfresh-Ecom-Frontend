"use client";

import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { Mail, MapPin, Phone } from "lucide-react";
import { FOOTER_LINKS, SITE_NAME, SITE_TAGLINE } from "@/lib/constants";
import { getSiteSettings } from "@/lib/api/settings";

export function Footer() {
  const { data: settings } = useQuery({
    queryKey: ["site-settings"],
    queryFn: getSiteSettings,
    staleTime: 5 * 60 * 1000,
  });

  const siteName = settings?.site_name || SITE_NAME;
  const email = settings?.contact_email;
  const phone = settings?.contact_phone;
  const address = settings?.support_address;

  return (
    <footer className="relative overflow-hidden border-t border-border bg-gradient-to-b from-fresh-mint to-light-gray">
      <div className="container-main relative py-14 lg:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="space-y-5 sm:col-span-2 lg:col-span-2">
            <div className="inline-block rounded-2xl border border-border bg-surface p-3 shadow-sm">
              <Image
                src="/logo.png"
                alt={siteName}
                width={160}
                height={56}
                className="h-12 w-auto object-contain"
              />
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-muted">
              {SITE_TAGLINE}. Your trusted wholesale food marketplace connecting
              buyers and verified suppliers worldwide.
            </p>
            <div className="space-y-2.5 text-sm text-muted">
              {address && (
                <p className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-muted">
                    <MapPin className="h-4 w-4 text-primary" />
                  </span>
                  {address}
                </p>
              )}
              {email && (
                <p className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-muted">
                    <Mail className="h-4 w-4 text-primary" />
                  </span>
                  <a href={`mailto:${email}`} className="hover:text-primary">
                    {email}
                  </a>
                </p>
              )}
              {phone && (
                <p className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-muted">
                    <Phone className="h-4 w-4 text-primary" />
                  </span>
                  {phone}
                </p>
              )}
            </div>
          </div>

          <FooterColumn title="Marketplace" links={FOOTER_LINKS.marketplace} />
          <FooterColumn title="Company" links={FOOTER_LINKS.company} />
          <FooterColumn title="Join Us" links={FOOTER_LINKS.join} />
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-border pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted">
            © {new Date().getFullYear()} {siteName}. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-6">
            {FOOTER_LINKS.legal.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-muted transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: readonly { href: string; label: string }[];
}) {
  return (
    <div>
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-dark-gray">
        {title}
      </h3>
      <ul className="space-y-2.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-muted transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
