"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getCategories } from "@/lib/api/categories";
import { cn } from "@/lib/utils";
import { useRef, useState } from "react";

const CLOSE_DELAY_MS = 150;

export function CategoriesNavDropdown({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { data: categories = [] } = useQuery({
    queryKey: ["categories", "nav"],
    queryFn: getCategories,
    staleTime: 10 * 60 * 1000,
  });

  const handleOpen = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setOpen(true);
  };

  const handleClose = () => {
    closeTimerRef.current = setTimeout(() => setOpen(false), CLOSE_DELAY_MS);
  };

  return (
    <div
      className={cn("relative", className)}
      onMouseEnter={handleOpen}
      onMouseLeave={handleClose}
    >
      <Link
        href="/categories"
        className="inline-flex items-center gap-1 text-sm font-medium text-dark-gray transition-colors hover:text-primary"
      >
        All Categories
        <ChevronDown
          className={cn("h-4 w-4 transition-transform", open && "rotate-180")}
        />
      </Link>
      {open && (
        <div className="absolute left-0 top-full z-50 pt-2">
          <div className="max-h-[70vh] w-[min(90vw,720px)] overflow-y-auto rounded-xl border border-border bg-surface py-3 shadow-xl">
            <Link
              href="/categories"
              className="block px-4 py-2 text-sm font-semibold text-primary hover:bg-primary-muted"
            >
              View All Categories
            </Link>
            <div className="my-2 border-t border-border" />
            {categories.length > 0 ? (
              <div className="grid gap-1 px-2 sm:grid-cols-2 lg:grid-cols-3">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/categories/${cat.slug}`}
                    className="rounded-lg p-2 text-sm font-semibold text-dark-gray hover:bg-light-gray/80 hover:text-primary"
                  >
                    {cat.name}
                    {cat.productCount > 0 && (
                      <span className="ml-1.5 text-xs font-normal text-muted">
                        ({cat.productCount})
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            ) : (
              <>
                <Link href="/categories/seafood" className="block px-4 py-2 text-sm text-dark-gray hover:bg-light-gray">Seafood</Link>
                <Link href="/categories/meat-poultry" className="block px-4 py-2 text-sm text-dark-gray hover:bg-light-gray">Meat & Poultry</Link>
                <Link href="/categories/fresh-produce" className="block px-4 py-2 text-sm text-dark-gray hover:bg-light-gray">Fresh Produce</Link>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
