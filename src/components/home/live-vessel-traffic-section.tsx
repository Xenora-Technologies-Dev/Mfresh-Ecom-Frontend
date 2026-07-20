"use client";

import { AnimatedSection } from "@/components/shared/animated-section";
import { HeroLiveTrackerSlide } from "@/components/home/hero-live-tracker-slide";

/** Full live map block used on the Live Shipping Tracker page */
export function LiveVesselTrafficSection() {
  return (
    <AnimatedSection className="bg-surface pb-12 pt-2 sm:pb-16 sm:pt-4">
      <div className="container-main">
        <HeroLiveTrackerSlide isActive />
      </div>
    </AnimatedSection>
  );
}
