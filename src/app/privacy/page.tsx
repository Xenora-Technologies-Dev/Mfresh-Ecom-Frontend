import { PageHero } from "@/components/shared/page-hero";
import { AnimatedSection } from "@/components/shared/animated-section";

export const metadata = {
  title: "Privacy Policy",
  description: "MFresh UAE privacy policy.",
};

export default function PrivacyPage() {
  return (
    <>
      <PageHero title="Privacy Policy" subtitle="Last updated: June 2026" />
      <AnimatedSection className="py-14 sm:py-20">
        <div className="container-main">
          <div className="prose prose-gray mx-auto max-w-3xl space-y-6 text-muted">
            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-dark-gray">Introduction</h2>
              <p className="leading-relaxed">
                MFresh UAE (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) is committed to protecting
                your privacy. This Privacy Policy explains how we collect, use, disclose,
                and safeguard your information when you use our B2B food marketplace platform.
              </p>
            </section>
            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-dark-gray">Information We Collect</h2>
              <p className="leading-relaxed">
                We collect business information you provide during registration, including
                company name, contact details, and business type. We also collect usage data
                such as pages visited, search queries, and interaction with products and suppliers.
              </p>
            </section>
            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-dark-gray">How We Use Your Information</h2>
              <p className="leading-relaxed">
                Your information is used to provide and improve our services, process
                registrations, facilitate connections between buyers and suppliers, and
                communicate important updates about the platform.
              </p>
            </section>
            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-dark-gray">Data Security</h2>
              <p className="leading-relaxed">
                We implement appropriate technical and organizational measures to protect
                your personal and business data against unauthorized access, alteration,
                disclosure, or destruction.
              </p>
            </section>
            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-dark-gray">Contact</h2>
              <p className="leading-relaxed">
                For privacy-related inquiries, contact us at hello@mfresh.ae.
              </p>
            </section>
          </div>
        </div>
      </AnimatedSection>
    </>
  );
}
