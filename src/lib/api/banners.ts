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

/**
 * Desktop hero slides + optional MOBILE-type crops paired by sort order.
 * When no MOBILE banners exist, desktop image is used at every breakpoint.
 */
export async function getHeroBanners(): Promise<Banner[]> {
  const [desktop, mobile] = await Promise.all([
    fetchBanners("HERO_SLIDER"),
    fetchBanners("MOBILE").catch(() => [] as Banner[]),
  ]);

  return desktop.map((banner, i) => ({
    ...banner,
    mobileImage: banner.mobileImage || mobile[i]?.image || banner.image,
  }));
}

export async function getPromoBanners(): Promise<Banner[]> {
  return fetchBanners("OFFER");
}

export async function getBanners(): Promise<Banner[]> {
  return fetchBanners();
}
