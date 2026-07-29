"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getFeaturedProducts,
  getNewArrivals,
} from "@/lib/api/products";
import { ProductCard } from "@/components/products/product-card";
import { AnimatedSection } from "@/components/shared/animated-section";
import { SectionHeader } from "@/components/shared/section-header";
import { SectionSlider } from "@/components/shared/section-slider";
import type { Product } from "@/types";

/** Matches `lg:grid-cols-5` so each slider page is complete rows (2×5). */
const PRODUCTS_PER_PAGE = 10;

function ProductSliderSection({
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
        alternateBg ? "py-10 sm:py-14 fresh-section-alt" : "py-10 sm:py-14 bg-surface"
      }
    >
      <div className="container-main">
        <SectionHeader title={title} subtitle={subtitle} href={href} />
        {isLoading ? (
          <p className="text-center text-muted">Loading products...</p>
        ) : (
          <SectionSlider
            items={products}
            itemsPerPage={PRODUCTS_PER_PAGE}
            autoPlay
            autoPlayIntervalMs={5000}
            gridClassName="grid grid-cols-2 gap-2.5 sm:grid-cols-5 sm:gap-3"
            renderItem={(product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            )}
          />
        )}
      </div>
    </AnimatedSection>
  );
}

export function NewArrivalsSection() {
  return (
    <ProductSliderSection
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
    <ProductSliderSection
      title="Featured Products"
      subtitle="Handpicked premium ingredients for your business"
      queryKey={["products", "featured"]}
      queryFn={getFeaturedProducts}
      href="/products?sort=featured"
      alternateBg
    />
  );
}
