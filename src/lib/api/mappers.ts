import { storageUrl } from "./client";
import type {
  Banner,
  Category,
  Country,
  FAQ,
  Product,
  SubCategory,
  Supplier,
  Testimonial,
} from "@/types";

/* eslint-disable @typescript-eslint/no-explicit-any */

export function mapSubCategory(raw: any): SubCategory {
  return {
    id: raw.id,
    name: raw.name,
    slug: raw.slug,
    categoryId: raw.categoryId,
  };
}

export function mapCategory(raw: any): Category {
  const subs = raw.subCategories ?? raw.subcategories ?? [];
  return {
    id: raw.id,
    name: raw.name,
    slug: raw.slug,
    description: raw.description ?? "",
    image: storageUrl(raw.imageUrl ?? raw.image),
    productCount: raw.productCount ?? raw._count?.products ?? 0,
    subcategories: subs.map(mapSubCategory),
  };
}

export function mapSupplier(raw: any): Supplier {
  return {
    id: raw.id,
    name: raw.name,
    slug: raw.slug,
    logo: storageUrl(raw.logoUrl ?? raw.logo),
    country: raw.country ?? "",
    description: raw.description ?? "",
    productCount: raw.productCount ?? 0,
    rating: raw.rating ?? 0,
    verified: raw.verified ?? false,
    specialties: raw.specialties ?? [],
  };
}

export function mapProduct(raw: any): Product {
  const imageUrls =
    raw.imageUrls?.map((i: any) => i.display ?? i.large ?? i.original) ?? [];
  const primary =
    raw.imageUrl ??
    imageUrls[0] ??
    null;

  return {
    id: raw.id,
    name: raw.name,
    slug: raw.slug,
    description: raw.description ?? "",
    image: storageUrl(primary),
    images: imageUrls.map((u: string) => storageUrl(u)),
    price: raw.price,
    currency: raw.currency ?? "USD",
    moq: raw.moq,
    moqUnit: raw.moqUnit,
    country: raw.country ?? "",
    categoryId: raw.categoryId,
    categoryName: raw.category?.name ?? raw.categoryName ?? "",
    subCategoryId: raw.subCategoryId ?? undefined,
    subCategoryName: raw.subCategory?.name ?? raw.subCategoryName ?? undefined,
    supplierId: raw.supplierId,
    supplierName: raw.supplier?.name ?? raw.supplierName ?? "",
    featured: raw.featured,
    popular: raw.popular,
    isNew: raw.isNew,
    specifications: (raw.specifications as Record<string, string>) ?? undefined,
  };
}

export function mapBanner(raw: any, index = 0): Banner {
  const accents: Banner["accent"][] = ["green", "orange", "green", "orange"];
  return {
    id: raw.id,
    title: raw.title,
    subtitle: raw.subtitle ?? "",
    ctaText: raw.ctaText ?? "Learn More",
    ctaLink: raw.ctaLink ?? "/products",
    image: storageUrl(raw.imageUrl ?? raw.image),
    accent: (raw.accent as Banner["accent"]) ?? accents[index % accents.length],
  };
}

export function mapCountry(raw: any): Country {
  return {
    id: raw.id,
    name: raw.name,
    code: raw.code,
    flag: raw.flag ?? "🌍",
    supplierCount: raw.supplierCount ?? 0,
  };
}

export function mapFaq(raw: any): FAQ {
  return {
    id: raw.id ?? raw.question,
    question: raw.question,
    answer: raw.answer,
    category: raw.category ?? "General",
  };
}

export function mapTestimonial(raw: any): Testimonial {
  return {
    id: raw.id ?? raw.name,
    name: raw.name,
    role: raw.role ?? "",
    company: raw.company ?? "",
    content: raw.content,
    avatar: raw.avatar ? storageUrl(raw.avatar) : "",
    rating: raw.rating ?? 5,
  };
}
