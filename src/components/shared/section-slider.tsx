"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  useResponsivePageSize,
  type BreakpointColumns,
} from "@/hooks/use-responsive-page-size";
import { cn } from "@/lib/utils";

const FALLBACK_COLUMNS: BreakpointColumns = { base: 1 };

interface SectionSliderProps<T> {
  items: T[];
  /** Fixed page size (ignored when `columns` + `rows` are set). */
  itemsPerPage?: number;
  /**
   * Column counts matching the grid breakpoints. Page size becomes
   * columns × rows so every page fills complete rows before the next slide.
   */
  columns?: BreakpointColumns;
  /** Rows per slide when using `columns`. Defaults to 2. */
  rows?: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  gridClassName?: string;
  className?: string;
  autoPlay?: boolean;
  autoPlayIntervalMs?: number;
  /** Keep grid height stable when the last page has fewer items */
  fillEmptySlots?: boolean;
}

export function SectionSlider<T>({
  items,
  itemsPerPage: fixedPerPage = 8,
  columns,
  rows = 2,
  renderItem,
  gridClassName = "grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4",
  className,
  autoPlay = false,
  autoPlayIntervalMs = 5000,
  fillEmptySlots = false,
}: SectionSliderProps<T>) {
  const responsivePerPage = useResponsivePageSize(
    columns ?? FALLBACK_COLUMNS,
    columns ? rows : 1,
  );
  const itemsPerPage = columns ? responsivePerPage : fixedPerPage;

  const [page, setPage] = useState(0);
  const [paused, setPaused] = useState(false);
  const [ready, setReady] = useState(false);
  const pageRef = useRef(0);

  const pages = useMemo(() => {
    const chunks: T[][] = [];
    for (let i = 0; i < items.length; i += itemsPerPage) {
      chunks.push(items.slice(i, i + itemsPerPage));
    }
    return chunks.length > 0 ? chunks : [[] as T[]];
  }, [items, itemsPerPage]);

  const totalPages = Math.max(1, pages.length);
  const currentPage = Math.min(page, totalPages - 1);
  pageRef.current = currentPage;

  // Enable transition only after first paint so the track isn't mid-slide on mount
  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    setPage(0);
  }, [itemsPerPage]);

  useEffect(() => {
    if (page > totalPages - 1) setPage(totalPages - 1);
  }, [page, totalPages]);

  useEffect(() => {
    if (!autoPlay || totalPages <= 1 || paused) return;
    const timer = setInterval(() => {
      setPage((pageRef.current + 1) % totalPages);
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
      <div className="overflow-hidden">
        <div
          className={cn(
            "flex will-change-transform",
            ready && "transition-transform duration-500 ease-out",
          )}
          style={{ transform: `translate3d(-${currentPage * 100}%, 0, 0)` }}
        >
          {pages.map((pageItems, pageIndex) => {
            const emptyCount =
              fillEmptySlots && pageItems.length > 0
                ? Math.max(0, itemsPerPage - pageItems.length)
                : 0;

            return (
              <div
                key={pageIndex}
                className={cn("w-full shrink-0", gridClassName)}
                aria-hidden={pageIndex !== currentPage}
              >
                {pageItems.map((item, i) =>
                  renderItem(item, pageIndex * itemsPerPage + i),
                )}
                {Array.from({ length: emptyCount }).map((_, i) => (
                  <div
                    key={`empty-${pageIndex}-${i}`}
                    className="invisible min-h-[7.5rem]"
                    aria-hidden
                  />
                ))}
              </div>
            );
          })}
        </div>
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
                  i === currentPage
                    ? "w-8 bg-secondary"
                    : "w-2 bg-border hover:bg-secondary/40",
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
