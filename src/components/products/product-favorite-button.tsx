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
      size="lg"
      variant="outline"
      onClick={() => toggleFavorite(productId)}
      className={cn(favorited && "border-red-200 text-red-500")}
    >
      <Heart className={cn("h-4 w-4", favorited && "fill-current")} />
      {favorited ? "Wishlisted" : "Wishlist"}
    </Button>
  );
}
