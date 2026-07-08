import { Suspense } from "react";
import SuppliersPageContent from "./suppliers-content";

export const metadata = {
  title: "Suppliers",
  description: "Browse verified food suppliers on MFresh UAE marketplace.",
};

export default function SuppliersPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-muted">Loading...</div>}>
      <SuppliersPageContent />
    </Suspense>
  );
}
