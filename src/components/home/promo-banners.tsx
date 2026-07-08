"use client";

import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { getPromoBanners } from "@/lib/api/banners";
import { PLACEHOLDER_IMAGE } from "@/lib/api/client";
import { AnimatedSection } from "@/components/shared/animated-section";

export function PromoBannersSection() {
  const { data: banners = [] } = useQuery({
    queryKey: ["banners", "promo"],
    queryFn: getPromoBanners,
  });

  if (!banners.length) return null;

  return (
    <AnimatedSection className="py-10 sm:py-14 fresh-section-alt">
      <div className="container-main">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          {banners.map((banner) => (
            <Link
              key={banner.id}
              href={banner.ctaLink}
              className="group marketplace-card overflow-hidden"
            >
              <div className="relative aspect-[16/10] overflow-hidden sm:aspect-[16/9]">
                <Image
                  src={banner.image || PLACEHOLDER_IMAGE}
                  alt={banner.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  unoptimized={!banner.image || banner.image === PLACEHOLDER_IMAGE}
                />
              </div>
              <div className="p-3.5 sm:p-4">
                <h3 className="line-clamp-1 text-sm font-bold text-dark-gray group-hover:text-primary">
                  {banner.title}
                </h3>
                <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted">
                  {banner.subtitle}
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary">
                  {banner.ctaText}
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
