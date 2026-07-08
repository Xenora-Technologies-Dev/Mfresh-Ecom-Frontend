import { api } from "./client";
import { mapCategory, mapProduct, mapSupplier } from "./mappers";
import type { SearchResult } from "@/types";

export async function globalSearch(query: string): Promise<SearchResult> {
  const trimmed = query.trim();
  if (!trimmed) {
    return { products: [], categories: [], suppliers: [], total: 0 };
  }

  const res = await api<{
    products: Record<string, unknown>[];
    categories: Record<string, unknown>[];
    suppliers: Record<string, unknown>[];
    total: number;
  }>(`/public/search?q=${encodeURIComponent(trimmed)}`);

  return {
    products: (res.products ?? []).map(mapProduct),
    categories: (res.categories ?? []).map(mapCategory),
    suppliers: (res.suppliers ?? []).map(mapSupplier),
    total: res.total ?? 0,
  };
}
