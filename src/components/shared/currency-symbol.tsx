import { CURRENCY_OPTIONS, type SupportedCurrency } from "@/lib/currency";
import { cn } from "@/lib/utils";

interface CurrencySymbolProps {
  code: SupportedCurrency;
  className?: string;
}

export function CurrencySymbol({ code, className }: CurrencySymbolProps) {
  const option = CURRENCY_OPTIONS.find((c) => c.code === code);

  return (
    <span
      dir="ltr"
      className={cn(
        "inline-flex shrink-0 items-center justify-center font-semibold leading-none",
        code === "AED" && "text-[13px] tracking-tight",
        code === "SGD" && "text-xs",
        className,
      )}
      aria-hidden
    >
      {option?.symbol ?? "$"}
    </span>
  );
}
