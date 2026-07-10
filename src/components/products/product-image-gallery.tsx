"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ImageIcon } from "lucide-react";
import { PLACEHOLDER_IMAGE } from "@/lib/api/client";
import { cn } from "@/lib/utils";

interface ProductImageGalleryProps {
  mainImage?: string;
  subImages?: string[];
  /** @deprecated use mainImage + subImages */
  images?: string[];
  alt: string;
  className?: string;
}

function Placeholder({ label }: { label: string }) {
  return (
    <div className="flex h-[280px] w-full max-w-xl flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-gray-200 bg-light-gray/50 text-muted sm:h-[360px]">
      <ImageIcon className="h-14 w-14 opacity-35" />
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}

export function ProductImageGallery({
  mainImage,
  subImages = [],
  images,
  alt,
  className,
}: ProductImageGalleryProps) {
  const legacyMain = images?.[0];
  const legacySubs = images && images.length > 1 ? images.slice(1) : [];
  const resolvedMain = mainImage || legacyMain;
  const resolvedSubs =
    subImages.length > 0
      ? subImages.filter((s) => s && s !== resolvedMain)
      : legacySubs.filter((s) => s && s !== resolvedMain);

  const gallery = [
    ...(resolvedMain ? [resolvedMain] : []),
    ...resolvedSubs,
  ];

  const [active, setActive] = useState(0);
  const [subPage, setSubPage] = useState(0);

  if (!resolvedMain && resolvedSubs.length === 0) {
    return (
      <div className={cn("flex justify-start", className)}>
        <Placeholder label="No Image" />
      </div>
    );
  }

  const current = gallery[active] ?? resolvedMain ?? resolvedSubs[0]!;
  const hasSubs = resolvedSubs.length > 0;
  const subsPerPage = 4;
  const subPages = Math.max(1, Math.ceil(resolvedSubs.length / subsPerPage));
  const visibleSubs = resolvedSubs.slice(
    subPage * subsPerPage,
    subPage * subsPerPage + subsPerPage,
  );

  // Main only — constrained card, not full page width
  if (!hasSubs) {
    return (
      <div className={cn("w-full max-w-xl", className)}>
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-gray-100 bg-light-gray/40 shadow-sm">
          <Image
            src={current || PLACEHOLDER_IMAGE}
            alt={alt}
            fill
            className="object-contain p-1"
            priority
            sizes="(max-width: 768px) 100vw, 560px"
            unoptimized
          />
        </div>
      </div>
    );
  }

  // Main + subs — FoodVessel-style: large left, 2x2 grid right
  return (
    <div
      className={cn(
        "grid w-full max-w-4xl grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1.4fr)_minmax(160px,0.7fr)]",
        className,
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-gray-100 bg-light-gray/40 shadow-sm sm:aspect-square">
        <Image
          src={current || PLACEHOLDER_IMAGE}
          alt={alt}
          fill
          className="object-contain p-1"
          priority
          sizes="(max-width: 640px) 100vw, 480px"
          unoptimized
        />
        {gallery.length > 1 && (
          <>
            <button
              type="button"
              onClick={() =>
                setActive((a) => (a - 1 + gallery.length) % gallery.length)
              }
              className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/95 p-2 shadow-md hover:bg-white"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => setActive((a) => (a + 1) % gallery.length)}
              className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/95 p-2 shadow-md hover:bg-white"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      <div className="flex flex-col justify-between gap-2">
        <div className="grid grid-cols-2 gap-2">
          {visibleSubs.map((src, i) => {
            const globalIdx = gallery.indexOf(src);
            const thumbIdx = globalIdx >= 0 ? globalIdx : i + 1;
            return (
              <button
                key={`${src}-${i}`}
                type="button"
                onClick={() => setActive(thumbIdx)}
                className={cn(
                  "relative aspect-square overflow-hidden rounded-xl border-2 bg-light-gray/30 transition-colors",
                  active === thumbIdx
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-gray-100 hover:border-gray-200",
                )}
              >
                <Image
                  src={src}
                  alt={`${alt} ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="140px"
                  unoptimized
                />
              </button>
            );
          })}
        </div>
        {subPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <button
              type="button"
              disabled={subPage === 0}
              onClick={() => setSubPage((p) => Math.max(0, p - 1))}
              className="rounded-full border border-border p-1 disabled:opacity-40"
              aria-label="Previous sub images"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-xs text-muted">
              {subPage + 1} / {subPages}
            </span>
            <button
              type="button"
              disabled={subPage >= subPages - 1}
              onClick={() => setSubPage((p) => Math.min(subPages - 1, p + 1))}
              className="rounded-full border border-border p-1 disabled:opacity-40"
              aria-label="Next sub images"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
