"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getSiteSettings } from "@/lib/api/settings";

const STORAGE_KEY = "mfresh-promo-dismissed";

export function PromoMessageBar() {
  const [dismissed, setDismissed] = useState(true);
  const { data: settings } = useQuery({
    queryKey: ["site-settings"],
    queryFn: getSiteSettings,
    staleTime: 5 * 60 * 1000,
  });

  const message = settings?.promotional_message?.trim();

  useEffect(() => {
    try {
      setDismissed(sessionStorage.getItem(STORAGE_KEY) === "1");
    } catch {
      setDismissed(false);
    }
  }, []);

  if (!message || dismissed) return null;

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-primary via-primary-dark to-secondary text-white">
      <div className="container-main flex items-center justify-center gap-3 py-2.5 pr-10 text-center sm:pr-12">
        <p className="text-[11px] font-medium leading-snug sm:text-xs md:text-sm">
          <Link
            href="/products"
            className="underline-offset-2 hover:underline focus-visible:underline"
          >
            {message}
          </Link>
        </p>
        <button
          type="button"
          aria-label="Dismiss promotional message"
          onClick={() => {
            setDismissed(true);
            try {
              sessionStorage.setItem(STORAGE_KEY, "1");
            } catch {
              /* ignore */
            }
          }}
          className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 hover:bg-white/25 sm:right-3"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
