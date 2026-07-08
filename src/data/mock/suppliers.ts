import type { Supplier } from "@/types";

export const suppliers: Supplier[] = [
  {
    id: "sup-1",
    name: "Gulf Fresh Trading",
    slug: "gulf-fresh-trading",
    logo: "https://images.unsplash.com/photo-1560493676-04071c5f467f?w=200&q=80",
    country: "UAE",
    description:
      "Leading supplier of premium fresh produce to hotels, restaurants, and retailers across the GCC.",
    productCount: 142,
    rating: 4.9,
    verified: true,
    specialties: ["Fresh Produce", "Organic", "Local Sourcing"],
  },
  {
    id: "sup-2",
    name: "Emirates Dairy Co.",
    slug: "emirates-dairy-co",
    logo: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=200&q=80",
    country: "UAE",
    description:
      "Premium dairy products including milk, cheese, and yogurt for commercial buyers.",
    productCount: 87,
    rating: 4.8,
    verified: true,
    specialties: ["Dairy", "Cheese", "Eggs"],
  },
  {
    id: "sup-3",
    name: "Ocean Harvest LLC",
    slug: "ocean-harvest-llc",
    logo: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=200&q=80",
    country: "UAE",
    description:
      "Fresh and frozen seafood sourced from sustainable fisheries worldwide.",
    productCount: 96,
    rating: 4.7,
    verified: true,
    specialties: ["Seafood", "Frozen", "Sustainable"],
  },
  {
    id: "sup-4",
    name: "Spice Route Imports",
    slug: "spice-route-imports",
    logo: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&q=80",
    country: "India",
    description:
      "Authentic spices, grains, and pantry staples imported directly from source.",
    productCount: 203,
    rating: 4.9,
    verified: true,
    specialties: ["Spices", "Grains", "Pantry"],
  },
  {
    id: "sup-5",
    name: "Premium Meats Dubai",
    slug: "premium-meats-dubai",
    logo: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=200&q=80",
    country: "UAE",
    description:
      "Halal-certified premium meats and poultry for hospitality and retail sectors.",
    productCount: 74,
    rating: 4.8,
    verified: true,
    specialties: ["Meat", "Poultry", "Halal"],
  },
  {
    id: "sup-6",
    name: "Artisan Bakery Supply",
    slug: "artisan-bakery-supply",
    logo: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&q=80",
    country: "Lebanon",
    description:
      "Specialty flours, ingredients, and baked goods for professional kitchens.",
    productCount: 58,
    rating: 4.6,
    verified: true,
    specialties: ["Bakery", "Ingredients", "Artisan"],
  },
];
