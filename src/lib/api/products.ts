import { api, type ListParams, type PaginatedResponse, qs } from "./client";
import { mapProduct } from "./mappers";
import type { Product, ProductFilters } from "@/types";

function toQuery(filters: ProductFilters & { page?: number; limit?: number } = {}): ListParams {
  return {
    page: filters.page ?? 1,
    limit: filters.limit ?? 100,
    search: filters.search,
    categoryId: filters.category,
    subCategoryId: filters.subCategory,
    supplierId: filters.supplier,
    country: filters.country,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    isActive: true,
    popular: filters.popular,
    featured: filters.featured,
    isNew: filters.isNew,
  };
}

export async function getProducts(filters: ProductFilters = {}): Promise<Product[]> {
  const res = await api<PaginatedResponse<Record<string, unknown>>>(
    `/products${qs(toQuery(filters))}`,
  );
  return res.data.map(mapProduct);
}

export async function getProductsPaginated(
  filters: ProductFilters & { page?: number; limit?: number } = {},
) {
  const res = await api<PaginatedResponse<Record<string, unknown>>>(
    `/products${qs(toQuery(filters))}`,
  );
  return {
    products: res.data.map(mapProduct),
    meta: res.meta,
  };
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const raw = await api<Record<string, unknown>>(`/products/slug/${slug}`);
    return mapProduct(raw);
  } catch {
    return null;
  }
}

export async function getPopularProducts(): Promise<Product[]> {
  return getProducts({ popular: true, limit: 8 });
}

export async function getNewArrivals(): Promise<Product[]> {
  return getProducts({ isNew: true, limit: 8 });
}

export async function getFeaturedProducts(): Promise<Product[]> {
  return getProducts({ featured: true, limit: 8 });
}

export async function getRelatedProducts(
  productId: string,
  categoryId: string,
): Promise<Product[]> {
  try {
    const res = await api<PaginatedResponse<Record<string, unknown>>>(
      `/products${qs({ categoryId, limit: 4, isActive: true })}`,
    );
    return res.data
      .filter((p) => p.id !== productId)
      .map(mapProduct)
      .slice(0, 4);
  } catch {
    return [];
  }
}

export async function getPriceRange(): Promise<{ min: number; max: number }> {
  const meta = await api<{ priceRange: { min: number; max: number } }>(
    "/products/meta",
  );
  return meta.priceRange;
}

export async function getUniqueCountries(): Promise<string[]> {
  const meta = await api<{ countries: string[] }>("/products/meta");
  return meta.countries;
}

export async function getProductsByIds(ids: string[]): Promise<Product[]> {
  if (!ids.length) return [];
  const res = await api<PaginatedResponse<Record<string, unknown>>>(
    `/products${qs({ ids: ids.join(","), limit: Math.max(ids.length, 1) })}`,
  );
  const byId = new Map(res.data.map((p) => [p.id as string, mapProduct(p)]));
  return ids.map((id) => byId.get(id)).filter((p): p is Product => !!p);
}
