import { api, type PaginatedResponse, qs } from "./client";
import { mapCategory } from "./mappers";
import type { Category } from "@/types";

export async function getCategories(): Promise<Category[]> {
  const res = await api<PaginatedResponse<Record<string, unknown>>>(
    `/categories${qs({ limit: 100, isActive: true })}`,
  );
  return res.data.map(mapCategory);
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const raw = await api<Record<string, unknown>>(`/categories/slug/${slug}`);
    return mapCategory(raw);
  } catch {
    return null;
  }
}

export async function searchCategories(query: string): Promise<Category[]> {
  const res = await api<PaginatedResponse<Record<string, unknown>>>(
    `/categories${qs({ search: query, limit: 20, isActive: true })}`,
  );
  return res.data.map(mapCategory);
}
