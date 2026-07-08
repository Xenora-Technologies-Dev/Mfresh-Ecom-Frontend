"use client";

import {
  Globe,
  ShieldCheck,
  TrendingDown,
  Truck,
  type LucideIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { getHomepageSections } from "@/lib/api/content";
import { AnimatedSection } from "@/components/shared/animated-section";
import { SectionHeader } from "@/components/shared/section-header";

const iconMap: Record<string, LucideIcon> = {
  ShieldCheck,
  Globe,
  TrendingDown,
  Truck,
};

export function WhyChooseUsSection() {
  const { data: sections = [] } = useQuery({
    queryKey: ["homepage-sections"],
    queryFn: getHomepageSections,
  });

  const section = sections.find((s) => s.key === "why_choose_us");
  const items = section?.config?.items ?? [];

  if (!items.length) return null;

  return (
    <AnimatedSection className="py-14 sm:py-20 bg-surface">
      <div className="container-main">
        <SectionHeader
          title={section?.title ?? "Why Choose MFresh"}
          subtitle={
            section?.subtitle ??
            "Verified trade, secure payments, and quality at every step"
          }
          align="center"
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => {
            const Icon = iconMap[item.icon ?? ""] ?? ShieldCheck;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group rounded-2xl border border-border bg-fresh-mint/50 p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-primary-light/30 hover:bg-surface hover:shadow-md"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-dark-gray">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </AnimatedSection>
  );
}
