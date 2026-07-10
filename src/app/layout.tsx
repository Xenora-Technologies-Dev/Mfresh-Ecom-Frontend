import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { MainLayout } from "@/components/layout/main-layout";
import { QueryProvider } from "@/providers/query-provider";
import { ToastProvider } from "@/providers/toast-provider";
import { CurrencyRatesProvider } from "@/providers/currency-provider";
import { BootProvider } from "@/providers/boot-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { getStorefrontThemeServer } from "@/lib/api/theme";
import { themeToCssVars } from "@/lib/theme";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/constants";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
};

/** Pre-hydration cover — CSS only, never removed from the DOM by JS */
const BOOT_SPLASH_CSS = `
html:not([data-theme-ready="1"]) body::before{
  content:"";
  position:fixed;inset:0;z-index:99999;
  background:#F4FAF6;
}
`;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialTheme = await getStorefrontThemeServer();
  const cssVars = themeToCssVars(initialTheme.theme);
  const styleText = Object.entries(cssVars)
    .map(([k, v]) => `${k}:${v}`)
    .join(";");

  return (
    <html
      lang="en"
      className={`${plusJakarta.variable} h-full scroll-smooth`}
      style={cssVars as React.CSSProperties}
    >
      <head>
        <style
          dangerouslySetInnerHTML={{
            __html: `:root{${styleText}}${BOOT_SPLASH_CSS}`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans antialiased text-dark-gray bg-fresh-mint">
        <QueryProvider>
          <ToastProvider />
          <CurrencyRatesProvider>
            <BootProvider>
              <ThemeProvider initialTheme={initialTheme}>
                <MainLayout>{children}</MainLayout>
              </ThemeProvider>
            </BootProvider>
          </CurrencyRatesProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
