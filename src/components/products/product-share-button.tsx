"use client";

import { Share2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { SITE_NAME, getPublicSiteUrl } from "@/lib/constants";
import type { Product } from "@/types";

function buildProductShare(product: Product): { title: string; text: string; url: string } {
  const url = `${getPublicSiteUrl()}/products/${product.slug}`;
  const origin = product.country ? ` from ${product.country}` : "";
  return {
    title: `${product.name} | ${SITE_NAME}`,
    text: `Checkout ${product.name}${origin} at ${SITE_NAME}`,
    url,
  };
}

export function ProductShareButton({ product }: { product: Product }) {
  const handleShare = async () => {
    const { title, text, url } = buildProductShare(product);
    const clipboardPayload = `${text}\n${url}`;
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({ title, text, url });
        return;
      }
      await navigator.clipboard.writeText(clipboardPayload);
      toast.success("Product link copied — paste it in any app to share");
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;
      try {
        await navigator.clipboard.writeText(clipboardPayload);
        toast.success("Product link copied — paste it in any app to share");
      } catch {
        toast.error("Could not share this product. Please try again.");
      }
    }
  };

  return (
    <Button
      size="icon"
      variant="outline"
      onClick={() => void handleShare()}
      aria-label="Share product"
      title="Share"
      className="h-10 w-10 shrink-0 rounded-full"
    >
      <Share2 className="h-4 w-4" />
    </Button>
  );
}
