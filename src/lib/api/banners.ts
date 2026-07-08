import { api, type PaginatedResponse, qs } from "./client";
import { mapBanner } from "./mappers";
import type { Banner } from "@/types";

async function fetchBanners(type?: string): Promise<Banner[]> {
  const res = await api<PaginatedResponse<Record<string, unknown>>>(
    `/banners${qs({
      isEnabled: true,
      limit: 20,
      sortBy: "sortOrder",
      sortOrder: "asc",
      ...(type ? { type } : {}),
    })}`,
  );
  return (res.data ?? []).map((b, i) => mapBanner(b, i));
}

export async function getHeroBanners(): Promise<Banner[]> {
  return fetchBanners("HERO_SLIDER");
}

export async function getPromoBanners(): Promise<Banner[]> {
  return fetchBanners("OFFER");
}

export async function getBanners(): Promise<Banner[]> {
  return fetchBanners();
}
