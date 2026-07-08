"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getFeaturedSuppliers } from "@/lib/api/suppliers";
import { SupplierCard } from "@/components/suppliers/supplier-card";
import { AnimatedSection } from "@/components/shared/animated-section";
import { SectionHeader } from "@/components/shared/section-header";

export function FeaturedSuppliersSection() {
  const { data: suppliers = [], isLoading } = useQuery({
    queryKey: ["suppliers", "featured"],
    queryFn: getFeaturedSuppliers,
  });

  if (!isLoading && suppliers.length === 0) return null;

  return (
    <AnimatedSection className="py-14 sm:py-20">
      <div className="container-main">
        <SectionHeader
          title="Featured Suppliers"
          subtitle="Trusted partners delivering quality worldwide"
          href="/suppliers"
        />
        {isLoading ? (
          <p className="text-center text-muted">Loading suppliers...</p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {suppliers.map((supplier, i) => (
              <SupplierCard key={supplier.id} supplier={supplier} index={i} />
            ))}
          </div>
        )}
      </div>
    </AnimatedSection>
  );
}
