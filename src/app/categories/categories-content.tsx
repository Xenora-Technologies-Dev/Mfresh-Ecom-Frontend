"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getCategories } from "@/lib/api/categories";
import { CategoryCard } from "@/components/categories/category-card";
import { PageHero } from "@/components/shared/page-hero";
import { EmptyState } from "@/components/shared/empty-state";

export default function CategoriesPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categorySlug = searchParams.get("category");

  useEffect(() => {
    if (categorySlug) {
      router.replace(`/products?category=${encodeURIComponent(categorySlug)}`);
    }
  }, [categorySlug, router]);

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  if (categorySlug) {
    return (
      <p className="py-20 text-center text-muted">Redirecting to products...</p>
    );
  }

  return (
    <>
      <PageHero
        title="Categories"
        subtitle="Explore our complete range of premium food categories for B2B buyers"
      />
      <section className="py-10 sm:py-14">
        <div className="container-main">
          {isLoading ? (
            <p className="text-center text-muted">Loading categories...</p>
          ) : categories.length === 0 ? (
            <EmptyState
              title="No categories yet"
              message="Categories added in the admin portal will appear here."
            />
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
              {categories.map((cat, i) => (
                <CategoryCard key={cat.id} category={cat} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
