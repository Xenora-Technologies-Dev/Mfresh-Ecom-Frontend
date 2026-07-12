"use client";

import { AnimatedSection } from "@/components/shared/animated-section";
import { HeroLiveTrackerSlide } from "@/components/home/hero-live-tracker-slide";

/** Full live map block used on the Live Shipping Tracker page */
export function LiveVesselTrafficSection() {
  return (
    <AnimatedSection className="bg-surface pb-12 pt-2 sm:pb-16 sm:pt-4">
      <div className="container-main">
        <div className="relative z-0 h-[min(70vh,640px)] min-h-[420px] overflow-hidden rounded-2xl border border-border shadow-lg sm:h-[560px] lg:h-[640px]">
          <HeroLiveTrackerSlide isActive />
        </div>
      </div>
    </AnimatedSection>
  );
}
