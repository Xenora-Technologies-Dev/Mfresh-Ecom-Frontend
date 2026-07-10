"use client";

import { useEffect } from "react";
import { Loader2, X } from "lucide-react";
import { useRegionStore } from "@/store/region-store";

const LOAD_MS = 1200;
const WELCOME_MS = 5000;

export function CountryWelcomeBanner() {
  const phase = useRegionStore((s) => s.phase);
  const welcomeTitle = useRegionStore((s) => s.welcomeTitle);
  const welcomeBlurb = useRegionStore((s) => s.welcomeBlurb);
  const welcomeFlag = useRegionStore((s) => s.welcomeFlag);
  const finishLoading = useRegionStore((s) => s.finishLoading);
  const clearWelcome = useRegionStore((s) => s.clearWelcome);

  useEffect(() => {
    if (phase !== "loading") return;
    const timer = setTimeout(() => finishLoading(), LOAD_MS);
    return () => clearTimeout(timer);
  }, [phase, finishLoading]);

  useEffect(() => {
    if (phase !== "welcome") return;
    const timer = setTimeout(() => clearWelcome(), WELCOME_MS);
    return () => clearTimeout(timer);
  }, [phase, clearWelcome]);

  if (phase === "idle") return null;

  if (phase === "loading") {
    return (
      <div className="fixed inset-0 z-[130] flex items-center justify-center bg-dark-gray/45 backdrop-blur-[2px]">
        <div className="flex flex-col items-center gap-3 rounded-2xl bg-white px-8 py-7 shadow-2xl">
          <Loader2 className="h-9 w-9 animate-spin text-primary" />
          <p className="text-sm font-medium text-dark-gray">
            Switching region…
          </p>
        </div>
      </div>
    );
  }

  if (!welcomeTitle) return null;

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-dark-gray/40"
        aria-label="Dismiss welcome"
        onClick={clearWelcome}
      />
      <div
        role="dialog"
        aria-modal
        aria-labelledby="country-welcome-title"
        className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        <div className="bg-gradient-to-br from-primary to-primary-dark px-6 py-5 text-white">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-4xl leading-none">{welcomeFlag}</span>
              <h2
                id="country-welcome-title"
                className="text-lg font-bold leading-snug sm:text-xl"
              >
                {welcomeTitle}
              </h2>
            </div>
            <button
              type="button"
              onClick={clearWelcome}
              className="shrink-0 rounded-full p-1 hover:bg-white/15"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="px-6 py-5">
          <p className="text-sm leading-relaxed text-muted">{welcomeBlurb}</p>
          <p className="mt-4 text-xs text-muted/80">
            This message will close automatically.
          </p>
        </div>
      </div>
    </div>
  );
}
