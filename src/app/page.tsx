import { HeroBanner } from "@/components/home/hero-section";
import { TrustBar } from "@/components/home/trust-bar";
import { FoodCategoriesGrid } from "@/components/home/food-categories-grid";
import {
  NewArrivalsSection,
  FeaturedProductsSection,
} from "@/components/home/product-sections";
import { CountriesSection } from "@/components/home/countries-section";

export default function HomePage() {
  return (
    <>
      <HeroBanner />
      <TrustBar />
      <FoodCategoriesGrid />
      <NewArrivalsSection />
      <FeaturedProductsSection />
      <CountriesSection />
    </>
  );
}
