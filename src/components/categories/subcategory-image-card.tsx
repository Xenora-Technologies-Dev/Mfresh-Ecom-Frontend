"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { SubCategory } from "@/types";
import { getSubcategoryFallbackImage } from "@/lib/subcategory-images";
import { cn } from "@/lib/utils";

interface SubcategoryImageCardProps {
  categorySlug: string;
  subcategory: SubCategory;
  index?: number;
  className?: string;
}

/** @deprecated Subcategories removed — safe stub for builds that still ship this file. */
export function SubcategoryImageCard({
  categorySlug,
  subcategory,
  index = 0,
  className,
}: SubcategoryImageCardProps) {
  const image =
    subcategory.image || getSubcategoryFallbackImage(subcategory.slug);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay: index * 0.03 }}
      className={cn("group", className)}
    >
      <Link
        href={`/products?category=${encodeURIComponent(categorySlug)}`}
        className="block"
      >
        <div className="relative aspect-square overflow-hidden rounded-xl border border-border/60 shadow-sm transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-md">
          <Image
            src={image}
            alt={subcategory.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 14vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
          <p className="absolute inset-x-0 bottom-0 px-2 py-3 text-center text-xs font-semibold text-white sm:text-sm">
            {subcategory.name}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
