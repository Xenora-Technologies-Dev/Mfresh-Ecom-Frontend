"use client";

import { Globe } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CURRENCY_OPTIONS } from "@/lib/currency";
import { useCurrencyStore } from "@/store/currency-store";

interface CurrencySwitcherProps {
  compact?: boolean;
  className?: string;
}

export function CurrencySwitcher({ compact, className }: CurrencySwitcherProps) {
  const { currency, setCurrency } = useCurrencyStore();

  return (
    <div className={className}>
      <Select value={currency} onValueChange={(v) => setCurrency(v as typeof currency)}>
        <SelectTrigger
          className={
            compact
              ? "h-8 w-[88px] border-0 bg-transparent text-xs font-medium shadow-none focus:ring-0"
              : "h-9 w-[120px] text-sm"
          }
          aria-label="Select currency"
        >
          {!compact && <Globe className="mr-1.5 h-3.5 w-3.5 shrink-0 text-muted" />}
          <SelectValue />
        </SelectTrigger>
        <SelectContent align="end">
          {CURRENCY_OPTIONS.map((opt) => (
            <SelectItem key={opt.code} value={opt.code}>
              {opt.code} — {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
