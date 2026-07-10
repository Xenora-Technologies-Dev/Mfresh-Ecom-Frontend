"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Share, Share2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useFavoritesStore } from "@/store/favorites-store";
import { getProductsByIds } from "@/lib/api/products";
import { PriceDisplay } from "@/components/shared/price-display";
import { Button } from "@/components/ui/button";
import { ShareWishlistModal } from "@/components/wishlist/share-wishlist-modal";
import { shareWishlistExternally } from "@/lib/wishlist-share";
import type { Product } from "@/types";
import { cn } from "@/lib/utils";

function EmptyBlock({ message }: { message: string }) {
  return (
    <div className="rounded-xl bg-light-gray/80 px-6 py-10 text-center text-sm text-muted">
      {message}
    </div>
  );
}

export function WishlistContent() {
  const favoriteIds = useFavoritesStore((s) => s.favorites);
  const { toggleFavorite, isFavorite, clearFavorites } = useFavoritesStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [shareOpen, setShareOpen] = useState(false);
  const [sharing, setSharing] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    void getProductsByIds(favoriteIds).then((items) => {
      if (!cancelled) {
        setProducts(items);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [favoriteIds]);

  const handleExternalShare = async () => {
    if (!products.length) {
      toast.error("Add products to your wishlist before sharing.");
      return;
    }
    setSharing(true);
    try {
      const result = await shareWishlistExternally(products);
      toast.success(
        result === "shared"
          ? "Wishlist shared successfully"
          : "Wishlist copied to clipboard",
      );
    } catch (err) {
      if (err instanceof Error && err.name !== "AbortError") {
        toast.error("Could not share your wishlist. Please try again.");
      }
    } finally {
      setSharing(false);
    }
  };

  const handleClearWishlist = () => {
    if (!favoriteIds.length) return;
    if (confirm("Clear your entire wishlist?")) {
      clearFavorites();
      toast.success("Wishlist cleared");
    }
  };

  return (
    <div className="container-main py-10 sm:py-14">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-dark-gray sm:text-3xl">
          My Wishlist
        </h1>
        {(products.length > 0 || favoriteIds.length > 0) && (
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => void handleExternalShare()}
              disabled={sharing || !products.length}
              className="gap-2"
              aria-label="Share wishlist"
            >
              <Share className="h-4 w-4" />
              Share
            </Button>
            <Button
              onClick={() => setShareOpen(true)}
              size="sm"
              className="gap-2 bg-secondary hover:bg-secondary-dark"
              disabled={!products.length}
            >
              <Share2 className="h-4 w-4" />
              Share with M Fresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearWishlist}
              className="gap-2 text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
              Clear Wishlist
            </Button>
          </div>
        )}
      </div>

      <section className="mb-10">
        <h2 className="mb-4 text-lg font-bold text-dark-gray">Products</h2>
        {loading ? (
          <EmptyBlock message="Loading your wishlist..." />
        ) : products.length === 0 ? (
          <EmptyBlock message="No Products Wishlisted" />
        ) : (
          <div className="space-y-4">
            {products.map((product) => {
              const favorited = isFavorite(product.id);
              const unavailable = product.soldOut || product.isActive === false;
              return (
                <article
                  key={product.id}
                  className="rounded-xl border border-border bg-white p-4 sm:p-5"
                >
                  <div className="flex gap-4">
                    <Link
                      href={`/products/${product.slug}`}
                      className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-light-gray sm:h-24 sm:w-24"
                    >
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    </Link>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={`/products/${product.slug}`}
                          className="font-semibold text-dark-gray hover:text-primary"
                        >
                          {product.name}
                        </Link>
                        <button
                          type="button"
                          onClick={() => toggleFavorite(product.id)}
                          className={cn(
                            "shrink-0 text-secondary transition-colors",
                            favorited && "text-secondary",
                          )}
                          aria-label="Remove from wishlist"
                        >
                          <Heart
                            className={cn(
                              "h-5 w-5",
                              favorited && "fill-current",
                            )}
                          />
                        </button>
                      </div>

                      <p className="mt-1 text-sm text-muted">
                        <PriceDisplay
                          price={product.price}
                          storedCurrency={product.currency}
                        />
                        /{product.moqUnit}
                      </p>

                      {product.country && (
                        <p className="mt-1 text-sm text-muted">{product.country}</p>
                      )}

                      {unavailable && (
                        <p className="mt-2 text-xs font-medium text-secondary">
                          {product.soldOut ? "Sold out" : "Currently unavailable"}
                        </p>
                      )}

                      <div className="mt-3">
                        {unavailable ? (
                          <Button
                            variant="outline"
                            size="sm"
                            disabled
                            className="border-gray-200 text-muted"
                          >
                            Unavailable
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                            className="border-primary text-primary hover:bg-primary/5"
                          >
                            <Link href={`/products/${product.slug}`}>
                              Add to cart
                            </Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-4 text-lg font-bold text-dark-gray">Variants</h2>
        <EmptyBlock message="No Variants Wishlisted" />
      </section>

      <ShareWishlistModal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        products={products}
      />
    </div>
  );
}
