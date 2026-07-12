"use client";

import Link from "next/link";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getHeroBanners } from "@/lib/api/banners";
import { useBoot } from "@/providers/boot-provider";
import { cn } from "@/lib/utils";

const BANNER_SLIDE_MS = 5_500;

export function HeroBanner() {
  const { markHeroReady } = useBoot();
  const { data: banners = [], isFetched } = useQuery({
    queryKey: ["banners", "hero"],
    queryFn: getHeroBanners,
    staleTime: 60 * 1000,
  });

  const [bannerIndex, setBannerIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [heroReady, setHeroReady] = useState(false);
  const [isNarrow, setIsNarrow] = useState(false);

  const hasBanners = banners.length > 0;

  useEffect(() => {
    if (!isFetched) return;
    setHeroReady(true);
    markHeroReady();
  }, [isFetched, markHeroReady]);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const sync = () => setIsNarrow(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!isFetched) return;
    banners.forEach((b) => {
      [b.image, b.mobileImage].forEach((src) => {
        if (!src) return;
        const img = new window.Image();
        img.src = src;
      });
    });
  }, [isFetched, banners]);

  useEffect(() => {
    if (paused || banners.length <= 1) return;
    const timer = setTimeout(() => {
      setBannerIndex((i) => (i + 1) % banners.length);
    }, BANNER_SLIDE_MS);
    return () => clearTimeout(timer);
  }, [bannerIndex, paused, banners.length]);

  const goPrev = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (banners.length <= 1) return;
      setBannerIndex((i) => (i - 1 + banners.length) % banners.length);
    },
    [banners.length],
  );

  const goNext = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (banners.length <= 1) return;
      setBannerIndex((i) => (i + 1) % banners.length);
    },
    [banners.length],
  );

  if (!heroReady) {
    return (
      <section
        className="relative min-h-[min(58dvh,420px)] bg-hero-gray sm:min-h-[min(62dvh,520px)] md:min-h-[calc(100dvh-7.75rem)]"
        aria-hidden
      />
    );
  }

  return (
    <section
      className="relative min-h-[min(58dvh,420px)] overflow-hidden sm:min-h-[min(62dvh,520px)] md:min-h-[calc(100dvh-7.75rem)]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Homepage hero"
    >
      {hasBanners ? (
        <div className="absolute inset-0">
          {banners.map((s, i) => {
            const isActive = i === bannerIndex;
            const src =
              isNarrow && s.mobileImage ? s.mobileImage : s.image || s.mobileImage;
            const content = src ? (
              <Image
                src={src}
                alt={s.ctaText || s.title || "Hero banner"}
                fill
                className="object-cover object-center"
                priority={i === 0}
                sizes="(max-width: 767px) 100vw, 100vw"
              />
            ) : (
              <div className="h-full w-full bg-hero-gray" />
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
                    tabIndex={isActive ? 0 : -1}
                  >
                    {content}
                  </Link>
                ) : (
                  <div className="relative h-full w-full">{content}</div>
                )}
              </div>
            );
          })}

          {banners.length > 1 && (
            <>
              <button
                type="button"
                aria-label="Previous banner"
                onClick={goPrev}
                className="absolute left-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-black/10 bg-white/95 text-dark-gray shadow-lg shadow-black/20 transition hover:scale-105 sm:left-4 sm:h-11 sm:w-11 md:left-5 md:h-12 md:w-12"
              >
                <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7" strokeWidth={2.5} />
              </button>
              <button
                type="button"
                aria-label="Next banner"
                onClick={goNext}
                className="absolute right-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-black/10 bg-white/95 text-dark-gray shadow-lg shadow-black/20 transition hover:scale-105 sm:right-4 sm:h-11 sm:w-11 md:right-5 md:h-12 md:w-12"
              >
                <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7" strokeWidth={2.5} />
              </button>

              <div className="pointer-events-none absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5 sm:bottom-5 sm:gap-2 md:bottom-8">
                {banners.map((s, i) => (
                  <button
                    key={s.id}
                    type="button"
                    aria-label={`Banner ${i + 1}`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setBannerIndex(i);
                    }}
                    className={cn(
                      "pointer-events-auto h-2 rounded-full border border-black/10 shadow-sm transition-all sm:h-2.5",
                      i === bannerIndex
                        ? "w-6 bg-white sm:w-8"
                        : "w-2 bg-white/70 hover:bg-white sm:w-2.5",
                    )}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="flex h-full min-h-[inherit] items-center justify-center bg-hero-gray px-4 text-center text-sm text-muted">
          No banners available
        </div>
      )}
    </section>
  );
}

export function BannerSlider() {
  return null;
}
