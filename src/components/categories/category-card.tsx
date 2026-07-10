"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import type { Category } from "@/types";
import { cn } from "@/lib/utils";

interface CategoryCardProps {
  category: Category;
  index?: number;
  variant?: "default" | "compact";
  className?: string;
}

export function CategoryCard({
  category,
  index = 0,
  variant = "default",
  className,
}: CategoryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className={cn("group", className)}
    >
      <Link href={`/categories/${category.slug}`}>
        <div
          className={cn(
            "relative overflow-hidden rounded-xl border border-border bg-surface shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:border-primary-light/25 group-hover:shadow-md group-hover:shadow-primary/5",
            variant === "compact" ? "aspect-square" : "aspect-[4/5]",
          )}
        >
          <Image
            src={category.image}
            alt={category.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-gray/90 via-dark-gray/30 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
            <div className="flex items-end justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-white sm:text-lg">
                  {category.name}
                </h3>
                <p className="mt-1 text-xs text-white/70 sm:text-sm">
                  {category.productCount} products
                </p>
              </div>
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition-colors group-hover:bg-primary">
                <ArrowUpRight className="h-4 w-4 text-white" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
