import { api, type PaginatedResponse, qs } from "./client";
import { mapSupplier } from "./mappers";
import type { Supplier } from "@/types";

export async function getSuppliers(): Promise<Supplier[]> {
  const res = await api<PaginatedResponse<Record<string, unknown>>>(
    `/suppliers${qs({ limit: 100, isActive: true })}`,
  );
  return res.data.map(mapSupplier);
}

export async function getFeaturedSuppliers(): Promise<Supplier[]> {
  const res = await api<PaginatedResponse<Record<string, unknown>>>(
    `/suppliers${qs({ limit: 6, isActive: true, verified: true, sortBy: "rating", sortOrder: "desc" })}`,
  );
  return res.data.map(mapSupplier);
}

export async function getSupplierBySlug(slug: string): Promise<Supplier | null> {
  try {
    const all = await getSuppliers();
    return all.find((s) => s.slug === slug) ?? null;
  } catch {
    return null;
  }
}

export async function searchSuppliers(query: string): Promise<Supplier[]> {
  const res = await api<PaginatedResponse<Record<string, unknown>>>(
    `/suppliers${qs({ search: query, limit: 20, isActive: true })}`,
  );
  return res.data.map(mapSupplier);
}
