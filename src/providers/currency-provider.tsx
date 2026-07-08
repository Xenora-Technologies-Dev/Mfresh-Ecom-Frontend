"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useCurrencyStore } from "@/store/currency-store";

async function fetchExchangeRates(): Promise<{ aed?: number; sgd?: number }> {
  const base = process.env.NEXT_PUBLIC_API_URL;
  if (!base) return {};
  try {
    const res = await fetch(`${base}/settings`);
    if (!res.ok) return {};
    const settings = (await res.json()) as { key: string; value: unknown }[];
    const map = Object.fromEntries(settings.map((s) => [s.key, s.value]));
    return {
      aed: map.exchange_rate_aed ? Number(map.exchange_rate_aed) : undefined,
      sgd: map.exchange_rate_sgd ? Number(map.exchange_rate_sgd) : undefined,
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
