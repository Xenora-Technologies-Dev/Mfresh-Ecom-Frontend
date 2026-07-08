import { PageHero } from "@/components/shared/page-hero";
import { FAQsContent } from "./faqs-content";

export const metadata = {
  title: "FAQs",
  description: "Frequently asked questions about MFresh UAE marketplace.",
};

export default function FAQsPage() {
  return (
    <>
      <PageHero
        title="Frequently Asked Questions"
        subtitle="Everything you need to know about buying and selling on MFresh"
      />
      <FAQsContent />
    </>
  );
}
