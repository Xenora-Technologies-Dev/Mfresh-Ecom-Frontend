"use client";

import { useQuery } from "@tanstack/react-query";
import { getCategories } from "@/lib/api/categories";
import { CategoryImageCard } from "@/components/categories/category-image-card";
import { CategoryBreadcrumbs } from "@/components/shared/category-breadcrumbs";
import { PageHero } from "@/components/shared/page-hero";
import { EmptyState } from "@/components/shared/empty-state";

export default function CategoriesPageContent() {
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  return (
    <>
      <PageHero
        title="Food Categories"
        subtitle="Explore our complete range of wholesale food categories for B2B buyers"
      />
      <section className="py-10 sm:py-14">
        <div className="container-main">
          <CategoryBreadcrumbs
            items={[{ label: "Home", href: "/" }, { label: "Categories" }]}
            className="mb-6"
          />
          {isLoading ? (
            <p className="text-center text-muted">Loading categories...</p>
          ) : categories.length === 0 ? (
            <EmptyState
              title="No categories yet"
              message="Categories added in the admin portal will appear here."
            />
          ) : (
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {categories.map((cat, i) => (
                <CategoryImageCard key={cat.id} category={cat} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
