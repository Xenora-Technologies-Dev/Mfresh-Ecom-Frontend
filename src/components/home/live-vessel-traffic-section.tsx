"use client";

import { AnimatedSection } from "@/components/shared/animated-section";
import { SectionHeader } from "@/components/shared/section-header";
import { HeroLiveTrackerSlide } from "@/components/home/hero-live-tracker-slide";

/** Standalone tracker block (optional pages). Homepage uses the hero carousel instead. */
export function LiveVesselTrafficSection() {
  return (
    <AnimatedSection className="py-10 sm:py-14 bg-surface">
      <div className="container-main">
        <SectionHeader
          title="M Fresh Live Vessel Traffic"
          subtitle="Track food import & export shipments booked through M Fresh across global trade routes"
          align="center"
        />
        <div className="relative z-0 h-[480px] overflow-hidden rounded-2xl border border-border shadow-lg sm:h-[560px] lg:h-[600px]">
          <HeroLiveTrackerSlide isActive />
        </div>
      </div>
    </AnimatedSection>
  );
}
