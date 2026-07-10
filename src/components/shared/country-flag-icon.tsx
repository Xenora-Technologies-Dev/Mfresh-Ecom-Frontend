"use client";

import { useState } from "react";
import { getCircleFlagUrl, getCountryMeta } from "@/lib/countries";
import { cn } from "@/lib/utils";

interface CountryFlagIconProps {
  country: string;
  size?: number;
  className?: string;
  showEmojiFallback?: boolean;
}

export function CountryFlagIcon({
  country,
  size = 18,
  className,
  showEmojiFallback = true,
}: CountryFlagIconProps) {
  const [failed, setFailed] = useState(false);
  const url = getCircleFlagUrl(country);
  const { flag } = getCountryMeta(country);

  if (!url || failed) {
    if (!showEmojiFallback) return null;
    return (
      <span
        className={cn(
          "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-light-gray text-[0.7em] leading-none shadow-sm ring-1 ring-black/5",
          className,
        )}
        style={{ width: size, height: size }}
        aria-hidden
      >
        {flag}
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={url}
      alt=""
      width={size}
      height={size}
      className={cn(
        "inline-block shrink-0 rounded-full object-cover shadow-sm ring-1 ring-black/10",
        className,
      )}
      style={{ width: size, height: size }}
      onError={() => setFailed(true)}
      loading="lazy"
      decoding="async"
    />
  );
}
