"use client";

import { useEffect, useMemo, useState } from "react";
import { Globe } from "lucide-react";
import { getCircleFlagUrl, getCountryMeta } from "@/lib/countries";
import { cn } from "@/lib/utils";

interface CountryFlagIconProps {
  country: string;
  size?: number;
  className?: string;
}

/** flagcdn as secondary CDN (PNG) when circle-flags SVG fails */
function flagCdnUrl(code: string): string | null {
  const c = code.toLowerCase();
  if (c.length !== 2 || c === "ea" || c === "wa") return null;
  return `https://flagcdn.com/w80/${c}.png`;
}

/**
 * Cross-platform circular flags via SVG/PNG images.
 * Avoids emoji flags (Windows shows "ET", "FR", etc. instead of glyphs).
 */
export function CountryFlagIcon({
  country,
  size = 18,
  className,
}: CountryFlagIconProps) {
  const { code } = getCountryMeta(country);
  const primary = getCircleFlagUrl(country);
  const secondary = flagCdnUrl(code);

  const sources = useMemo(
    () => [primary, secondary].filter(Boolean) as string[],
    [primary, secondary],
  );

  const [sourceIndex, setSourceIndex] = useState(0);

  useEffect(() => {
    setSourceIndex(0);
  }, [country]);

  const src = sources[sourceIndex] ?? null;
  const useFallback =
    code === "EA" ||
    code === "WA" ||
    sources.length === 0 ||
    sourceIndex >= sources.length;

  if (useFallback) {
    return (
      <span
        className={cn(
          "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-primary-muted to-secondary-muted text-secondary shadow-sm ring-1 ring-black/10",
          className,
        )}
        style={{ width: size, height: size }}
        title={country}
        aria-hidden
      >
        {code === "EA" || code === "WA" || !/^[A-Z]{2}$/.test(code) ? (
          <Globe
            className="text-primary"
            style={{ width: size * 0.55, height: size * 0.55 }}
            strokeWidth={2}
          />
        ) : (
          <span
            className="font-bold leading-none tracking-tight"
            style={{ fontSize: Math.max(9, size * 0.32) }}
          >
            {code.slice(0, 2)}
          </span>
        )}
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      key={src}
      src={src!}
      alt=""
      width={size}
      height={size}
      className={cn(
        "inline-block shrink-0 rounded-full bg-light-gray object-cover shadow-sm ring-1 ring-black/10",
        className,
      )}
      style={{ width: size, height: size }}
      onError={() => setSourceIndex((i) => i + 1)}
      loading="lazy"
      decoding="async"
    />
  );
}
