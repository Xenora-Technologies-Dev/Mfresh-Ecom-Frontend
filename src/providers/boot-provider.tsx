"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
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

export function BootProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const prevPathRef = useRef(pathname);
  const [themeReady, setThemeReady] = useState(false);
  const [heroReady, setHeroReady] = useState(!isHome);

  // Only reset hero gate when navigating onto home — not on initial mount after hero already ready
  useEffect(() => {
    const prev = prevPathRef.current;
    prevPathRef.current = pathname;
    if (pathname === "/" && prev !== "/") {
      setHeroReady(false);
    } else if (pathname !== "/") {
      setHeroReady(true);
    }
  }, [pathname]);

  const markThemeReady = useCallback(() => {
    setThemeReady(true);
    if (typeof document !== "undefined") {
      document.documentElement.dataset.themeReady = "1";
    }
  }, []);

  const markHeroReady = useCallback(() => {
    setHeroReady(true);
  }, []);

  const isBooted = themeReady && (!isHome || heroReady);

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
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center gap-4 bg-[#F4FAF6]"
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
