"use client";

import { useQuery } from "@tanstack/react-query";
import { getCategories } from "@/lib/api/categories";
import { CategoryImageCard } from "@/components/categories/category-image-card";
import { AnimatedSection } from "@/components/shared/animated-section";
import { SectionSlider } from "@/components/shared/section-slider";
import { SectionHeader } from "@/components/shared/section-header";

const CATEGORIES_PER_PAGE = 10;

export function FoodCategoriesGrid() {
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["categories", "food-grid"],
    queryFn: getCategories,
    staleTime: 10 * 60 * 1000,
  });

  if (!isLoading && categories.length === 0) return null;

  return (
    <AnimatedSection className="border-b border-border bg-surface py-10 sm:py-14">
      <div className="container-main">
        <SectionHeader
          title="Categories"
          subtitle="Browse wholesale food categories"
          href="/categories"
        />

        {isLoading ? (
          <p className="text-center text-muted">Loading categories...</p>
        ) : (
          <SectionSlider
            items={categories}
            itemsPerPage={CATEGORIES_PER_PAGE}
            gridClassName="grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3 lg:grid-cols-5 xl:grid-cols-6"
            renderItem={(cat, i) => (
              <CategoryImageCard key={cat.id} category={cat} index={i} />
            )}
          />
        )}
      </div>
    </AnimatedSection>
  );
}
