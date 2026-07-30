"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useDebounce } from "@/hooks/use-debounce";
import { globalSearch } from "@/lib/api/search";
import { ProductCard } from "@/components/products/product-card";
import { CategoryCard } from "@/components/categories/category-card";
import { PageHero } from "@/components/shared/page-hero";
import { SearchBar } from "@/components/layout/search-bar";

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const debouncedQuery = useDebounce(query, 300);

  const { data, isLoading } = useQuery({
    queryKey: ["search", debouncedQuery],
    queryFn: () => globalSearch(debouncedQuery),
    enabled: debouncedQuery.length > 0,
  });

  if (!debouncedQuery) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 py-16 text-center">
        <p className="text-muted">Enter a search term to find products and categories.</p>
      </div>
    );
  }

  if (isLoading) {
    return <p className="text-center text-muted py-10">Searching...</p>;
  }

  const productCount = data?.products.length ?? 0;
  const categoryCount = data?.categories.length ?? 0;
  const total = productCount + categoryCount;

  if (!data || total === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 py-16 text-center">
        <p className="text-muted">No results found for &ldquo;{debouncedQuery}&rdquo;</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {data.products.length > 0 && (
        <div>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-dark-gray">
              Products ({data.products.length})
            </h2>
            <Link href={`/products?q=${encodeURIComponent(debouncedQuery)}`} className="text-sm font-semibold text-primary">
              View all
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-2 sm:gap-3 lg:grid-cols-5">
            {data.products.slice(0, 10).map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </div>
      )}

      {data.categories.length > 0 && (
        <div>
          <h2 className="mb-6 text-xl font-bold text-dark-gray">
            Categories ({data.categories.length})
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {data.categories.map((c, i) => (
              <CategoryCard key={c.id} category={c} index={i} variant="compact" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function SearchPageContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "";

  return (
    <>
      <PageHero title="Search" subtitle="Find products and categories">
        <div className="mx-auto max-w-xl">
          <SearchBar defaultValue={query} />
        </div>
      </PageHero>
      <section className="py-10 sm:py-14">
        <div className="container-main">
          <SearchResults />
        </div>
      </section>
    </>
  );
}
