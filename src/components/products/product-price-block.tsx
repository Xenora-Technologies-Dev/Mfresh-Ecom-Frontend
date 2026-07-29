"use client";

import { PriceDisplay } from "@/components/shared/price-display";
import { useCurrencyStore } from "@/store/currency-store";

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
  const samePrice = minPrice === maxPrice;

  return (
    <div className="rounded-2xl border border-gray-100 bg-light-gray/50 p-4 sm:p-6">
      <div>
        {samePrice ? (
          <p className="text-3xl font-bold leading-tight text-primary sm:text-4xl">
            <PriceDisplay price={minPrice} storedCurrency={currency} />
            <span className="ml-1 text-base font-medium text-muted sm:text-lg">
              /{unit}
            </span>
          </p>
        ) : (
          <p className="flex flex-wrap items-baseline gap-x-2 gap-y-1 text-3xl font-bold leading-tight text-primary sm:text-4xl">
            <PriceDisplay price={minPrice} storedCurrency={currency} />
            <span className="text-2xl font-semibold text-muted sm:text-3xl" aria-hidden>
              –
            </span>
            <span>
              <PriceDisplay price={maxPrice} storedCurrency={currency} />
              <span className="ml-1 text-base font-medium text-muted sm:text-lg">
                /{unit}
              </span>
            </span>
          </p>
        )}
      </div>
      <p className="mt-2 text-sm text-muted">Prices are in {selected}</p>
      <p className="mt-3 flex items-center gap-1.5 text-sm text-muted">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" />
        MOQ: {moq}/{unit}
      </p>
    </div>
  );
}
