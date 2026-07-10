import type { Metadata } from "next";
import { WishlistContent } from "@/components/wishlist/wishlist-content";

export const metadata: Metadata = {
  title: "My Wishlist",
  description: "View and share your saved products with M Fresh.",
};

export default function WishlistPage() {
  return <WishlistContent />;
}
