"use client";

import { useState } from "react";
import { Search, Ship, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  STATUS_COLORS,
  STATUS_LABELS,
  findVesselByReference,
  formatVesselDate,
  type Vessel,
} from "@/lib/live-vessel-traffic";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface TrackShipmentPanelProps {
  vessels: Vessel[];
  onTracked: (vessel: Vessel | null) => void;
  className?: string;
}

export function TrackShipmentPanel({
  vessels,
  onTracked,
  className,
}: TrackShipmentPanelProps) {
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Vessel | null>(null);
  const [popupOpen, setPopupOpen] = useState(false);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    const vessel = findVesselByReference(query, vessels);
    if (!vessel) {
      setError(
        "No shipment found for that reference. Try an MF-###### number from a vessel on the map.",
      );
      setResult(null);
      setPopupOpen(false);
      onTracked(null);
      return;
    }
    setError(null);
    setResult(vessel);
    setPopupOpen(true);
    onTracked(vessel);
  };

  const closePopup = () => {
    setPopupOpen(false);
  };

  return (
    <>
      <div
        className={cn(
          "rounded-2xl border border-border bg-white p-4 shadow-sm sm:p-5",
          className,
        )}
      >
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Ship className="h-5 w-5" strokeWidth={2} />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="text-base font-bold text-dark-gray sm:text-lg">
              Track Your Shipment
            </h2>
            <p className="mt-0.5 text-sm text-muted">
              Enter a shipping reference number to view ETA, ETD, and vessel
              details. Marine tracker API coming soon.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleTrack}
          className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-stretch"
        >
          <Input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (error) setError(null);
            }}
            placeholder="e.g. MF-123456"
            aria-label="Shipping reference number"
            className="h-11 flex-1 font-mono text-sm"
          />
          <Button type="submit" className="h-11 gap-2 px-5 sm:w-auto">
            <Search className="h-4 w-4" />
            Track
          </Button>
        </form>
        {error && (
          <p className="mt-2 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
        {!error && vessels[0] && (
          <p className="mt-2 text-xs text-muted">
            Tip: try{" "}
            <button
              type="button"
              className="font-mono font-medium text-primary underline-offset-2 hover:underline"
              onClick={() => setQuery(vessels[0]!.referenceNo)}
            >
              {vessels[0].referenceNo}
            </button>{" "}
            from the live fleet
          </p>
        )}
      </div>

      <AnimatePresence>
        {popupOpen && result && (
          <div
            className="fixed inset-0 z-[150] flex items-end justify-center p-0 sm:items-center sm:p-5"
            role="dialog"
            aria-modal="true"
            aria-labelledby="ship-details-title"
          >
            <button
              type="button"
              className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
              aria-label="Close shipment details"
              onClick={closePopup}
            />
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              className="relative z-10 w-full max-w-lg overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl"
            >
              <div className="flex items-start justify-between gap-3 border-b border-border px-5 py-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                    Shipment details
                  </p>
                  <h3
                    id="ship-details-title"
                    className="mt-0.5 text-lg font-bold text-dark-gray"
                  >
                    {result.name}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={closePopup}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-muted transition hover:bg-light-gray hover:text-dark-gray"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4 px-5 py-5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-md bg-primary/10 px-2.5 py-1 font-mono text-sm font-semibold text-primary">
                    {result.referenceNo}
                  </span>
                  <span
                    className="rounded-md px-2.5 py-1 text-xs font-semibold text-white"
                    style={{ backgroundColor: STATUS_COLORS[result.status] }}
                  >
                    {STATUS_LABELS[result.status]}
                  </span>
                </div>

                <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                  <Detail label="ETD" value={formatVesselDate(result.etd)} />
                  <Detail label="ETA" value={formatVesselDate(result.eta)} />
                  <Detail label="Origin" value={result.origin} />
                  <Detail label="Destination" value={result.destination} />
                  <Detail label="Cargo" value={result.cargo} />
                  <Detail label="Vessel type" value={result.type} />
                  <Detail label="IMO" value={result.imo} />
                  <Detail
                    label="Speed"
                    value={`${result.speedKnots} kn`}
                  />
                  <Detail label="Region" value={result.region} />
                  <Detail label="Nearest port" value={result.port} />
                </dl>

                <p className="rounded-xl bg-light-gray px-3 py-2.5 text-xs text-muted">
                  Schedule data is simulated for demo. Connect a marine tracker
                  API later for live AIS positions and accurate ETA/ETD.
                </p>
              </div>

              <div className="border-t border-border px-5 py-4">
                <Button type="button" className="w-full" onClick={closePopup}>
                  Close
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/80 bg-surface/60 px-3 py-2.5">
      <dt className="text-xs font-medium uppercase tracking-wide text-muted">
        {label}
      </dt>
      <dd className="mt-0.5 font-semibold capitalize text-dark-gray">{value}</dd>
    </div>
  );
}
