export type SupportedCurrency = "USD" | "AED" | "SGD";

export const BASE_CURRENCY: SupportedCurrency = "USD";

export const CURRENCY_OPTIONS: {
  code: SupportedCurrency;
  label: string;
  symbol: string;
  locale: string;
}[] = [
  { code: "USD", label: "US Dollar", symbol: "$", locale: "en-US" },
  { code: "AED", label: "UAE Dirham", symbol: "د.إ", locale: "en-AE" },
  { code: "SGD", label: "Singapore Dollar", symbol: "S$", locale: "en-SG" },
];

/** Default exchange rates — base USD. Override via settings API when available. */
export const DEFAULT_EXCHANGE_RATES: Record<SupportedCurrency, number> = {
  USD: 1,
  AED: 3.6725,
  SGD: 1.345,
};

export function convertFromUsd(
  amountUsd: number,
  target: SupportedCurrency,
  rates: Record<SupportedCurrency, number> = DEFAULT_EXCHANGE_RATES,
): number {
  return amountUsd * rates[target];
}

export function toUsdAmount(
  amount: number,
  sourceCurrency: string,
  rates: Record<SupportedCurrency, number> = DEFAULT_EXCHANGE_RATES,
): number {
  const code = (sourceCurrency.toUpperCase() as SupportedCurrency) || BASE_CURRENCY;
  const rate = rates[code] ?? 1;
  return amount / rate;
}

export function formatCurrency(
  amount: number,
  currency: SupportedCurrency = BASE_CURRENCY,
): string {
  const option = CURRENCY_OPTIONS.find((c) => c.code === currency);
  return new Intl.NumberFormat(option?.locale ?? "en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatProductPrice(
  price: number,
  storedCurrency: string = BASE_CURRENCY,
  displayCurrency: SupportedCurrency = BASE_CURRENCY,
  rates: Record<SupportedCurrency, number> = DEFAULT_EXCHANGE_RATES,
): string {
  const usd = toUsdAmount(price, storedCurrency, rates);
  const converted = convertFromUsd(usd, displayCurrency, rates);
  return formatCurrency(converted, displayCurrency);
}
