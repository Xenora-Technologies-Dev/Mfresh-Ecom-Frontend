const SUBCATEGORY_IMAGES: Record<string, string> = {
  apple: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&q=80",
  orange: "https://images.unsplash.com/photo-1547514704-5bb854796554?w=600&q=80",
  grape: "https://images.unsplash.com/photo-1537640538964-79f369143f8f?w=600&q=80",
  avocado: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=600&q=80",
  mango: "https://images.unsplash.com/photo-1553279768-bdae0a0b5a66?w=600&q=80",
  banana: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&q=80",
  watermelon: "https://images.unsplash.com/photo-1563114775-84227b22d963?w=600&q=80",
  pear: "https://images.unsplash.com/photo-1514750156275-ea2bd9b0309d?w=600&q=80",
  fruits: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=600&q=80",
  vegetables: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&q=80",
  beef: "https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=600&q=80",
  chicken: "https://images.unsplash.com/photo-1604503468506-a8da85677466?w=600&q=80",
  fish: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&q=80",
};

const DEFAULT_SUBCATEGORY_IMAGE =
  "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&q=80";

export function getSubcategoryFallbackImage(slug: string): string {
  return SUBCATEGORY_IMAGES[slug] ?? DEFAULT_SUBCATEGORY_IMAGE;
}
