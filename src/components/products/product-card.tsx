"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, MapPin, Package } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { PriceDisplay } from "@/components/shared/price-display";
import { useFavoritesStore } from "@/store/favorites-store";
import type { Product } from "@/types";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  index?: number;
  className?: string;
}

export function ProductCard({ product, index = 0, className }: ProductCardProps) {
  const { toggleFavorite, isFavorite } = useFavoritesStore();
  const favorited = isFavorite(product.id);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className={cn("group", className)}
    >
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative overflow-hidden rounded-xl border border-border bg-surface shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:border-primary-light/25 group-hover:shadow-md group-hover:shadow-primary/5">
          <div className="relative aspect-[4/3] overflow-hidden bg-primary-muted/40">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
            <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
              {product.isNew && <Badge variant="new">New</Badge>}
              {product.featured && <Badge variant="secondary">Featured</Badge>}
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                toggleFavorite(product.id);
              }}
              className={cn(
                "absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-sm transition-all hover:scale-110",
                favorited && "text-red-500",
              )}
              aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart
                className={cn("h-4 w-4", favorited && "fill-current")}
              />
            </button>
          </div>

          <div className="space-y-2.5 p-3 sm:space-y-3 sm:p-4">
            <div className="flex items-center gap-1.5 text-[10px] text-muted sm:text-xs">
              <MapPin className="h-3 w-3 shrink-0" />
              <span className="truncate">{product.country}</span>
              <span className="text-gray-300">•</span>
              <span className="truncate">{product.categoryName}</span>
            </div>

            <h3 className="line-clamp-2 text-xs font-semibold leading-snug text-dark-gray transition-colors group-hover:text-primary sm:text-sm md:text-base">
              {product.name}
            </h3>

            <p className="truncate text-[10px] text-muted sm:text-xs">
              by {product.supplierName}
            </p>

            <div className="flex items-end justify-between gap-2 pt-0.5 sm:pt-1">
              <div className="min-w-0">
                <p className="text-sm font-bold text-primary sm:text-lg">
                  <PriceDisplay price={product.price} storedCurrency={product.currency} />
                </p>
                <p className="flex items-center gap-1 text-[10px] text-muted sm:text-xs">
                  <Package className="h-3 w-3 shrink-0" />
                  <span className="truncate">
                    MOQ: {product.moq} {product.moqUnit}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
