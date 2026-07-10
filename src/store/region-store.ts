"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DEFAULT_REGION } from "@/lib/constants";
import { getCountryWelcomeCopy } from "@/lib/country-welcome";

export type RegionPhase = "idle" | "loading" | "welcome";

interface RegionState {
  country: string;
  phase: RegionPhase;
  welcomeTitle: string | null;
  welcomeBlurb: string | null;
  welcomeFlag: string | null;
  setCountry: (country: string) => void;
  finishLoading: () => void;
  clearWelcome: () => void;
}

export const useRegionStore = create<RegionState>()(
  persist(
    (set) => ({
      country: DEFAULT_REGION,
      phase: "idle",
      welcomeTitle: null,
      welcomeBlurb: null,
      welcomeFlag: null,
      setCountry: (country) => {
        const copy = getCountryWelcomeCopy(country);
        set({
          country,
          phase: "loading",
          welcomeTitle: copy.title,
          welcomeBlurb: copy.blurb,
          welcomeFlag: copy.flag,
        });
      },
      finishLoading: () =>
        set((s) => ({
          phase: s.phase === "loading" ? "welcome" : s.phase,
        })),
      clearWelcome: () =>
        set({
          phase: "idle",
          welcomeTitle: null,
          welcomeBlurb: null,
          welcomeFlag: null,
        }),
    }),
    {
      name: "mfresh-region",
      partialize: (s) => ({ country: s.country }),
    },
  ),
);
