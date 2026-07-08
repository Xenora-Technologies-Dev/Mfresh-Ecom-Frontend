"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ProductImageGalleryProps {
  images: string[];
  alt: string;
  className?: string;
}

export function ProductImageGallery({
  images,
  alt,
  className,
}: ProductImageGalleryProps) {
  const list = images.length > 0 ? images : [];
  const [active, setActive] = useState(0);
  const current = list[active] ?? list[0];

  if (!current) return null;

  return (
    <div className={cn("space-y-3", className)}>
      <div className="relative aspect-square overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
        <Image
          src={current}
          alt={alt}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </div>
      {list.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {list.map((src, i) => (
            <button
              key={`${src}-${i}`}
              type="button"
              onClick={() => setActive(i)}
              className={cn(
                "relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-colors",
                i === active
                  ? "border-primary"
                  : "border-gray-100 hover:border-gray-200",
              )}
            >
              <Image
                src={src}
                alt={`${alt} ${i + 1}`}
                fill
                className="object-cover"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
