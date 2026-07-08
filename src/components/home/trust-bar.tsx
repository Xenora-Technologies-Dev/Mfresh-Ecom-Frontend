"use client";

import { BadgeCheck, Globe, Lock, ShieldCheck } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getHomepageSections } from "@/lib/api/content";

const iconMap = {
  ShieldCheck,
  Lock,
  BadgeCheck,
  Globe,
} as const;

export function TrustBar() {
  const { data: sections = [] } = useQuery({
    queryKey: ["homepage-sections"],
    queryFn: getHomepageSections,
  });

  const section = sections.find((s) => s.key === "trust_bar");
  const items = section?.config?.items ?? [];

  if (!items.length) return null;

  return (
    <section className="border-b border-border bg-gradient-to-r from-primary-muted/80 via-fresh-mint to-surface">
      <div className="container-main py-6">
        <div className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-4">
          {items.map((item) => {
            const Icon =
              iconMap[item.icon as keyof typeof iconMap] ?? ShieldCheck;
            return (
              <div
                key={item.title}
                className="flex items-start gap-2.5 rounded-xl border border-border/60 bg-surface/90 p-3 shadow-sm backdrop-blur-sm sm:gap-3 sm:p-4"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary sm:h-10 sm:w-10">
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-dark-gray sm:text-sm">
                    {item.title}
                  </p>
                  <p className="mt-0.5 line-clamp-2 text-[11px] leading-relaxed text-muted sm:text-xs">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
