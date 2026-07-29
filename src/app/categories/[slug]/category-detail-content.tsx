"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import { getCategoryBySlug } from "@/lib/api/categories";
import { getProductsPaginated } from "@/lib/api/products";
import { ProductCard } from "@/components/products/product-card";
import { CategoryBreadcrumbs } from "@/components/shared/category-breadcrumbs";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { ProductGridSkeleton } from "@/components/shared/skeletons";

interface CategoryDetailContentProps {
  slug: string;
}

export function CategoryDetailContent({ slug }: CategoryDetailContentProps) {
  const { data: category, isLoading, isError } = useQuery({
    queryKey: ["category", slug],
    queryFn: () => getCategoryBySlug(slug),
  });

  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: ["category-products", category?.id],
    queryFn: () =>
      getProductsPaginated({ category: category!.id, page: 1, limit: 24 }),
    enabled: !!category?.id,
  });

  if (isLoading) {
    return (
      <p className="container-main py-20 text-center text-muted">Loading category...</p>
    );
  }

  if (isError || !category) {
    notFound();
  }

  const products = productsData?.products ?? [];

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
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-dark-gray sm:text-3xl">
              {category.name}
            </h1>
            {category.description && (
              <p className="mt-2 max-w-2xl text-muted">{category.description}</p>
            )}
          </div>
          <Button asChild variant="outline">
            <Link href={`/products?category=${encodeURIComponent(category.slug)}`}>
              View all products
            </Link>
          </Button>
        </div>

        {productsLoading ? (
          <ProductGridSkeleton />
        ) : products.length === 0 ? (
          <EmptyState
            title="No products yet"
            message="Products in this category will appear here once they are added."
          />
        ) : (
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-2 sm:gap-3 lg:grid-cols-5">
            {products.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
