import { api, type PaginatedResponse, qs } from "./client";
import { mapCountry } from "./mappers";
import type { Country } from "@/types";

export async function getCountries(): Promise<Country[]> {
  const res = await api<PaginatedResponse<Record<string, unknown>>>(
    `/countries${qs({ limit: 100, isActive: true, sortBy: "sortOrder", sortOrder: "asc" })}`,
  );
  return res.data.map(mapCountry);
}
