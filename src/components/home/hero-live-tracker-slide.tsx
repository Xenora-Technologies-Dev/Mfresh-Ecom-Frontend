"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Ship } from "lucide-react";
import { useLiveVessels } from "@/hooks/use-live-vessels";
import { TrackShipmentPanel } from "@/components/home/track-shipment-panel";
import { STATUS_COLORS, STATUS_LABELS } from "@/lib/live-vessel-traffic";
import type { Vessel, VesselStatus } from "@/lib/live-vessel-traffic";
import { cn } from "@/lib/utils";

const LiveVesselMap = dynamic(
  () =>
    import("@/components/home/live-vessel-map").then((m) => m.LiveVesselMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center bg-[#aadaff]/35 text-sm text-muted">
        Loading live vessel map…
      </div>
    ),
  },
);

const LEGEND: VesselStatus[] = ["import", "export", "transit"];

interface HeroLiveTrackerSlideProps {
  isActive: boolean;
  className?: string;
  showTrackPanel?: boolean;
}

/** Full-bleed shipping tracker used on the Live Shipping Tracker page */
export function HeroLiveTrackerSlide({
  isActive,
  className,
  showTrackPanel = true,
}: HeroLiveTrackerSlideProps) {
  const { vessels, count } = useLiveVessels();
  const [focusedId, setFocusedId] = useState<string | null>(null);

  const handleTracked = (vessel: Vessel | null) => {
    setFocusedId(vessel?.id ?? null);
  };

  return (
    <div className={cn("flex w-full flex-col gap-4", className)}>
      {showTrackPanel && (
        <TrackShipmentPanel vessels={vessels} onTracked={handleTracked} />
      )}

      <div className="flex h-[min(70vh,640px)] min-h-[420px] flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-lg sm:h-[560px] lg:h-[640px]">
        <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-border bg-[#1e2a36] px-4 py-2.5 text-white sm:px-5">
          <div className="flex items-center gap-2">
            <Ship className="h-4 w-4 text-primary-light" />
            <span className="text-sm font-semibold sm:text-base">
              M Fresh Shipping Tracker
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2.5 text-xs sm:gap-3 sm:text-sm">
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

        <div className="relative min-h-0 flex-1">
          <div className="live-vessel-map-root absolute inset-0">
            <LiveVesselMap
              vessels={vessels}
              isVisible={isActive}
              focusedVesselId={focusedId}
            />
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-border bg-white px-4 py-3 sm:px-5 sm:py-3.5">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            {LEGEND.map((status) => (
              <div key={status} className="flex items-center gap-2">
                <span
                  className="inline-block h-3 w-3 shrink-0 rounded-sm shadow-sm ring-1 ring-black/10 sm:h-3.5 sm:w-3.5"
                  style={{ backgroundColor: STATUS_COLORS[status] }}
                  aria-hidden
                />
                <span className="text-sm font-bold tracking-wide text-dark-gray sm:text-[15px]">
                  {STATUS_LABELS[status]}
                </span>
              </div>
            ))}
          </div>
          <p className="text-xs font-medium text-muted sm:text-sm">
            Fleet updates every 4 hours · Positions refresh live
          </p>
        </div>
      </div>
    </div>
  );
}
