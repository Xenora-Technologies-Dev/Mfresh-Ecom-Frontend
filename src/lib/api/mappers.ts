import { storageUrl } from "./client";
import type {
  Banner,
  Category,
  Country,
  FAQ,
  Product,
  Supplier,
  Testimonial,
} from "@/types";

/* eslint-disable @typescript-eslint/no-explicit-any */

export function mapCategory(raw: any): Category {
  return {
    id: raw.id,
    name: raw.name,
    slug: raw.slug,
    description: raw.description ?? "",
    image: storageUrl(raw.imageUrl ?? raw.image),
    productCount: raw.productCount ?? raw._count?.products ?? 0,
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
  const rawImageList = raw.imageUrls ?? [];
  const display =
    rawImageList.find((i: any) => i.type === "DISPLAY") ??
    rawImageList.find((i: any) => i.type === "MAIN");
  const additional = rawImageList.filter(
    (i: any) => i.type === "ADDITIONAL" || i.type === "SUB",
  );

  const displayUrl =
    display?.large ??
    display?.display ??
    display?.medium ??
    raw.displayImageUrl ??
    raw.mainImageUrl ??
    null;

  const additionalUrls = (
    additional.length
      ? additional.map(
          (i: any) => i.large ?? i.medium ?? i.display ?? i.original,
        )
      : (raw.additionalImageUrls as string[] | undefined) ??
        (raw.subImageUrls as string[] | undefined) ??
        []
  ).filter(Boolean) as string[];

  const comingSoon = !displayUrl;
  const cardPrimary = displayUrl;

  const minPrice = Number(raw.minPrice ?? raw.price ?? 0);
  const maxPrice = Number(raw.maxPrice ?? raw.price ?? minPrice);
  const unit = String(raw.unit ?? raw.moqUnit ?? "kg");

  return {
    id: raw.id,
    name: raw.name,
    slug: raw.slug,
    description: raw.description ?? "",
    image: comingSoon ? "" : storageUrl(cardPrimary),
    comingSoon,
    displayImage: comingSoon ? undefined : storageUrl(displayUrl),
    additionalImages: additionalUrls.map((u: string) => storageUrl(u)),
    images: comingSoon
      ? []
      : [storageUrl(displayUrl), ...additionalUrls.map((u) => storageUrl(u))],
    mainImage: comingSoon ? undefined : storageUrl(displayUrl),
    subImages: additionalUrls.map((u: string) => storageUrl(u)),
    minPrice,
    maxPrice,
    price: minPrice,
    currency: raw.currency ?? "USD",
    moq: raw.moq,
    unit,
    moqUnit: unit,
    country: raw.country ?? "",
    categoryId: raw.categoryId,
    categoryName: raw.category?.name ?? raw.categoryName ?? "",
    categorySlug: raw.category?.slug ?? raw.categorySlug ?? undefined,
    supplierId: raw.supplierId ?? undefined,
    supplierName: raw.supplier?.name ?? raw.supplierName ?? undefined,
    featured: raw.featured,
    popular: raw.popular,
    isNew: raw.isNew,
    isActive: raw.isActive !== false,
    soldOut: Boolean(raw.soldOut),
    specifications: (raw.specifications as Record<string, string>) ?? undefined,
  };
}

export function mapBanner(raw: any, index = 0): Banner {
  const accents: Banner["accent"][] = ["green", "orange", "green", "orange"];
  const image = storageUrl(raw.imageUrl ?? raw.image);
  const mobileRaw = raw.mobileImageUrl ?? raw.mobileImage;
  return {
    id: raw.id,
    title: raw.title,
    subtitle: raw.subtitle ?? "",
    ctaText: raw.ctaText ?? "Learn More",
    ctaLink: raw.ctaLink ?? "/products",
    image,
    mobileImage: mobileRaw ? storageUrl(mobileRaw) : undefined,
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
