import { api, storageUrl } from "./client";
import { DEFAULT_THEME, parseTheme, type StorefrontTheme } from "@/lib/theme";

export interface ThemeResponse {
  theme: StorefrontTheme;
  logoUrl: string | null;
  /** True only when payload came from the API (not a local default fallback) */
  fromApi: boolean;
}

const THEME_CACHE_KEY = "mfresh-storefront-theme-v1";

function resolveLogoUrl(
  theme: StorefrontTheme,
  apiLogoUrl?: string | null,
): string | null {
  if (theme.logoStyle !== "image") return null;
  if (apiLogoUrl) return apiLogoUrl;
  if (theme.logoPath) {
    const url = storageUrl(theme.logoPath);
    if (url && !url.includes("placeholder")) return url;
  }
  return null;
}

function normalizeThemePayload(
  data: { theme: unknown; logoUrl?: string | null },
  fromApi: boolean,
): ThemeResponse {
  const theme = parseTheme(data.theme);
  return {
    theme,
    logoUrl: resolveLogoUrl(theme, data.logoUrl),
    fromApi,
  };
}

export function readCachedTheme(): ThemeResponse | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(THEME_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ThemeResponse;
    if (!parsed?.theme) return null;
    return {
      theme: parseTheme(parsed.theme),
      logoUrl: parsed.logoUrl ?? null,
      fromApi: true,
    };
  } catch {
    return null;
  }
}

export function writeCachedTheme(data: ThemeResponse) {
  if (typeof window === "undefined" || !data.fromApi) return;
  try {
    localStorage.setItem(
      THEME_CACHE_KEY,
      JSON.stringify({
        theme: data.theme,
        logoUrl: data.logoUrl,
        fromApi: true,
      }),
    );
  } catch {
    /* ignore */
  }
}

export function isThemeUsable(data: ThemeResponse | null | undefined): boolean {
  if (!data?.fromApi) return false;
  if (data.theme.logoStyle === "image") return Boolean(data.logoUrl);
  return true;
}

export async function getStorefrontTheme(): Promise<ThemeResponse> {
  try {
    const data = await api<{ theme: unknown; logoUrl?: string | null }>(
      "/public/settings/theme",
    );
    const result = normalizeThemePayload(data, true);
    writeCachedTheme(result);
    return result;
  } catch {
    const cached = readCachedTheme();
    if (cached) return cached;
    return { theme: { ...DEFAULT_THEME }, logoUrl: null, fromApi: false };
  }
}

const FALLBACK_THEME: ThemeResponse = {
  theme: { ...DEFAULT_THEME },
  logoUrl: null,
  fromApi: false,
};

/** Avoid hanging Netlify/CI static generation when the API is unreachable */
function isProductionBuild(): boolean {
  return process.env.NEXT_PHASE === "phase-production-build";
}

export async function getStorefrontThemeServer(): Promise<ThemeResponse> {
  // Root layout runs for every page during `next build`. A hanging fetch
  // makes static generation hit the 60s timeout (Netlify failure).
  // Theme is loaded on the client via ThemeProvider instead.
  if (isProductionBuild()) {
    return FALLBACK_THEME;
  }

  const API_URL =
    process.env.INTERNAL_API_URL ??
    process.env.NEXT_PUBLIC_API_URL ??
    "http://localhost:4005/api/v1";

  try {
    const res = await fetch(`${API_URL}/public/settings/theme`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 30 },
      signal: AbortSignal.timeout(5_000),
    });
    if (!res.ok) throw new Error(`theme ${res.status}`);
    const data = (await res.json()) as {
      theme: unknown;
      logoUrl?: string | null;
    };
    return normalizeThemePayload(data, true);
  } catch {
    return FALLBACK_THEME;
  }
}

/** Preload logo image so we don't flash after revealing the site */
export function preloadImage(url: string): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve();
      return;
    }
    const img = new window.Image();
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = url;
  });
}
