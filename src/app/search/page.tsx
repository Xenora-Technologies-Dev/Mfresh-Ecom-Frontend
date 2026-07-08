import { Suspense } from "react";
import SearchPageContent from "./search-content";

export const metadata = {
  title: "Search",
  description: "Search products, categories, and suppliers on MFresh UAE.",
};

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-muted">Loading...</div>}>
      <SearchPageContent />
    </Suspense>
  );
}
