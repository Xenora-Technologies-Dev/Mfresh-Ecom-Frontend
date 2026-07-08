"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowLeft, ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";
import { getProductsPaginated } from "@/lib/api/products";
import { getCategories } from "@/lib/api/categories";
import { ProductCard } from "@/components/products/product-card";
import { ProductFiltersPanel } from "@/components/products/product-filters";
import { PageHero } from "@/components/shared/page-hero";
import { SearchBar } from "@/components/layout/search-bar";
import { ProductGridSkeleton } from "@/components/shared/skeletons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ProductFilters } from "@/types";

export default function ProductsPageContent() {
  const searchParams = useSearchParams();
  const categorySlug = searchParams.get("category");

  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<ProductFilters>(() => ({
    country: searchParams.get("country") ?? undefined,
    search: searchParams.get("q") ?? undefined,
  }));

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const activeCategory = useMemo(
    () => categories.find((c) => c.slug === categorySlug),
    [categories, categorySlug],
  );

  useEffect(() => {
    if (activeCategory) {
      setFilters((prev) => ({ ...prev, category: activeCategory.id }));
    }
  }, [activeCategory]);

  const resolvedFilters = useMemo(
    () => ({
      ...filters,
      category: activeCategory?.id ?? filters.category,
    }),
    [filters, activeCategory],
  );

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["products", resolvedFilters, page],
    queryFn: () =>
      getProductsPaginated({ ...resolvedFilters, page, limit: 12 }),
  });

  useEffect(() => {
    if (isError) {
      toast.error(
        error instanceof Error ? error.message : "Failed to load products",
      );
    }
  }, [isError, error]);

  const products = data?.products ?? [];
  const meta = data?.meta;

  const handleReset = () => {
    setFilters(activeCategory ? { category: activeCategory.id } : {});
    setPage(1);
  };

  return (
    <>
      <PageHero
        title={activeCategory ? activeCategory.name : "Products"}
        subtitle={
          activeCategory?.description ||
          "Browse premium wholesale food ingredients from verified global suppliers"
        }
      >
        <div className="mx-auto max-w-xl space-y-3">
          <SearchBar
            defaultValue={filters.search ?? ""}
            onSearch={(q) => {
              setFilters((prev) => ({ ...prev, search: q || undefined }));
              setPage(1);
            }}
          />
          {activeCategory && (
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 text-sm text-white/80 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              View all products
            </Link>
          )}
        </div>
      </PageHero>

      <section className="py-8 sm:py-14">
        <div className="container-main">
          <div className="mb-4 flex items-center justify-between gap-3 lg:hidden">
            <p className="text-sm text-muted">
              {isLoading
                ? "Loading..."
                : `${meta?.total ?? products.length} product${(meta?.total ?? products.length) !== 1 ? "s" : ""}`}
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => setFiltersOpen((open) => !open)}
              aria-expanded={filtersOpen}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </Button>
          </div>
          <div className="grid gap-6 lg:grid-cols-[280px_1fr] lg:gap-8">
            <aside
              className={cn(
                "lg:sticky lg:top-28 lg:block lg:self-start",
                filtersOpen ? "block" : "hidden",
              )}
            >
              <ProductFiltersPanel
                filters={resolvedFilters}
                onChange={(f) => {
                  setFilters(f);
                  setPage(1);
                }}
                onReset={handleReset}
              />
            </aside>
            <div>
              <p className="mb-6 hidden text-sm text-muted lg:block">
                {isLoading
                  ? "Loading products..."
                  : `${meta?.total ?? products.length} product${(meta?.total ?? products.length) !== 1 ? "s" : ""} found`}
                {activeCategory ? ` in ${activeCategory.name}` : ""}
              </p>
              {isLoading ? (
                <ProductGridSkeleton count={6} />
              ) : products.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-gray-200 py-16 text-center">
                  <p className="text-muted">
                    {activeCategory
                      ? `No products in ${activeCategory.name} yet.`
                      : "No products match your filters."}
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-3">
                    {products.map((product, i) => (
                      <ProductCard key={product.id} product={product} index={i} />
                    ))}
                  </div>
                  {meta && meta.totalPages > 1 && (
                    <div className="mt-8 flex items-center justify-between">
                      <p className="text-sm text-muted">
                        Page {meta.page} of {meta.totalPages}
                      </p>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={page <= 1}
                          onClick={() => setPage((p) => p - 1)}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={page >= meta.totalPages}
                          onClick={() => setPage((p) => p + 1)}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
