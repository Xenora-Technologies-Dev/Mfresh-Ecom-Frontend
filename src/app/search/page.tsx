import { Suspense } from "react";
import { PageLoader } from "@/components/shared/page-loader";
import SearchPageContent from "./search-content";

export const metadata = {
  title: "Search",
  description: "Search products, categories, and suppliers on MFresh UAE.",
};

export default function SearchPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <SearchPageContent />
    </Suspense>
  );
}
