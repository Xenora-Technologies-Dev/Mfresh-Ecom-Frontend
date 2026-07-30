"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PromoMessageBar } from "@/components/layout/promo-message-bar";
import { CountryWelcomeBanner } from "@/components/layout/country-welcome-banner";
import { GetStartedModal } from "@/components/layout/get-started-modal";
import { FloatingWidgets } from "@/components/layout/floating-widgets";
import { NavigationCanvas } from "@/components/layout/navigation-canvas";

/** Paths that render their own clean auth/dashboard layout without the storefront chrome. */
const CHROME_LESS_PREFIXES = ["/login", "/sign-up", "/onboarding", "/buyer", "/seller"];

function isChromeLessPath(pathname: string) {
  return CHROME_LESS_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export function ConditionalChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (isChromeLessPath(pathname)) {
    return <>{children}</>;
  }

  return (
    <>
      <PromoMessageBar />
      <Header />
      <CountryWelcomeBanner />
      <GetStartedModal />
      <main className="flex flex-1 flex-col">
        <NavigationCanvas>{children}</NavigationCanvas>
      </main>
      <Footer />
      <FloatingWidgets />
    </>
  );
}
