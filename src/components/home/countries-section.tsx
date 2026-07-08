"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { getCountries } from "@/lib/api/countries";
import { AnimatedSection } from "@/components/shared/animated-section";
import { SectionHeader } from "@/components/shared/section-header";
import { Skeleton } from "@/components/shared/skeletons";

export function CountriesSection() {
  const { data: countries = [], isLoading } = useQuery({
    queryKey: ["countries"],
    queryFn: getCountries,
  });

  if (!isLoading && countries.length === 0) return null;

  const title =
    countries.length > 0
      ? `Source From ${countries.length}+ Countries`
      : "Global Sourcing";

  return (
    <AnimatedSection className="py-14 sm:py-20 fresh-section-alt">
      <div className="container-main">
        <SectionHeader
          title={title}
          subtitle="Global reach with trusted suppliers worldwide"
          align="center"
        />
        {isLoading ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {countries.map((country, i) => (
              <motion.div
                key={country.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
              >
                <Link
                  href={`/products?country=${encodeURIComponent(country.name)}`}
                  className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-surface p-4 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary-light/30 hover:shadow-md"
                >
                  <span className="text-3xl">{country.flag}</span>
                  <span className="text-xs font-semibold text-dark-gray sm:text-sm">
                    {country.name}
                  </span>
                  {country.supplierCount > 0 && (
                    <span className="text-xs text-muted">
                      {country.supplierCount} suppliers
                    </span>
                  )}
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </AnimatedSection>
  );
}
