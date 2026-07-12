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
  const imagePath = raw.imageUrl ?? raw.image;
  return {
    id: raw.id,
    name: raw.name,
    slug: raw.slug,
    categoryId: raw.categoryId,
    image: imagePath
      ? String(imagePath).startsWith("http")
        ? String(imagePath)
        : storageUrl(imagePath)
      : undefined,
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
  const rawImageList = raw.imageUrls ?? [];
  const display = rawImageList.find((i: any) => i.type === "DISPLAY");
  const main = rawImageList.find((i: any) => i.type === "MAIN");
  const subs = rawImageList.filter((i: any) => i.type === "SUB");

  const displayUrl = display?.display ?? display?.large ?? raw.displayImageUrl;
  const mainUrl =
    main?.large ?? main?.display ?? raw.mainImageUrl ?? displayUrl;
  const subUrls = (
    subs.length
      ? subs.map((i: any) => i.medium ?? i.display ?? i.large)
      : (raw.subImageUrls as string[] | undefined) ?? []
  ).filter(Boolean);

  const cardPrimary =
    raw.displayImageUrl ??
    raw.imageUrl ??
    displayUrl ??
    mainUrl ??
    null;

  const galleryImages = [
    mainUrl,
    ...subUrls.filter((u: string) => u !== mainUrl),
  ]
    .filter(Boolean)
    .map((u: string) => storageUrl(u));

  return {
    id: raw.id,
    name: raw.name,
    slug: raw.slug,
    description: raw.description ?? "",
    image: storageUrl(cardPrimary),
    displayImage: displayUrl ? storageUrl(displayUrl) : storageUrl(cardPrimary),
    mainImage: mainUrl ? storageUrl(mainUrl) : undefined,
    subImages: subUrls.map((u: string) => storageUrl(u)),
    images: galleryImages.length
      ? galleryImages
      : cardPrimary
        ? [storageUrl(cardPrimary)]
        : [],
    price: raw.price,
    currency: raw.currency ?? "USD",
    moq: raw.moq,
    moqUnit: raw.moqUnit,
    country: raw.country ?? "",
    categoryId: raw.categoryId,
    categoryName: raw.category?.name ?? raw.categoryName ?? "",
    categorySlug: raw.category?.slug ?? raw.categorySlug ?? undefined,
    subCategoryId: raw.subCategoryId ?? undefined,
    subCategoryName: raw.subCategory?.name ?? raw.subCategoryName ?? undefined,
    subCategorySlug: raw.subCategory?.slug ?? raw.subCategorySlug ?? undefined,
    supplierId: raw.supplierId,
    supplierName: raw.supplier?.name ?? raw.supplierName ?? "",
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
