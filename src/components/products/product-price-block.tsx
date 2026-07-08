"use client";

import { PriceDisplay } from "@/components/shared/price-display";
import { useCurrencyStore } from "@/store/currency-store";
import { CURRENCY_OPTIONS } from "@/lib/currency";

interface ProductPriceBlockProps {
  price: number;
  currency?: string;
  moq: number;
  moqUnit: string;
}

export function ProductPriceBlock({
  price,
  currency = "USD",
  moq,
  moqUnit,
}: ProductPriceBlockProps) {
  const { currency: selected } = useCurrencyStore();
  const label = CURRENCY_OPTIONS.find((c) => c.code === selected)?.label;

  return (
    <div className="rounded-2xl border border-gray-100 bg-light-gray/50 p-6">
      <p className="text-3xl font-bold text-primary">
        <PriceDisplay price={price} storedCurrency={currency} />
      </p>
      <p className="mt-1 text-xs text-muted">
        Base price in USD · Displayed in {label ?? selected}
      </p>
      <p className="mt-3 flex items-center gap-1.5 text-sm text-muted">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" />
        MOQ: {moq} {moqUnit}
      </p>
    </div>
  );
}
