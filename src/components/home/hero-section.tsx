"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getHeroBanners } from "@/lib/api/banners";
import { getCategories } from "@/lib/api/categories";
import { getHomepageSections } from "@/lib/api/content";
import { PLACEHOLDER_IMAGE } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/layout/search-bar";
import { cn } from "@/lib/utils";

export function HeroBanner() {
  const { data: slides = [] } = useQuery({
    queryKey: ["banners", "hero"],
    queryFn: getHeroBanners,
  });
  const { data: sections = [] } = useQuery({
    queryKey: ["homepage-sections"],
    queryFn: getHomepageSections,
  });
  const { data: categories = [] } = useQuery({
    queryKey: ["categories", "hero-tags"],
    queryFn: getCategories,
  });

  const heroSection = sections.find((s) => s.key === "hero");
  const badge = heroSection?.config?.badge ?? "Fresh · Global · B2B";
  const searchTags =
    heroSection?.config?.searchTags ??
    categories.slice(0, 4).map((c) => c.name);

  const [active, setActive] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  if (!slides.length) return null;

  const slide = slides[active] ?? slides[0];

  return (
    <section className="relative overflow-hidden bg-dark-gray">
      <div className="absolute inset-0">
        {slides.map((s, i) => (
          <Image
            key={s.id}
            src={s.image || PLACEHOLDER_IMAGE}
            alt={s.title}
            fill
            priority={i === 0}
            className={cn(
              "object-cover transition-opacity duration-700",
              i === active ? "opacity-100" : "opacity-0",
            )}
            sizes="100vw"
            unoptimized={!s.image}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-primary-dark/90 via-primary-dark/55 to-primary/25" />
      </div>

      <div className="container-main relative z-10 py-12 sm:py-16 lg:py-28">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-10">
          <div className="max-w-xl animate-fade-slide" key={slide.id}>
            <span className="inline-flex rounded-full bg-primary-light/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white shadow-sm sm:px-4 sm:py-1.5 sm:text-xs">
              {badge}
            </span>
            <h1 className="mt-4 text-2xl font-bold leading-tight text-white sm:mt-5 sm:text-4xl lg:text-5xl">
              {slide.title}
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-white/85 sm:mt-4 sm:text-base lg:text-lg">
              {slide.subtitle}
            </p>
            <div className="mt-6 flex flex-wrap gap-2.5 sm:mt-8 sm:gap-3">
              <Button size="lg" className="h-11 flex-1 sm:flex-none sm:h-12" asChild>
                <Link href={slide.ctaLink}>
                  {slide.ctaText}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-11 flex-1 border-white/40 bg-white/10 text-white hover:bg-white/20 sm:flex-none sm:h-12"
                asChild
              >
                <Link href="/become-seller">List Your Products</Link>
              </Button>
            </div>
          </div>

          <div className="w-full">
            <div className="rounded-2xl bg-white/95 p-2 shadow-2xl backdrop-blur-sm">
              <SearchBar
                size="lg"
                placeholder="Search products, categories, suppliers..."
                className="[&_input]:h-12 [&_input]:border-0 [&_input]:text-sm sm:[&_input]:h-14 sm:[&_input]:text-base"
              />
              {searchTags.length > 0 && (
                <div className="flex flex-wrap gap-2 px-2 pb-2 pt-2 sm:px-3 sm:pb-3">
                  {searchTags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/search?q=${encodeURIComponent(tag)}`}
                      className="rounded-full bg-primary-muted px-2.5 py-1 text-[11px] font-medium text-primary hover:bg-primary/10 sm:px-3 sm:text-xs"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {slides.length > 1 && (
          <div className="mt-10 flex items-center justify-between">
            <div className="flex gap-2">
              {slides.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  aria-label={`Go to slide ${i + 1}`}
                  onClick={() => setActive(i)}
                  className={cn(
                    "h-2 rounded-full transition-all",
                    i === active ? "w-8 bg-primary-light" : "w-2 bg-white/40",
                  )}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                aria-label="Previous slide"
                onClick={() =>
                  setActive((prev) => (prev - 1 + slides.length) % slides.length)
                }
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white hover:bg-white/20"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                aria-label="Next slide"
                onClick={() => setActive((prev) => (prev + 1) % slides.length)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white hover:bg-white/20"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export function BannerSlider() {
  return null;
}
