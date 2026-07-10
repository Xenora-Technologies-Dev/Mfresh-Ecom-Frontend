"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Mail, MapPin, Phone } from "lucide-react";
import { FOOTER_LINKS, SITE_NAME, SITE_TAGLINE } from "@/lib/constants";
import { getSiteSettings } from "@/lib/api/settings";
import { getCategories } from "@/lib/api/categories";
import { Logo } from "@/components/shared/logo";

export function Footer() {
  const { data: settings } = useQuery({
    queryKey: ["site-settings"],
    queryFn: getSiteSettings,
    staleTime: 5 * 60 * 1000,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["categories", "footer"],
    queryFn: getCategories,
    staleTime: 10 * 60 * 1000,
  });

  const siteName = settings?.site_name || SITE_NAME;
  const email = settings?.contact_email;
  const phone = settings?.contact_phone;
  const address = settings?.support_address;

  const categoryLinks = categories.slice(0, 6).map((cat) => ({
    href: `/categories/${cat.slug}`,
    label: cat.name,
  }));

  return (
    <footer className="relative overflow-hidden border-t border-border bg-gradient-to-b from-dark-gray to-[#1a2a22] text-white">
      <div className="container-main relative py-14 lg:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="space-y-5 sm:col-span-2 lg:col-span-2">
            <Logo className="[&_span]:text-white [&_svg_path]:text-secondary" />
            <p className="max-w-sm text-sm leading-relaxed text-white/70">
              {SITE_TAGLINE}. Your trusted wholesale food marketplace connecting
              buyers with premium products worldwide.
            </p>
            <div className="space-y-2.5 text-sm text-white/70">
              {address && (
                <p className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
                    <MapPin className="h-4 w-4 text-primary-light" />
                  </span>
                  {address}
                </p>
              )}
              {email && (
                <p className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
                    <Mail className="h-4 w-4 text-primary-light" />
                  </span>
                  <a href={`mailto:${email}`} className="hover:text-white">
                    {email}
                  </a>
                </p>
              )}
              {phone && (
                <p className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
                    <Phone className="h-4 w-4 text-primary-light" />
                  </span>
                  {phone}
                </p>
              )}
            </div>
          </div>

          {categoryLinks.length > 0 && (
            <FooterColumn title="Categories" links={categoryLinks} />
          )}
          <FooterColumn title="Marketplace" links={FOOTER_LINKS.marketplace} />
          <FooterColumn title="Company" links={FOOTER_LINKS.company} />
          <FooterColumn title="Join Us" links={FOOTER_LINKS.join} />
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-white/60">
            © {new Date().getFullYear()} {siteName}. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-6">
            {FOOTER_LINKS.legal.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-white/60 transition-colors hover:text-white"
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
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/90">
        {title}
      </h3>
      <ul className="space-y-2.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-white/60 transition-colors hover:text-primary-light"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
