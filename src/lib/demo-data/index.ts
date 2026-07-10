export { banners } from "@/data/mock/banners";
export { categories } from "@/data/mock/categories";
export { products } from "@/data/mock/products";
export { suppliers } from "@/data/mock/suppliers";
export { countries } from "@/data/mock/countries";
export { testimonials } from "@/data/mock/testimonials";

import { products as allProducts } from "@/data/mock/products";

export const CATEGORY_PILLARS = [
  {
    id: "pillar-seafood",
    title: "Aquatic Animals",
    subtitle: "Sustainable seafood wholesale",
    description: "Fresh fish, shellfish, and frozen seafood for hospitality & retail",
    slug: "seafood",
    href: "/products?category=seafood",
    image:
      "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1200&q=80",
    count: "Fresh & frozen",
  },
  {
    id: "pillar-meat",
    title: "Land Animals",
    subtitle: "Halal meats & poultry",
    description: "Halal-certified beef, lamb, chicken, and premium cuts",
    slug: "meat-poultry",
    href: "/products?category=meat-poultry",
    image:
      "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=1200&q=80",
    count: "Halal certified",
  },
  {
    id: "pillar-plants",
    title: "Plants & Pantry",
    subtitle: "Produce, grains & specialty",
    description: "Fresh produce, pantry staples, and specialty ingredients",
    slug: "fresh-produce",
    href: "/products?category=fresh-produce",
    image:
      "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=1200&q=80",
    count: "Farm to kitchen",
  },
] as const;

/** Intentionally empty — never use demo hero images (avoids handshake flash) */
export const HERO_SLIDES = [] as const;

export const TRUST_FEATURES = [
  {
    title: "Verified Sellers",
    description: "Every supplier undergoes strict verification",
    icon: "ShieldCheck",
  },
  {
    title: "Certified Escrow",
    description: "Secure payments until delivery confirmed",
    icon: "Lock",
  },
  {
    title: "Quality Inspection",
    description: "World-class inspection before shipment",
    icon: "BadgeCheck",
  },
  {
    title: "150+ Countries",
    description: "Global trade with local expertise",
    icon: "Globe",
  },
] as const;

export function getDemoPopularProducts() {
  return allProducts.filter((p) => p.popular).slice(0, 8);
}

export function getDemoNewArrivals() {
  return allProducts.filter((p) => p.isNew).slice(0, 8);
}

export function getDemoFeaturedProducts() {
  return allProducts.filter((p) => p.featured).slice(0, 8);
}

export function getDemoPriceRange() {
  const prices = allProducts.map((p) => p.price);
  return { min: Math.min(...prices), max: Math.max(...prices) };
}

export function getDemoCountries() {
  return allProducts.map((p) => p.country).filter(Boolean);
}
