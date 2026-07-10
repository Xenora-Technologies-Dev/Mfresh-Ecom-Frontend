"use client";

import dynamic from "next/dynamic";
import { Ship } from "lucide-react";
import { AnimatedSection } from "@/components/shared/animated-section";
import { SectionHeader } from "@/components/shared/section-header";
import { useLiveVessels } from "@/hooks/use-live-vessels";
import { STATUS_COLORS, STATUS_LABELS } from "@/lib/live-vessel-traffic";
import type { VesselStatus } from "@/lib/live-vessel-traffic";

const LiveVesselMap = dynamic(
  () =>
    import("@/components/home/live-vessel-map").then((m) => m.LiveVesselMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[420px] items-center justify-center rounded-xl bg-[#aadaff]/40 text-sm text-muted sm:h-[520px]">
        Loading live vessel map…
      </div>
    ),
  },
);

const LEGEND: VesselStatus[] = ["export", "import", "transit"];

export function LiveVesselTrafficSection() {
  const { vessels, count } = useLiveVessels();

  return (
    <AnimatedSection className="py-10 sm:py-14 bg-surface">
      <div className="container-main">
        <SectionHeader
          title="M Fresh Live Vessel Traffic"
          subtitle="Track food import & export shipments booked through M Fresh across global trade routes"
          align="center"
        />

        <div className="relative z-0 overflow-hidden rounded-2xl border border-border shadow-lg">
          {/* Map toolbar — MarineTraffic-inspired */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-[#1e2a36] px-4 py-2.5 text-white">
            <div className="flex items-center gap-2">
              <Ship className="h-4 w-4 text-primary-light" />
              <span className="text-sm font-semibold">M Fresh Shipping Tracker</span>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm">
              <span className="rounded-md bg-white/10 px-2.5 py-1 font-medium">
                {count} active vessels
              </span>
              <span className="flex items-center gap-1.5 rounded-md bg-red-500/20 px-2.5 py-1 font-semibold text-red-300">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
                </span>
                LIVE
              </span>
            </div>
          </div>

          <div className="relative isolate z-0 h-[420px] sm:h-[520px] lg:h-[560px]">
            <div className="live-vessel-map-root absolute inset-0">
              <LiveVesselMap vessels={vessels} />
            </div>
          </div>

          {/* Legend + stats footer */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border bg-fresh-mint/60 px-4 py-3">
            <div className="flex flex-wrap gap-4">
              {LEGEND.map((status) => (
                <div key={status} className="flex items-center gap-1.5 text-xs sm:text-sm">
                  <span
                    className="inline-block h-0 w-0 border-b-[10px] border-l-[5px] border-r-[5px] border-l-transparent border-r-transparent"
                    style={{ borderBottomColor: STATUS_COLORS[status] }}
                  />
                  <span className="text-muted">{STATUS_LABELS[status]}</span>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-muted sm:text-xs">
              Fleet updates every 4 hours · Positions refresh live
            </p>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
