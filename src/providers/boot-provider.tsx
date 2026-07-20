"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { usePathname } from "next/navigation";

interface BootContextValue {
  themeReady: boolean;
  heroReady: boolean;
  isBooted: boolean;
  markThemeReady: () => void;
  markHeroReady: () => void;
}

const BootContext = createContext<BootContextValue>({
  themeReady: false,
  heroReady: true,
  isBooted: false,
  markThemeReady: () => {},
  markHeroReady: () => {},
});

/** Failsafe so a hung theme/banner fetch never blocks the storefront forever. */
const BOOT_TIMEOUT_MS = 4_000;

export function BootProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  const [themeReady, setThemeReady] = useState(false);
  // Gate the hero splash only on a cold load that starts on home.
  // Do NOT reset this on client navigations back to "/" — that caused a
  // production deadlock on Netlify (pathname updates before HeroBanner mounts,
  // so markHeroReady never runs and the overlay stays forever).
  const [heroReady, setHeroReady] = useState(!isHome);
  const [initialBootDone, setInitialBootDone] = useState(false);

  const markThemeReady = useCallback(() => {
    setThemeReady(true);
    if (typeof document !== "undefined") {
      document.documentElement.dataset.themeReady = "1";
    }
  }, []);

  const markHeroReady = useCallback(() => {
    setHeroReady(true);
  }, []);

  const gatesOpen = themeReady && (!isHome || heroReady);
  const isBooted = initialBootDone || gatesOpen;

  useEffect(() => {
    if (gatesOpen) setInitialBootDone(true);
  }, [gatesOpen]);

  // One-shot safety net for the first paint only.
  useEffect(() => {
    if (initialBootDone) return;
    const timer = window.setTimeout(() => {
      setHeroReady(true);
      setThemeReady(true);
      setInitialBootDone(true);
      document.documentElement.dataset.themeReady = "1";
    }, BOOT_TIMEOUT_MS);
    return () => window.clearTimeout(timer);
  }, [initialBootDone]);

  const value = useMemo(
    () => ({
      themeReady,
      heroReady,
      isBooted,
      markThemeReady,
      markHeroReady,
    }),
    [themeReady, heroReady, isBooted, markThemeReady, markHeroReady],
  );

  return (
    <BootContext.Provider value={value}>
      {!isBooted && (
        <div
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center gap-4 bg-[#F3FAF5]"
          role="status"
          aria-live="polite"
          aria-label="Loading"
        >
          <div className="h-11 w-11 animate-spin rounded-full border-[3px] border-primary/25 border-t-primary" />
          <p className="text-sm font-medium text-dark-gray/70">Loading M Fresh…</p>
        </div>
      )}
      {children}
    </BootContext.Provider>
  );
}

export function useBoot() {
  return useContext(BootContext);
}
