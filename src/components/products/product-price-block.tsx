"use client";

import { PriceDisplay } from "@/components/shared/price-display";
import { useCurrencyStore } from "@/store/currency-store";
import { CURRENCY_OPTIONS } from "@/lib/currency";

interface ProductPriceBlockProps {
  minPrice: number;
  maxPrice: number;
  currency?: string;
  moq: number;
  unit: string;
}

export function ProductPriceBlock({
  minPrice,
  maxPrice,
  currency = "USD",
  moq,
  unit,
}: ProductPriceBlockProps) {
  const { currency: selected } = useCurrencyStore();
  const label = CURRENCY_OPTIONS.find((c) => c.code === selected)?.label;
  const samePrice = minPrice === maxPrice;

  return (
    <div className="rounded-2xl border border-gray-100 bg-light-gray/50 p-6">
      <div className="space-y-1">
        {samePrice ? (
          <p className="text-3xl font-bold text-primary">
            <PriceDisplay price={minPrice} storedCurrency={currency} />
            <span className="ml-1 text-base font-medium text-muted">/{unit}</span>
          </p>
        ) : (
          <>
            <p className="text-sm text-muted">
              Min{" "}
              <span className="text-xl font-bold text-primary">
                <PriceDisplay price={minPrice} storedCurrency={currency} />
              </span>
              <span className="text-muted">/{unit}</span>
            </p>
            <p className="text-sm text-muted">
              Max{" "}
              <span className="text-xl font-bold text-primary">
                <PriceDisplay price={maxPrice} storedCurrency={currency} />
              </span>
              <span className="text-muted">/{unit}</span>
            </p>
          </>
        )}
      </div>
      <p className="mt-1 text-xs text-muted">
        Base price in USD · Displayed in {label ?? selected}
      </p>
      <p className="mt-3 flex items-center gap-1.5 text-sm text-muted">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" />
        MOQ: {moq}/{unit}
      </p>
    </div>
  );
}
