"use client";

import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getSuppliers } from "@/lib/api/suppliers";
import { SupplierCard } from "@/components/suppliers/supplier-card";
import { PageHero } from "@/components/shared/page-hero";
import { EmptyState } from "@/components/shared/empty-state";

export default function SuppliersPageContent() {
  const searchParams = useSearchParams();
  const supplierSlug = searchParams.get("supplier");

  const { data: suppliers = [], isLoading } = useQuery({
    queryKey: ["suppliers"],
    queryFn: getSuppliers,
  });

  const filtered = supplierSlug
    ? suppliers.filter((s) => s.slug === supplierSlug || s.id === supplierSlug)
    : suppliers;

  return (
    <>
      <PageHero
        title="Suppliers"
        subtitle="Connect with verified food suppliers on our marketplace"
      />
      <section className="py-10 sm:py-14">
        <div className="container-main">
          {isLoading ? (
            <p className="text-center text-muted">Loading suppliers...</p>
          ) : filtered.length === 0 ? (
            <EmptyState
              title="No suppliers yet"
              message="Suppliers added in the admin portal will appear here."
            />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((supplier, i) => (
                <SupplierCard key={supplier.id} supplier={supplier} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
