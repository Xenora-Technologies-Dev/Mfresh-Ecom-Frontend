"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { CATEGORY_PILLARS } from "@/lib/demo-data";
import { AnimatedSection } from "@/components/shared/animated-section";
import { SectionHeader } from "@/components/shared/section-header";

export function CategoryPillarsSection() {
  return (
    <AnimatedSection className="py-12 sm:py-16 fresh-section">
      <div className="container-main">
        <SectionHeader
          title="Shop by Category"
          subtitle="Three core pillars — aquatic, land, and plant-based wholesale food"
          href="/categories"
        />
        <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-3">
          {CATEGORY_PILLARS.map((pillar) => (
            <Link
              key={pillar.id}
              href={pillar.href}
              className="group relative aspect-[16/10] overflow-hidden rounded-2xl shadow-md sm:aspect-[4/3]"
            >
              <Image
                src={pillar.image}
                alt={pillar.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 md:p-6">
                <span className="inline-flex rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                  {pillar.count}
                </span>
                <h3 className="mt-2 text-lg font-bold text-white sm:text-xl md:text-2xl">
                  {pillar.title}
                </h3>
                <p className="mt-1 line-clamp-2 text-xs text-white/80 sm:text-sm">
                  {pillar.subtitle}
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary-light transition-all group-hover:gap-2">
                  Explore
                  <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
