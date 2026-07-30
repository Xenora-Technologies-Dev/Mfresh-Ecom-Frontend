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

  const categoryLinks = categories.slice(0, 5).map((cat) => ({
    href: `/categories/${cat.slug}`,
    label: cat.name,
  }));

  return (
    <footer className="relative overflow-hidden border-t border-border bg-gradient-to-b from-secondary to-[#1a1f4a] text-white">
      <div className="container-main relative py-5 sm:py-6 lg:py-7">
        <div className="grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4 lg:gap-6">
          <div className="space-y-2.5 sm:col-span-2 lg:col-span-1">
            <Logo variant="footer" />
            <p className="max-w-sm text-xs leading-relaxed text-white/65 sm:text-[13px]">
              {SITE_TAGLINE}. Wholesale food marketplace for buyers worldwide.
            </p>
            <div className="space-y-1.5 text-xs text-white/65 sm:text-[13px]">
              {address && (
                <p className="flex items-center gap-2">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-white/10">
                    <MapPin className="h-3 w-3 text-primary-light" />
                  </span>
                  <span className="leading-snug">{address}</span>
                </p>
              )}
              {email && (
                <p className="flex items-center gap-2">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-white/10">
                    <Mail className="h-3 w-3 text-primary-light" />
                  </span>
                  <a href={`mailto:${email}`} className="hover:text-white">
                    {email}
                  </a>
                </p>
              )}
              {phone && (
                <p className="flex items-center gap-2">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-white/10">
                    <Phone className="h-3 w-3 text-primary-light" />
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
        </div>

        <div className="mt-5 flex flex-col gap-2.5 border-t border-white/10 pt-4 sm:mt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-white/55">
            © {new Date().getFullYear()} {siteName}. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-4">
            {FOOTER_LINKS.legal.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs text-white/55 transition-colors hover:text-white"
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
      <h3 className="mb-2.5 text-[11px] font-semibold uppercase tracking-wider text-white/85">
        {title}
      </h3>
      <ul className="space-y-1.5">
        {links.map((link) => {
          const external =
            link.href.startsWith("http") || link.href.includes("/login");
          return (
            <li key={link.href}>
              {external ? (
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-white/60 transition-colors hover:text-primary-light sm:text-[13px]"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  href={link.href}
                  className="text-xs text-white/60 transition-colors hover:text-primary-light sm:text-[13px]"
                >
                  {link.label}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
