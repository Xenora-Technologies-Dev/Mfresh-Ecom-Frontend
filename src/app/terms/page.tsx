import { PageHero } from "@/components/shared/page-hero";
import { AnimatedSection } from "@/components/shared/animated-section";

export const metadata = {
  title: "Terms of Service",
  description: "MFresh UAE terms of service.",
};

export default function TermsPage() {
  return (
    <>
      <PageHero title="Terms of Service" subtitle="Last updated: June 2026" />
      <AnimatedSection className="py-14 sm:py-20">
        <div className="container-main">
          <div className="mx-auto max-w-3xl space-y-6 text-muted">
            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-dark-gray">Acceptance of Terms</h2>
              <p className="leading-relaxed">
                By accessing or using MFresh UAE, you agree to be bound by these Terms of
                Service. If you do not agree, please do not use our platform.
              </p>
            </section>
            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-dark-gray">Platform Use</h2>
              <p className="leading-relaxed">
                MFresh is a B2B marketplace connecting buyers and suppliers. Users must
                provide accurate business information and use the platform only for lawful
                commercial food procurement purposes.
              </p>
            </section>
            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-dark-gray">Buyer & Supplier Responsibilities</h2>
              <p className="leading-relaxed">
                Buyers are responsible for verifying product specifications and compliance
                with local regulations. Suppliers must maintain accurate listings, honor
                MOQs, and comply with all applicable food safety standards.
              </p>
            </section>
            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-dark-gray">Limitation of Liability</h2>
              <p className="leading-relaxed">
                MFresh acts as a marketplace facilitator. We are not a party to transactions
                between buyers and suppliers and are not liable for product quality, delivery,
                or disputes arising from such transactions.
              </p>
            </section>
            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-dark-gray">Contact</h2>
              <p className="leading-relaxed">
                For questions about these terms, contact hello@mfresh.ae.
              </p>
            </section>
          </div>
        </div>
      </AnimatedSection>
    </>
  );
}
