"use client";

import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFavoritesStore } from "@/store/favorites-store";
import { cn } from "@/lib/utils";

export function ProductFavoriteButton({ productId }: { productId: string }) {
  const { toggleFavorite, isFavorite } = useFavoritesStore();
  const favorited = isFavorite(productId);

  return (
    <Button
      size="icon"
      variant="outline"
      onClick={() => toggleFavorite(productId)}
      aria-label={favorited ? "Remove from wishlist" : "Add to wishlist"}
      title={favorited ? "Wishlisted" : "Wishlist"}
      className={cn(
        "h-10 w-10 shrink-0 rounded-full",
        favorited && "border-red-200 text-red-500",
      )}
    >
      <Heart className={cn("h-4 w-4", favorited && "fill-current")} />
    </Button>
  );
}
