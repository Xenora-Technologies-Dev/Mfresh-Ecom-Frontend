"use client";

import { Share2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import type { Product } from "@/types";

function buildProductShareText(product: Product): { text: string; url: string } {
  const url = `${SITE_URL}/products/${product.slug}`;
  const origin = product.country ? ` from ${product.country}` : "";
  const text = `Checkout ${product.name}${origin} at ${SITE_NAME}\n${url}`;
  return { text, url };
}

export function ProductShareButton({ product }: { product: Product }) {
  const handleShare = async () => {
    const { text, url } = buildProductShareText(product);
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({
          title: `${product.name} | ${SITE_NAME}`,
          text,
          url,
        });
        return;
      }
      await navigator.clipboard.writeText(text);
      toast.success("Product link copied — paste it in any app to share");
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;
      try {
        await navigator.clipboard.writeText(text);
        toast.success("Product link copied — paste it in any app to share");
      } catch {
        toast.error("Could not share this product. Please try again.");
      }
    }
  };

  return (
    <Button size="lg" variant="outline" onClick={() => void handleShare()} className="gap-2">
      <Share2 className="h-4 w-4" />
      Share
    </Button>
  );
}
