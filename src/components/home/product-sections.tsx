"use client";

import { useQuery } from "@tanstack/react-query";
import { getCategories } from "@/lib/api/categories";
import {
  getFeaturedProducts,
  getNewArrivals,
  getPopularProducts,
} from "@/lib/api/products";
import { CategoryCard } from "@/components/categories/category-card";
import { ProductCard } from "@/components/products/product-card";
import { AnimatedSection } from "@/components/shared/animated-section";
import { SectionHeader } from "@/components/shared/section-header";
import type { Product } from "@/types";

export function CategoriesSection() {
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  if (!isLoading && categories.length === 0) return null;

  return (
    <AnimatedSection className="py-14 sm:py-20 fresh-section">
      <div className="container-main">
        <SectionHeader
          title="All Categories"
          subtitle="Browse our full catalog of wholesale food categories"
          href="/categories"
        />
        {isLoading ? (
          <p className="text-center text-muted">Loading categories...</p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 xl:grid-cols-5">
            {categories.map((cat, i) => (
              <CategoryCard key={cat.id} category={cat} index={i} />
            ))}
          </div>
        )}
      </div>
    </AnimatedSection>
  );
}

function ProductGridSection({
  title,
  subtitle,
  queryKey,
  queryFn,
  href,
  alternateBg = false,
}: {
  title: string;
  subtitle: string;
  queryKey: string[];
  queryFn: () => Promise<Product[]>;
  href: string;
  alternateBg?: boolean;
}) {
  const { data: products = [], isLoading } = useQuery({ queryKey, queryFn });

  if (!isLoading && products.length === 0) return null;

  return (
    <AnimatedSection
      className={
        alternateBg ? "py-14 sm:py-20 fresh-section-alt" : "py-14 sm:py-20 bg-surface"
      }
    >
      <div className="container-main">
        <SectionHeader title={title} subtitle={subtitle} href={href} />
        {isLoading ? (
          <p className="text-center text-muted">Loading products...</p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}
      </div>
    </AnimatedSection>
  );
}

export function PopularProductsSection() {
  return (
    <ProductGridSection
      title="Popular Products"
      subtitle="Top picks trusted by leading hospitality and retail brands"
      queryKey={["products", "popular"]}
      queryFn={getPopularProducts}
      href="/products?sort=popular"
      alternateBg
    />
  );
}

export function NewArrivalsSection() {
  return (
    <ProductGridSection
      title="New Arrivals"
      subtitle="Fresh additions to our marketplace"
      queryKey={["products", "new"]}
      queryFn={getNewArrivals}
      href="/products?sort=new"
    />
  );
}

export function FeaturedProductsSection() {
  return (
    <ProductGridSection
      title="Featured Products"
      subtitle="Handpicked premium ingredients from verified suppliers"
      queryKey={["products", "featured"]}
      queryFn={getFeaturedProducts}
      href="/products?sort=featured"
      alternateBg
    />
  );
}
