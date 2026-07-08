import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

import {
  BASE_CURRENCY,
  formatCurrency,
  formatProductPrice,
  type SupportedCurrency,
} from "@/lib/currency";

export function formatPrice(
  price: number,
  currency: string = BASE_CURRENCY,
  displayCurrency?: SupportedCurrency,
): string {
  if (displayCurrency && displayCurrency !== currency) {
    return formatProductPrice(price, currency, displayCurrency);
  }
  const code = (currency.toUpperCase() as SupportedCurrency) || BASE_CURRENCY;
  return formatCurrency(price, code);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
