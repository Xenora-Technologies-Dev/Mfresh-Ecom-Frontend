import { api, storageUrl } from "./client";
import { DEFAULT_THEME, parseTheme, type StorefrontTheme } from "@/lib/theme";

export interface ThemeResponse {
  theme: StorefrontTheme;
  logoUrl: string | null;
}

export async function getStorefrontTheme(): Promise<ThemeResponse> {
  try {
    const data = await api<{ theme: unknown; logoUrl?: string | null }>(
      "/public/settings/theme",
    );
    const theme = parseTheme(data.theme);
    const logoUrl =
      theme.logoStyle === "image"
        ? data.logoUrl ?? (theme.logoPath ? storageUrl(theme.logoPath) : null)
        : null;
    return { theme, logoUrl };
  } catch {
    return { theme: { ...DEFAULT_THEME }, logoUrl: null };
  }
}
