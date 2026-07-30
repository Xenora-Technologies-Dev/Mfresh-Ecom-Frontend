"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Package } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { PriceDisplay } from "@/components/shared/price-display";
import { CountryFlagIcon } from "@/components/shared/country-flag-icon";
import { ProductComingSoonImage } from "@/components/products/product-coming-soon-image";
import { useFavoritesStore } from "@/store/favorites-store";
import type { Product } from "@/types";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  index?: number;
  className?: string;
  /** Entrance animation — disable inside carousels so slides don't re-init */
  animate?: boolean;
}

export function ProductCard({
  product,
  index = 0,
  className,
  animate = true,
}: ProductCardProps) {
  const { toggleFavorite, isFavorite } = useFavoritesStore();
  const favorited = isFavorite(product.id);

  const body = (
    <Link href={`/products/${product.slug}`} className="flex h-full flex-col">
      <div className="relative flex flex-col overflow-hidden rounded-lg border border-border bg-surface shadow-sm transition-all duration-300 group-hover:-translate-y-0.5 group-hover:border-primary-light/25 group-hover:shadow-md group-hover:shadow-primary/5">
        <div className="relative aspect-square w-full shrink-0 overflow-hidden bg-primary-muted/40">
          {product.comingSoon || !product.image ? (
            <ProductComingSoonImage
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            />
          ) : (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className={cn(
                "object-cover transition-transform duration-500 group-hover:scale-105",
                (product.soldOut || product.isActive === false) && "opacity-60",
              )}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            />
          )}
          <div className="absolute left-2 top-2 flex flex-wrap gap-1">
            {product.isNew && <Badge variant="new">New</Badge>}
            {product.featured && <Badge variant="secondary">Featured</Badge>}
            {product.soldOut && <Badge variant="secondary">Sold Out</Badge>}
            {product.isActive === false && (
              <Badge variant="outline">Unavailable</Badge>
            )}
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              toggleFavorite(product.id);
            }}
            className={cn(
              "absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-sm transition-all hover:scale-110",
              favorited && "text-red-500",
            )}
            aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart
              className={cn("h-3.5 w-3.5", favorited && "fill-current")}
            />
          </button>
        </div>

        <div className="flex flex-col gap-0.5 p-2 sm:p-2.5">
          <p className="truncate text-[10px] font-medium leading-tight text-muted">
            {product.categoryName || "\u00a0"}
          </p>

          {product.country ? (
            <div className="flex items-center gap-1.5 text-[10px] leading-tight text-muted">
              <CountryFlagIcon country={product.country} size={14} />
              <span className="truncate">{product.country}</span>
            </div>
          ) : null}

          <h3 className="line-clamp-2 text-xs font-semibold leading-snug text-dark-gray transition-colors group-hover:text-primary sm:text-sm">
            {product.name}
          </h3>

          <div className="min-w-0 pt-0.5">
            <p className="flex flex-wrap items-baseline gap-x-0.5 text-[13px] font-bold leading-snug text-primary sm:text-base lg:text-lg">
              {product.minPrice === product.maxPrice ? (
                <>
                  <PriceDisplay
                    price={product.minPrice}
                    storedCurrency={product.currency}
                  />
                  <span className="text-[10px] font-medium text-muted sm:text-xs">
                    /{product.unit}
                  </span>
                </>
              ) : (
                <>
                  <PriceDisplay
                    price={product.minPrice}
                    storedCurrency={product.currency}
                  />
                  <span className="mx-0.5 text-[10px] font-normal text-muted sm:text-xs">
                    –
                  </span>
                  <PriceDisplay
                    price={product.maxPrice}
                    storedCurrency={product.currency}
                  />
                  <span className="text-[10px] font-medium text-muted sm:text-xs">
                    /{product.unit}
                  </span>
                </>
              )}
            </p>
            <p className="mt-0.5 flex items-center gap-1 text-[10px] leading-tight text-muted">
              <Package className="h-3 w-3 shrink-0" />
              <span className="truncate">
                MOQ: {product.moq} {product.unit}
              </span>
            </p>
          </div>
        </div>
      </div>
    </Link>
  );

  if (!animate) {
    return <article className={cn("group h-full", className)}>{body}</article>;
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className={cn("group h-full", className)}
    >
      {body}
    </motion.article>
  );
}
