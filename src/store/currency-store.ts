import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  BASE_CURRENCY,
  DEFAULT_EXCHANGE_RATES,
  type SupportedCurrency,
} from "@/lib/currency";

interface CurrencyState {
  currency: SupportedCurrency;
  rates: Record<SupportedCurrency, number>;
  setCurrency: (currency: SupportedCurrency) => void;
  setRates: (rates: Partial<Record<SupportedCurrency, number>>) => void;
}

export const useCurrencyStore = create<CurrencyState>()(
  persist(
    (set) => ({
      currency: BASE_CURRENCY,
      rates: DEFAULT_EXCHANGE_RATES,
      setCurrency: (currency) => set({ currency }),
      setRates: (partial) =>
        set((state) => ({
          rates: { ...state.rates, ...partial },
        })),
    }),
    {
      name: "mfresh-currency",
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        const valid = ["USD", "AED", "SGD"] as const;
        if (!valid.includes(state.currency)) {
          state.currency = BASE_CURRENCY;
        }
      },
    },
  ),
);
