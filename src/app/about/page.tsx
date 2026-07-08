import Link from "next/link";
import { ArrowRight, Target, Users, Award } from "lucide-react";
import { PageHero } from "@/components/shared/page-hero";
import { AnimatedSection } from "@/components/shared/animated-section";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "About",
  description: "Learn about MFresh — the global premium B2B food marketplace.",
};

const values = [
  {
    icon: Target,
    title: "Our Mission",
    description:
      "To revolutionize B2B food procurement globally by connecting buyers with verified suppliers through a transparent, efficient marketplace.",
  },
  {
    icon: Users,
    title: "Our Community",
    description:
      "Over 2,000 buyers and 500+ verified suppliers trust MFresh for their daily sourcing needs across hospitality, retail, and catering.",
  },
  {
    icon: Award,
    title: "Our Standards",
    description:
      "Every supplier is vetted for quality, compliance, and reliability. We maintain the highest standards for food safety and business integrity.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        title="About MFresh"
        subtitle="Building the future of global B2B food commerce"
      />
      <AnimatedSection className="py-14 sm:py-20">
        <div className="container-main">
          <div className="mx-auto max-w-3xl space-y-6 text-center">
            <p className="text-lg leading-relaxed text-muted">
              MFresh is a modern B2B food marketplace designed for hotels,
              restaurants, retailers, and caterers across the Middle East,
              Asia-Pacific, and worldwide who demand quality, speed, and
              transparency in their procurement process.
            </p>
            <p className="text-base leading-relaxed text-muted">
              We combine cutting-edge technology with deep industry expertise to
              create a platform that simplifies sourcing, reduces costs, and
              opens access to premium ingredients from over 40 countries.
            </p>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="py-14 sm:py-20 bg-light-gray/50">
        <div className="container-main">
          <div className="grid gap-8 md:grid-cols-3">
            {values.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm text-center"
              >
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <item.icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold text-dark-gray">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="py-14 sm:py-20">
        <div className="container-main text-center">
          <h2 className="text-2xl font-bold text-dark-gray sm:text-3xl">
            Ready to transform your sourcing?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-muted">
            Join thousands of businesses already using MFresh for smarter food procurement.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/become-buyer">
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </AnimatedSection>
    </>
  );
}
