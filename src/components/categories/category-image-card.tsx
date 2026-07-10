"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Category } from "@/types";
import { cn } from "@/lib/utils";

interface CategoryImageCardProps {
  category: Category;
  index?: number;
  className?: string;
}

export function CategoryImageCard({
  category,
  index = 0,
  className,
}: CategoryImageCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay: index * 0.04 }}
      className={cn("group", className)}
    >
      <Link href={`/categories/${category.slug}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border/60 shadow-sm transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-md sm:aspect-square">
          <Image
            src={category.image}
            alt={category.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
          <p className="absolute inset-x-0 bottom-0 px-3 py-3 text-center text-sm font-semibold text-white sm:text-base">
            {category.name}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
