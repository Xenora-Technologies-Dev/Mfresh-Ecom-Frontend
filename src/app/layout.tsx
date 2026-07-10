import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { MainLayout } from "@/components/layout/main-layout";
import { QueryProvider } from "@/providers/query-provider";
import { ToastProvider } from "@/providers/toast-provider";
import { CurrencyRatesProvider } from "@/providers/currency-provider";
import { ThemeProvider } from "@/providers/theme-provider";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${plusJakarta.variable} h-full scroll-smooth`}>
      <body className="min-h-full flex flex-col font-sans antialiased text-dark-gray bg-fresh-mint">
        <QueryProvider>
          <ToastProvider />
          <CurrencyRatesProvider>
            <ThemeProvider>
              <MainLayout>{children}</MainLayout>
            </ThemeProvider>
          </CurrencyRatesProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
