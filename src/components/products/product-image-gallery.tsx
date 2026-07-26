"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { ProductComingSoonImage } from "@/components/products/product-coming-soon-image";
import { cn } from "@/lib/utils";

interface ProductImageGalleryProps {
  displayImage?: string;
  additionalImages?: string[];
  /** @deprecated */
  mainImage?: string;
  /** @deprecated */
  subImages?: string[];
  /** @deprecated */
  images?: string[];
  comingSoon?: boolean;
  alt: string;
  className?: string;
}

const AUTO_SLIDE_MS = 10_000;

export function ProductImageGallery({
  displayImage,
  additionalImages = [],
  mainImage,
  subImages = [],
  images,
  comingSoon,
  alt,
  className,
}: ProductImageGalleryProps) {
  const resolvedDisplay =
    displayImage || mainImage || images?.[0] || undefined;
  const resolvedAdditional =
    additionalImages.length > 0
      ? additionalImages
      : subImages.length > 0
        ? subImages
        : images && images.length > 1
          ? images.slice(1)
          : [];

  const gallery = [
    ...(resolvedDisplay ? [resolvedDisplay] : []),
    ...resolvedAdditional.filter((s) => s && s !== resolvedDisplay),
  ];

  const isComingSoon = comingSoon || gallery.length === 0;

  const [modalOpen, setModalOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);

  const openModal = (index: number) => {
    if (isComingSoon || gallery.length === 0) return;
    setModalIndex(index);
    setModalOpen(true);
  };

  const goPrev = useCallback(() => {
    setModalIndex((i) => (i - 1 + gallery.length) % gallery.length);
  }, [gallery.length]);

  const goNext = useCallback(() => {
    setModalIndex((i) => (i + 1) % gallery.length);
  }, [gallery.length]);

  useEffect(() => {
    if (!modalOpen || gallery.length <= 1) return;
    const id = window.setInterval(goNext, AUTO_SLIDE_MS);
    return () => window.clearInterval(id);
  }, [modalOpen, gallery.length, goNext, modalIndex]);

  useEffect(() => {
    if (!modalOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setModalOpen(false);
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [modalOpen, goPrev, goNext]);

  if (isComingSoon) {
    return (
      <div className={cn("w-full max-w-xl", className)}>
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-gray-100 bg-light-gray/40 shadow-sm sm:aspect-square">
          <ProductComingSoonImage priority sizes="(max-width: 768px) 100vw, 560px" />
        </div>
      </div>
    );
  }

  const thumbs = gallery;

  return (
    <>
      <div
        className={cn(
          "grid w-full max-w-4xl grid-cols-1 gap-3",
          thumbs.length > 1 &&
            "sm:grid-cols-[minmax(0,1.4fr)_minmax(140px,0.65fr)]",
          className,
        )}
      >
        <button
          type="button"
          onClick={() => openModal(0)}
          className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-gray-100 bg-light-gray/40 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:aspect-square"
          aria-label={`View ${alt} full size`}
        >
          <Image
            src={gallery[0]!}
            alt={alt}
            fill
            className="object-contain p-1"
            priority
            sizes="(max-width: 640px) 100vw, 480px"
            unoptimized
          />
        </button>

        {thumbs.length > 1 && (
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-2 sm:content-start">
            {thumbs.map((src, i) => (
              <button
                key={`${src}-${i}`}
                type="button"
                onClick={() => openModal(i)}
                className={cn(
                  "relative aspect-square overflow-hidden rounded-xl border-2 bg-light-gray/30 transition-colors",
                  i === 0
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-gray-100 hover:border-gray-200",
                )}
                aria-label={`Open image ${i + 1}`}
              >
                <Image
                  src={src}
                  alt={`${alt} ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 25vw, 120px"
                  unoptimized
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {modalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-3 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label="Product image gallery"
          onClick={() => setModalOpen(false)}
        >
          <button
            type="button"
            className="absolute right-3 top-3 z-10 rounded-full bg-white/15 p-2 text-white backdrop-blur hover:bg-white/25 sm:right-6 sm:top-6"
            onClick={() => setModalOpen(false)}
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>

          {gallery.length > 1 && (
            <>
              <button
                type="button"
                className="absolute left-2 z-10 rounded-full bg-white/15 p-2.5 text-white backdrop-blur hover:bg-white/25 sm:left-6"
                onClick={(e) => {
                  e.stopPropagation();
                  goPrev();
                }}
                aria-label="Previous image"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                type="button"
                className="absolute right-2 z-10 rounded-full bg-white/15 p-2.5 text-white backdrop-blur hover:bg-white/25 sm:right-6"
                onClick={(e) => {
                  e.stopPropagation();
                  goNext();
                }}
                aria-label="Next image"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          <div
            className="relative flex h-[min(80vh,720px)] w-full max-w-5xl items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-full w-full">
              <Image
                src={gallery[modalIndex]!}
                alt={`${alt} — image ${modalIndex + 1}`}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 90vw"
                unoptimized
                priority
              />
            </div>
          </div>

          {gallery.length > 1 && (
            <p className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-xs text-white">
              {modalIndex + 1} / {gallery.length}
            </p>
          )}
        </div>
      )}
    </>
  );
}
