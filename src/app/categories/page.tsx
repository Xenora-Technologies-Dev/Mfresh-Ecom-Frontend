import { Suspense } from "react";
import CategoriesPageContent from "./categories-content";

export const metadata = {
  title: "Categories",
  description: "Browse all food categories on MFresh UAE marketplace.",
};

export default function CategoriesPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-muted">Loading...</div>}>
      <CategoriesPageContent />
    </Suspense>
  );
}
