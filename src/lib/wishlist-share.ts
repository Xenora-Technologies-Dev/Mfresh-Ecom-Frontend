import type { Product } from "@/types";
import { MFRESH_WEBSITE, SITE_NAME, SITE_TAGLINE, SITE_URL } from "@/lib/constants";

function productUrl(product: Product): string {
  return `${SITE_URL}/products/${product.slug}`;
}

export function buildWishlistShareText(products: Product[]): string {
  const lines = [
    "Sharing my M Fresh wishlist",
    "",
    `${SITE_NAME} — ${SITE_TAGLINE}`,
    "",
  ];

  if (products.length === 0) {
    lines.push("(No products in wishlist yet)");
  } else {
    lines.push(`I saved ${products.length} product${products.length > 1 ? "s" : ""}:`);
    lines.push("");
    for (const [i, p] of products.entries()) {
      const price = `${p.currency} ${p.price}/${p.moqUnit}`;
      const origin = p.country ? ` · Origin: ${p.country}` : "";
      lines.push(`${i + 1}. ${p.name}`);
      lines.push(`   ${price}${origin}`);
      lines.push(`   ${productUrl(p)}`);
      lines.push("");
    }
  }

  lines.push("Browse more on M Fresh:");
  lines.push(MFRESH_WEBSITE);
  return lines.join("\n").trim();
}

export async function shareWishlistExternally(
  products: Product[],
): Promise<"shared" | "copied"> {
  const text = buildWishlistShareText(products);
  const firstUrl = products[0] ? productUrl(products[0]) : SITE_URL;

  if (typeof navigator !== "undefined" && navigator.share) {
    await navigator.share({
      title: "My M Fresh Wishlist",
      text,
      url: firstUrl,
    });
    return "shared";
  }

  await navigator.clipboard.writeText(text);
  return "copied";
}
