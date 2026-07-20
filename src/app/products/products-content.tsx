"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";
import { getProductsPaginated } from "@/lib/api/products";
import { getCategories } from "@/lib/api/categories";
import { ProductCard } from "@/components/products/product-card";
import { ProductFiltersPanel } from "@/components/products/product-filters";
import { CategoryBreadcrumbs, type BreadcrumbItem } from "@/components/shared/category-breadcrumbs";
import { SearchBar } from "@/components/layout/search-bar";
import { ProductGridSkeleton } from "@/components/shared/skeletons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ProductFilters } from "@/types";

function buildProductsUrl(filters: ProductFilters, categories: { id: string; slug: string; subcategories: { id: string; slug: string }[] }[]) {
  const params = new URLSearchParams();
  const cat = categories.find((c) => c.id === filters.category);
  if (cat) {
    params.set("category", cat.slug);
    const sub = cat.subcategories.find((s) => s.id === filters.subCategory);
    if (sub) params.set("subcategory", sub.slug);
  }
  if (filters.country) params.set("country", filters.country);
  if (filters.search) params.set("q", filters.search);
  const qs = params.toString();
  return qs ? `/products?${qs}` : "/products";
}

export default function ProductsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categorySlug = searchParams.get("category");
  const subcategorySlug = searchParams.get("subcategory");

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
    () => categories.find((c) => c.id === filters.category),
    [categories, filters.category],
  );

  const activeSubcategory = useMemo(
    () =>
      activeCategory?.subcategories.find((s) => s.id === filters.subCategory),
    [activeCategory, filters.subCategory],
  );

  // Hydrate category/subcategory from URL whenever query params or categories change
  useEffect(() => {
    if (!categories.length) return;

    const cat = categorySlug
      ? categories.find((c) => c.slug === categorySlug)
      : undefined;
    const sub =
      cat && subcategorySlug
        ? cat.subcategories.find((s) => s.slug === subcategorySlug)
        : undefined;

    const nextCategory = cat?.id;
    const nextSub = sub?.id;

    setFilters((prev) => {
      if (prev.category === nextCategory && prev.subCategory === nextSub) {
        return prev;
      }
      return {
        ...prev,
        category: nextCategory,
        subCategory: nextSub,
      };
    });
  }, [categories, categorySlug, subcategorySlug]);

  useEffect(() => {
    setPage(1);
  }, [categorySlug, subcategorySlug]);

  const applyFilters = useCallback(
    (next: ProductFilters, options?: { syncUrl?: boolean }) => {
      setFilters(next);
      setPage(1);
      if (options?.syncUrl !== false) {
        router.replace(buildProductsUrl(next, categories), { scroll: false });
      }
    },
    [categories, router],
  );

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["products", filters, page],
    queryFn: () => getProductsPaginated({ ...filters, page, limit: 12 }),
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
    applyFilters({});
  };

  const breadcrumbItems = useMemo((): BreadcrumbItem[] => {
    const items: BreadcrumbItem[] = [{ label: "Home", href: "/" }];
    if (activeCategory) {
      items.push({
        label: activeCategory.name,
        href: `/categories/${activeCategory.slug}`,
      });
    }
    if (activeSubcategory) {
      items.push({
        label: activeSubcategory.name,
        href: `/products?category=${encodeURIComponent(activeCategory!.slug)}&subcategory=${encodeURIComponent(activeSubcategory.slug)}`,
      });
    } else if (!activeCategory) {
      items.push({ label: "Products", href: "/products" });
    }
    return items;
  }, [activeCategory, activeSubcategory]);

  const pageTitle = activeSubcategory
    ? `${activeCategory?.name} — ${activeSubcategory.name}`
    : activeCategory
      ? activeCategory.name
      : "Products";

  return (
    <section className="py-8 sm:py-12">
      <div className="container-main">
        <CategoryBreadcrumbs items={breadcrumbItems} className="mb-4" />

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-dark-gray sm:text-3xl">
              {pageTitle}
            </h1>
            <p className="mt-1 text-sm text-muted">
              {activeCategory?.description ||
                "Browse premium wholesale food ingredients from verified global suppliers"}
            </p>
          </div>
          <div className="w-full max-w-md">
            <SearchBar
              defaultValue={filters.search ?? ""}
              onSearch={(q) => {
                applyFilters({ ...filters, search: q || undefined });
              }}
            />
          </div>
        </div>

        {activeCategory && activeCategory.subcategories.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            <Link
              href={`/products?category=${encodeURIComponent(activeCategory.slug)}`}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors sm:text-sm",
                !activeSubcategory
                  ? "border-primary bg-primary text-white"
                  : "border-border bg-white text-dark-gray hover:border-primary/40",
              )}
            >
              All {activeCategory.name}
            </Link>
            {activeCategory.subcategories.map((sub) => (
              <Link
                key={sub.id}
                href={`/products?category=${encodeURIComponent(activeCategory.slug)}&subcategory=${encodeURIComponent(sub.slug)}`}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors sm:text-sm",
                  activeSubcategory?.id === sub.id
                    ? "border-primary bg-primary text-white"
                    : "border-border bg-white text-dark-gray hover:border-primary/40",
                )}
              >
                {sub.name}
              </Link>
            ))}
          </div>
        )}

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
              filters={filters}
              onChange={(f) => applyFilters(f)}
              onReset={handleReset}
            />
          </aside>
          <div>
            <p className="mb-6 hidden text-sm text-muted lg:block">
              {isLoading
                ? "Loading products..."
                : `${meta?.total ?? products.length} product${(meta?.total ?? products.length) !== 1 ? "s" : ""} found`}
            </p>
            {isLoading ? (
              <ProductGridSkeleton count={6} />
            ) : products.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-200 py-16 text-center">
                <p className="text-muted">
                  {activeSubcategory
                    ? `No products in ${activeSubcategory.name} yet.`
                    : activeCategory
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
  );
}
