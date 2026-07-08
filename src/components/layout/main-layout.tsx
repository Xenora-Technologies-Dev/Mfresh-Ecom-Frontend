import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PromoMessageBar } from "@/components/layout/promo-message-bar";
import { MFreshyBot } from "@/components/shared/mfreshy-bot";

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <PromoMessageBar />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <MFreshyBot />
    </div>
  );
}
