"use client";

import Link from "next/link";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getHeroBanners } from "@/lib/api/banners";
import { useBoot } from "@/providers/boot-provider";
import { HeroLiveTrackerSlide } from "@/components/home/hero-live-tracker-slide";
import { cn } from "@/lib/utils";

type HeroPanel = "tracker" | "banners";

/** Switch between map container and image-slider container */
const PANEL_SWITCH_MS = 6_500;
/** Cycle images inside the banner container */
const BANNER_SLIDE_MS = 5_500;
const TRANSITION_MS = 800;

export function HeroBanner() {
  const { markHeroReady } = useBoot();
  const { data: banners = [], isFetched } = useQuery({
    queryKey: ["banners", "hero"],
    queryFn: getHeroBanners,
    staleTime: 60 * 1000,
  });

  const [panel, setPanel] = useState<HeroPanel>("tracker");
  const [bannerIndex, setBannerIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [heroReady, setHeroReady] = useState(false);

  const hasBanners = banners.length > 0;
  const canSwitchPanels = hasBanners;

  useEffect(() => {
    if (!isFetched) return;
    setHeroReady(true);
    markHeroReady();
  }, [isFetched, markHeroReady]);

  useEffect(() => {
    if (!isFetched) return;
    banners.forEach((b) => {
      if (!b.image) return;
      const img = new window.Image();
      img.src = b.image;
    });
  }, [isFetched, banners]);

  // Auto-switch between tracker ↔ banners containers
  useEffect(() => {
    if (paused || !heroReady || !canSwitchPanels) return;
    const timer = setTimeout(() => {
      setPanel((prev) => (prev === "tracker" ? "banners" : "tracker"));
    }, PANEL_SWITCH_MS);
    return () => clearTimeout(timer);
  }, [panel, paused, heroReady, canSwitchPanels]);

  // Inner banner image carousel (only while banners panel is active)
  useEffect(() => {
    if (paused || panel !== "banners" || banners.length <= 1) return;
    const timer = setTimeout(() => {
      setBannerIndex((i) => (i + 1) % banners.length);
    }, BANNER_SLIDE_MS);
    return () => clearTimeout(timer);
  }, [panel, bannerIndex, paused, banners.length]);

  const goPrev = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!canSwitchPanels) return;
      setPanel((prev) => (prev === "tracker" ? "banners" : "tracker"));
    },
    [canSwitchPanels],
  );

  const goNext = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!canSwitchPanels) return;
      setPanel((prev) => (prev === "tracker" ? "banners" : "tracker"));
    },
    [canSwitchPanels],
  );

  if (!heroReady) {
    return (
      <section
        className="relative min-h-[calc(100dvh-5rem)] bg-hero-gray md:min-h-[calc(100dvh-7.75rem)]"
        aria-hidden
      />
    );
  }

  return (
    <section
      className="relative min-h-[calc(100dvh-5rem)] overflow-hidden md:min-h-[calc(100dvh-7.75rem)]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Homepage hero"
    >
      {/* Container 1 — Live tracker map */}
      <div
        className={cn(
          "absolute inset-0 transition-opacity ease-in-out",
          panel === "tracker"
            ? "z-[1] opacity-100"
            : "z-0 pointer-events-none opacity-0",
        )}
        style={{ transitionDuration: `${TRANSITION_MS}ms` }}
        aria-hidden={panel !== "tracker"}
      >
        <HeroLiveTrackerSlide isActive={panel === "tracker"} />
      </div>

      {/* Container 2 — Image slider */}
      <div
        className={cn(
          "absolute inset-0 transition-opacity ease-in-out",
          panel === "banners"
            ? "z-[1] opacity-100"
            : "z-0 pointer-events-none opacity-0",
        )}
        style={{ transitionDuration: `${TRANSITION_MS}ms` }}
        aria-hidden={panel !== "banners"}
      >
        {hasBanners ? (
          <div className="relative h-full w-full">
            {banners.map((s, i) => {
              const isActive = i === bannerIndex;
              const content = s.image ? (
                <Image
                  src={s.image}
                  alt={s.ctaText || "Hero banner"}
                  fill
                  className="object-cover"
                  priority={i === 0}
                  sizes="100vw"
                />
              ) : (
                <div className="h-full w-full bg-hero-gray" />
              );

              return (
                <div
                  key={s.id}
                  className={cn(
                    "absolute inset-0 transition-opacity duration-700 ease-in-out",
                    isActive
                      ? "opacity-100"
                      : "pointer-events-none opacity-0",
                  )}
                  aria-hidden={!isActive}
                >
                  {s.ctaLink ? (
                    <Link
                      href={s.ctaLink}
                      className="group relative block h-full w-full cursor-pointer"
                      aria-label={s.ctaText || "View more"}
                      tabIndex={panel === "banners" && isActive ? 0 : -1}
                    >
                      {content}
                    </Link>
                  ) : (
                    <div className="relative h-full w-full">{content}</div>
                  )}
                </div>
              );
            })}

            {banners.length > 1 && panel === "banners" && (
              <div className="pointer-events-none absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 gap-2 sm:bottom-8">
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
                      "pointer-events-auto h-2.5 rounded-full border border-black/10 shadow-sm transition-all",
                      i === bannerIndex
                        ? "w-8 bg-white"
                        : "w-2.5 bg-white/70 hover:bg-white",
                    )}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="flex h-full items-center justify-center bg-hero-gray text-sm text-muted">
            No banners available
          </div>
        )}
      </div>

      {canSwitchPanels && (
        <>
          <button
            type="button"
            aria-label="Previous panel"
            onClick={goPrev}
            className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-black/10 bg-white text-dark-gray shadow-lg shadow-black/25 transition hover:scale-105 hover:bg-white hover:shadow-xl sm:left-5 sm:h-12 sm:w-12"
          >
            <ChevronLeft className="h-6 w-6 sm:h-7 sm:w-7" strokeWidth={2.5} />
          </button>
          <button
            type="button"
            aria-label="Next panel"
            onClick={goNext}
            className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-black/10 bg-white text-dark-gray shadow-lg shadow-black/25 transition hover:scale-105 hover:bg-white hover:shadow-xl sm:right-5 sm:h-12 sm:w-12"
          >
            <ChevronRight className="h-6 w-6 sm:h-7 sm:w-7" strokeWidth={2.5} />
          </button>

          {/* Two panel indicators (map | banners) */}
          <div className="pointer-events-none absolute bottom-5 right-5 z-10 flex gap-2 sm:bottom-8 sm:right-8">
            <button
              type="button"
              aria-label="Show shipping tracker"
              onClick={(e) => {
                e.preventDefault();
                setPanel("tracker");
              }}
              className={cn(
                "pointer-events-auto h-2.5 rounded-full border border-black/10 shadow-sm transition-all",
                panel === "tracker"
                  ? "w-8 bg-primary"
                  : "w-2.5 bg-white/80 hover:bg-white",
              )}
            />
            <button
              type="button"
              aria-label="Show banner slider"
              onClick={(e) => {
                e.preventDefault();
                setPanel("banners");
              }}
              className={cn(
                "pointer-events-auto h-2.5 rounded-full border border-black/10 shadow-sm transition-all",
                panel === "banners"
                  ? "w-8 bg-white"
                  : "w-2.5 bg-white/80 hover:bg-white",
              )}
            />
          </div>
        </>
      )}
    </section>
  );
}

export function BannerSlider() {
  return null;
}
