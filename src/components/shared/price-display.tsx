"use client";

import { formatProductPrice } from "@/lib/currency";
import { useCurrencyStore } from "@/store/currency-store";

interface PriceDisplayProps {
  price: number;
  storedCurrency?: string;
  className?: string;
}

export function PriceDisplay({
  price,
  storedCurrency = "USD",
  className,
}: PriceDisplayProps) {
  const { currency, rates } = useCurrencyStore();
  const formatted = formatProductPrice(price, storedCurrency, currency, rates);

  return <span className={className}>{formatted}</span>;
}
