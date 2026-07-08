"use client";

import { Suspense } from "react";
import ProductsPageContent from "./products-content";

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-muted">Loading...</div>}>
      <ProductsPageContent />
    </Suspense>
  );
}
