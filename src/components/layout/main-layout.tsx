import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PromoMessageBar } from "@/components/layout/promo-message-bar";
import { CountryWelcomeBanner } from "@/components/layout/country-welcome-banner";
import { FloatingWidgets } from "@/components/layout/floating-widgets";

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <PromoMessageBar />
      <Header />
      <CountryWelcomeBanner />
      <main className="flex-1">{children}</main>
      <Footer />
      <FloatingWidgets />
    </div>
  );
}
