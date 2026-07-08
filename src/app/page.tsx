import { HeroBanner } from "@/components/home/hero-section";
import { TrustBar } from "@/components/home/trust-bar";
import { PromoBannersSection } from "@/components/home/promo-banners";
import { CategoryPillarsSection } from "@/components/home/category-pillars";
import { CategoriesSection } from "@/components/home/product-sections";
import {
  NewArrivalsSection,
  FeaturedProductsSection,
  PopularProductsSection,
} from "@/components/home/product-sections";
import { FeaturedSuppliersSection } from "@/components/home/featured-suppliers";
import { CountriesSection } from "@/components/home/countries-section";
import { WhyChooseUsSection } from "@/components/home/why-choose-us";
import { TestimonialsSection } from "@/components/home/testimonials";
import {
  RegistrationCTA,
  NewsletterSection,
} from "@/components/home/newsletter-cta";

export default function HomePage() {
  return (
    <>
      <HeroBanner />
      <TrustBar />
      <PromoBannersSection />
      <CategoryPillarsSection />
      <CategoriesSection />
      <NewArrivalsSection />
      <FeaturedProductsSection />
      <PopularProductsSection />
      <FeaturedSuppliersSection />
      <CountriesSection />
      <WhyChooseUsSection />
      <TestimonialsSection />
      <RegistrationCTA />
      <NewsletterSection />
    </>
  );
}
