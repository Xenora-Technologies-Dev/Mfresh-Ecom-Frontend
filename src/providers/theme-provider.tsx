"use client";

import { createContext, useContext, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getStorefrontTheme } from "@/lib/api/theme";
import {
  DEFAULT_THEME,
  applyThemeToDocument,
  type StorefrontTheme,
} from "@/lib/theme";

interface ThemeContextValue {
  theme: StorefrontTheme;
  logoUrl: string | null;
  isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: DEFAULT_THEME,
  logoUrl: null,
  isLoading: true,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { data, isLoading } = useQuery({
    queryKey: ["storefront-theme"],
    queryFn: getStorefrontTheme,
    staleTime: 5 * 60 * 1000,
  });

  const theme = data?.theme ?? DEFAULT_THEME;
  const logoUrl = data?.logoUrl ?? null;

  useEffect(() => {
    applyThemeToDocument(theme);
  }, [theme]);

  const value = useMemo(
    () => ({ theme, logoUrl, isLoading }),
    [theme, logoUrl, isLoading],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
