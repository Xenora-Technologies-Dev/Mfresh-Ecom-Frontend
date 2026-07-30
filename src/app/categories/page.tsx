import { Suspense } from "react";
import { PageLoader } from "@/components/shared/page-loader";
import CategoriesPageContent from "./categories-content";

export const metadata = {
  title: "Categories",
  description: "Browse all food categories on MFresh UAE marketplace.",
};

export default function CategoriesPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <CategoriesPageContent />
    </Suspense>
  );
}
