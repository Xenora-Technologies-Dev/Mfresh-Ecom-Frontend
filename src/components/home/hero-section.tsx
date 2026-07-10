"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getHeroBanners } from "@/lib/api/banners";
import { useBoot } from "@/providers/boot-provider";
import { cn } from "@/lib/utils";

export function HeroBanner() {
  const { markHeroReady } = useBoot();
  const { data: slides = [], isLoading, isFetched } = useQuery({
    queryKey: ["banners", "hero"],
    queryFn: getHeroBanners,
    staleTime: 60 * 1000,
  });

  const [active, setActive] = useState(0);
  const [heroReady, setHeroReady] = useState(false);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [slides.length]);

  // Preload first real banner only — never use demo/handshake fallbacks
  useEffect(() => {
    if (!isFetched) return;
    const first = slides[0]?.image;
    if (!first) {
      setHeroReady(true);
      markHeroReady();
      return;
    }
    let cancelled = false;
    const img = new window.Image();
    img.onload = () => {
      if (!cancelled) {
        setHeroReady(true);
        markHeroReady();
      }
    };
    img.onerror = () => {
      if (!cancelled) {
        setHeroReady(true);
        markHeroReady();
      }
    };
    img.src = first;
    return () => {
      cancelled = true;
    };
  }, [isFetched, slides, markHeroReady]);

  const goPrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActive((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActive((prev) => (prev + 1) % slides.length);
  };

  const goToSlide = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    setActive(index);
  };

  // Keep a solid placeholder under the boot overlay — never paint demo images
  if (isLoading || !heroReady) {
    return (
      <section
        className="relative min-h-[calc(100dvh-4.5rem)] bg-hero-gray md:min-h-[calc(100dvh-7.75rem)]"
        aria-hidden
      />
    );
  }

  if (!slides.length) {
    return (
      <section className="relative flex min-h-[40vh] items-center justify-center bg-hero-gray md:min-h-[50vh]">
        <p className="text-sm text-muted">No banners available</p>
      </section>
    );
  }

  return (
    <section className="relative min-h-[calc(100dvh-4.5rem)] overflow-hidden md:min-h-[calc(100dvh-7.75rem)]">
      {slides.map((s, i) => {
        const isActive = i === active;
        const slideContent = (
          <>
            {s.image ? (
              <Image
                src={s.image}
                alt={s.ctaText || "Hero banner"}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                priority={i === 0}
                sizes="100vw"
              />
            ) : (
              <div className="h-full w-full bg-hero-gray" />
            )}
          </>
        );

        return (
          <div
            key={s.id}
            className={cn(
              "absolute inset-0 transition-opacity duration-700 ease-in-out",
              isActive ? "opacity-100" : "pointer-events-none opacity-0",
            )}
            aria-hidden={!isActive}
          >
            {s.ctaLink ? (
              <Link
                href={s.ctaLink}
                className="group relative block h-full w-full cursor-pointer"
                aria-label={s.ctaText || "View more"}
              >
                {slideContent}
              </Link>
            ) : (
              <div className="relative h-full w-full">{slideContent}</div>
            )}
          </div>
        );
      })}

      {slides.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous slide"
            onClick={goPrev}
            className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-black/10 bg-white text-dark-gray shadow-lg shadow-black/25 transition hover:scale-105 hover:bg-white hover:shadow-xl sm:left-5 sm:h-12 sm:w-12"
          >
            <ChevronLeft className="h-6 w-6 sm:h-7 sm:w-7" strokeWidth={2.5} />
          </button>
          <button
            type="button"
            aria-label="Next slide"
            onClick={goNext}
            className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-black/10 bg-white text-dark-gray shadow-lg shadow-black/25 transition hover:scale-105 hover:bg-white hover:shadow-xl sm:right-5 sm:h-12 sm:w-12"
          >
            <ChevronRight className="h-6 w-6 sm:h-7 sm:w-7" strokeWidth={2.5} />
          </button>

          <div className="pointer-events-none absolute bottom-5 right-5 z-10 flex gap-2 sm:bottom-8 sm:right-8">
            {slides.map((s, i) => (
              <button
                key={s.id}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                onClick={(e) => goToSlide(e, i)}
                className={cn(
                  "pointer-events-auto h-2.5 rounded-full border border-black/10 shadow-sm transition-all",
                  i === active
                    ? "w-8 bg-white"
                    : "w-2.5 bg-white/80 hover:bg-white",
                )}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}

export function BannerSlider() {
  return null;
}
