"use client";

import { Suspense } from "react";
import { PageLoader } from "@/components/shared/page-loader";
import ProductsPageContent from "./products-content";

export default function ProductsPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <ProductsPageContent />
    </Suspense>
  );
}
