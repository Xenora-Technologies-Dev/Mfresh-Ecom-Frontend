"use client";

import { useQuery } from "@tanstack/react-query";
import { getCategories } from "@/lib/api/categories";
import { CategoryImageCard } from "@/components/categories/category-image-card";
import { AnimatedSection } from "@/components/shared/animated-section";
import { SectionSlider } from "@/components/shared/section-slider";
import { SectionHeader } from "@/components/shared/section-header";
import { Skeleton } from "@/components/shared/skeletons";

const CATEGORIES_PER_PAGE = 10;
const CATEGORY_GRID =
  "grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3 lg:grid-cols-5 xl:grid-cols-6";

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
          <div className={CATEGORY_GRID}>
            {Array.from({ length: CATEGORIES_PER_PAGE }).map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-lg" />
            ))}
          </div>
        ) : (
          <SectionSlider
            items={categories}
            itemsPerPage={CATEGORIES_PER_PAGE}
            gridClassName={CATEGORY_GRID}
            renderItem={(cat, i) => (
              <CategoryImageCard
                key={cat.id}
                category={cat}
                index={i}
                animate={false}
              />
            )}
          />
        )}
      </div>
    </AnimatedSection>
  );
}
