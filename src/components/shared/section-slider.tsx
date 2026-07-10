"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SectionSliderProps<T> {
  items: T[];
  itemsPerPage: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  gridClassName?: string;
  className?: string;
  autoPlay?: boolean;
  autoPlayIntervalMs?: number;
}

export function SectionSlider<T>({
  items,
  itemsPerPage,
  renderItem,
  gridClassName = "grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4",
  className,
  autoPlay = false,
  autoPlayIntervalMs = 5000,
}: SectionSliderProps<T>) {
  const [page, setPage] = useState(0);
  const [paused, setPaused] = useState(false);
  const pageRef = useRef(0);

  const totalPages = Math.max(1, Math.ceil(items.length / itemsPerPage));
  const currentPage = Math.min(page, totalPages - 1);

  pageRef.current = currentPage;

  const pageItems = useMemo(() => {
    const start = currentPage * itemsPerPage;
    return items.slice(start, start + itemsPerPage);
  }, [items, currentPage, itemsPerPage]);

  useEffect(() => {
    if (!autoPlay || totalPages <= 1 || paused) return;
    const timer = setInterval(() => {
      setPage((p) => (pageRef.current + 1) % totalPages);
    }, autoPlayIntervalMs);
    return () => clearInterval(timer);
  }, [autoPlay, autoPlayIntervalMs, totalPages, paused]);

  if (items.length === 0) return null;

  const canPrev = currentPage > 0;
  const canNext = currentPage < totalPages - 1;

  return (
    <div
      className={cn("space-y-5", className)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className={gridClassName}>
        {pageItems.map((item, i) => renderItem(item, currentPage * itemsPerPage + i))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            aria-label="Previous"
            disabled={!canPrev}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white text-secondary shadow-sm transition-colors hover:bg-secondary hover:text-white disabled:pointer-events-none disabled:opacity-40"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to page ${i + 1}`}
                onClick={() => setPage(i)}
                className={cn(
                  "h-2 rounded-full transition-all",
                  i === currentPage ? "w-8 bg-secondary" : "w-2 bg-border hover:bg-secondary/40",
                )}
              />
            ))}
          </div>

          <button
            type="button"
            aria-label="Next"
            disabled={!canNext}
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white text-secondary shadow-sm transition-colors hover:bg-secondary hover:text-white disabled:pointer-events-none disabled:opacity-40"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
}
