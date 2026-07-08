import { api } from "./client";
import { mapFaq, mapTestimonial, mapBanner, mapProduct, mapSupplier, mapCountry } from "./mappers";
import type { FAQ, Testimonial } from "@/types";

export async function getFaqs(): Promise<FAQ[]> {
  try {
    const data = await api<unknown>("/public/content/faqs");
    if (Array.isArray(data) && data.length > 0) return data.map(mapFaq);
    return [];
  } catch {
    return [];
  }
}

export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const data = await api<unknown>("/public/content/testimonials");
    if (Array.isArray(data) && data.length > 0) return data.map(mapTestimonial);
    return [];
  } catch {
    return [];
  }
}

export interface HomepageSection {
  id: string;
  key: string;
  title: string;
  subtitle?: string;
  config?: {
    items?: { title: string; description: string; icon?: string }[];
    badge?: string;
    searchTags?: string[];
  };
}

export async function getHomepageSections(): Promise<HomepageSection[]> {
  try {
    return await api<HomepageSection[]>("/public/sections");
  } catch {
    return [];
  }
}

export async function getHomepageData() {
  const data = await api<{
    banners: Record<string, unknown>[];
    sections: HomepageSection[];
    popularProducts: Record<string, unknown>[];
    newArrivals: Record<string, unknown>[];
    featuredProducts: Record<string, unknown>[];
    featuredSuppliers: Record<string, unknown>[];
    countries: Record<string, unknown>[];
  }>("/public/homepage");

  return {
    heroBanners: data.banners
      .filter((b) => b.type === "HERO_SLIDER")
      .map((b, i) => mapBanner(b, i)),
    promoBanners: data.banners
      .filter((b) => b.type === "OFFER")
      .map((b, i) => mapBanner(b, i)),
    sections: data.sections ?? [],
    popularProducts: data.popularProducts.map(mapProduct),
    newArrivals: data.newArrivals.map(mapProduct),
    featuredProducts: data.featuredProducts.map(mapProduct),
    featuredSuppliers: data.featuredSuppliers.map(mapSupplier),
    countries: data.countries.map(mapCountry),
  };
}
