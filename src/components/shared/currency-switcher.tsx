"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { CurrencySymbol } from "@/components/shared/currency-symbol";
import {
  CURRENCY_OPTIONS,
  type SupportedCurrency,
} from "@/lib/currency";
import { useCurrencyStore } from "@/store/currency-store";
import { cn } from "@/lib/utils";

interface CurrencySwitcherProps {
  compact?: boolean;
  className?: string;
}

const VALID_CURRENCIES = new Set<SupportedCurrency>(["USD", "AED", "SGD"]);

function normalizeCurrency(value: string): SupportedCurrency {
  const upper = value.toUpperCase() as SupportedCurrency;
  return VALID_CURRENCIES.has(upper) ? upper : "USD";
}

export function CurrencySwitcher({ compact, className }: CurrencySwitcherProps) {
  const { currency, setCurrency } = useCurrencyStore();
  const active = normalizeCurrency(currency);

  return (
    <div className={cn("shrink-0", className)}>
      <Select
        value={active}
        onValueChange={(v) => setCurrency(normalizeCurrency(v))}
      >
        <SelectTrigger
          className={cn(
            "gap-1.5 border-border/80 bg-white font-semibold text-dark-gray shadow-sm focus:ring-primary/20",
            compact ? "h-9 min-w-[84px] px-2.5 text-xs" : "h-10 min-w-[92px] px-3 text-sm",
          )}
          aria-label={`Currency: ${active}`}
        >
          <CurrencySymbol code={active} className="text-primary" />
          <span className="truncate">{active}</span>
        </SelectTrigger>
        <SelectContent align="end" className="z-[200] min-w-[200px]">
          {CURRENCY_OPTIONS.map((opt) => (
            <SelectItem key={opt.code} value={opt.code} className="cursor-pointer">
              <span className="flex items-center gap-2">
                <CurrencySymbol code={opt.code} className="w-5 text-primary" />
                <span className="font-semibold">{opt.code}</span>
                <span className="text-muted">— {opt.label}</span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
