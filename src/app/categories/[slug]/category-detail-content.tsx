"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import { getCategoryBySlug } from "@/lib/api/categories";
import { SubcategoryImageCard } from "@/components/categories/subcategory-image-card";
import { CategoryBreadcrumbs } from "@/components/shared/category-breadcrumbs";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";

interface CategoryDetailContentProps {
  slug: string;
}

export function CategoryDetailContent({ slug }: CategoryDetailContentProps) {
  const { data: category, isLoading, isError } = useQuery({
    queryKey: ["category", slug],
    queryFn: () => getCategoryBySlug(slug),
  });

  if (isLoading) {
    return (
      <p className="container-main py-20 text-center text-muted">Loading category...</p>
    );
  }

  if (isError || !category) {
    notFound();
  }

  const subcategories = category.subcategories ?? [];

  return (
    <section className="py-8 sm:py-12">
      <div className="container-main">
        <CategoryBreadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: category.name },
          ]}
          className="mb-4"
        />
        <h1 className="text-2xl font-bold text-dark-gray sm:text-3xl">
          Category — {category.name}
        </h1>
        {category.description && (
          <p className="mt-2 max-w-2xl text-muted">{category.description}</p>
        )}

        {subcategories.length === 0 ? (
          <div className="mt-10 space-y-4 text-center">
            <EmptyState
              title="No subcategories yet"
              message="Browse all products in this category."
            />
            <Button asChild>
              <Link href={`/products?category=${encodeURIComponent(category.slug)}`}>
                View products
              </Link>
            </Button>
          </div>
        ) : (
          <>
            <h2 className="mt-8 mb-4 text-lg font-semibold text-dark-gray">Products</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {subcategories.map((sub, i) => (
                <SubcategoryImageCard
                  key={sub.id}
                  categorySlug={category.slug}
                  subcategory={sub}
                  index={i}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
