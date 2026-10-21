"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useCurrencyStore } from "@/store/currency-store";

async function fetchExchangeRates(): Promise<{ aed?: number; sgd?: number }> {
  const base = process.env.NEXT_PUBLIC_API_URL;
  if (!base) return {};
  try {
    const res = await fetch(`${base}/public/settings/rates`);
    if (!res.ok) return {};
    const data = (await res.json()) as { aed?: number | null; sgd?: number | null };
    return {
      aed: data.aed != null ? Number(data.aed) : undefined,
      sgd: data.sgd != null ? Number(data.sgd) : undefined,
    };
  } catch {
    return {};
  }
}

export function CurrencyRatesProvider({ children }: { children: React.ReactNode }) {
  const setRates = useCurrencyStore((s) => s.setRates);

  const { data } = useQuery({
    queryKey: ["exchange-rates"],
    queryFn: fetchExchangeRates,
    staleTime: 1000 * 60 * 30,
  });

  useEffect(() => {
    if (!data) return;
    const partial: { AED?: number; SGD?: number } = {};
    if (data.aed && !Number.isNaN(data.aed)) partial.AED = data.aed;
    if (data.sgd && !Number.isNaN(data.sgd)) partial.SGD = data.sgd;
    if (Object.keys(partial).length) setRates(partial);
  }, [data, setRates]);

  return <>{children}</>;
}
