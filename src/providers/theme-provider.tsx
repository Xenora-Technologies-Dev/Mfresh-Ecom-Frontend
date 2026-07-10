"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getStorefrontTheme,
  isThemeUsable,
  preloadImage,
  readCachedTheme,
  writeCachedTheme,
  type ThemeResponse,
} from "@/lib/api/theme";
import {
  DEFAULT_THEME,
  applyThemeToDocument,
  type StorefrontTheme,
} from "@/lib/theme";
import { useBoot } from "@/providers/boot-provider";

interface ThemeContextValue {
  theme: StorefrontTheme;
  logoUrl: string | null;
  isLoading: boolean;
  isReady: boolean;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: DEFAULT_THEME,
  logoUrl: null,
  isLoading: true,
  isReady: false,
});

interface ThemeProviderProps {
  children: React.ReactNode;
  initialTheme?: ThemeResponse | null;
}

export function ThemeProvider({ children, initialTheme }: ThemeProviderProps) {
  const { markThemeReady } = useBoot();
  const serverOk = isThemeUsable(initialTheme);
  const [cached] = useState(() => readCachedTheme());
  const cacheOk = isThemeUsable(cached);

  const seed =
    serverOk && initialTheme
      ? initialTheme
      : cacheOk && cached
        ? cached
        : null;

  const [isReady, setIsReady] = useState(false);

  const { data, isFetched, isError } = useQuery({
    queryKey: ["storefront-theme"],
    queryFn: getStorefrontTheme,
    initialData: seed ?? undefined,
    staleTime: 60 * 1000,
    refetchOnMount: !seed,
  });

  const theme = data?.theme ?? seed?.theme ?? DEFAULT_THEME;
  const logoUrl = data?.logoUrl ?? seed?.logoUrl ?? null;

  useEffect(() => {
    applyThemeToDocument(theme);
  }, [theme]);

  useEffect(() => {
    if (data?.fromApi) writeCachedTheme(data);
  }, [data]);

  useEffect(() => {
    let cancelled = false;

    async function settle() {
      const current = data ?? seed;
      if (!current) {
        if (isFetched || isError) {
          if (!cancelled) {
            setIsReady(true);
            markThemeReady();
          }
        }
        return;
      }

      if (!current.fromApi && !isFetched) return;

      if (current.theme.logoStyle === "image" && current.logoUrl) {
        await preloadImage(current.logoUrl);
      }

      if (!cancelled) {
        setIsReady(true);
        markThemeReady();
      }
    }

    void settle();
    return () => {
      cancelled = true;
    };
  }, [data, seed, isFetched, isError, markThemeReady]);

  const value = useMemo(
    () => ({
      theme,
      logoUrl,
      isLoading: !isReady,
      isReady,
    }),
    [theme, logoUrl, isReady],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
