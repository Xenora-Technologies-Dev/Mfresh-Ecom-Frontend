"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCountries } from "@/lib/api/countries";
import {
  getCountryMeta,
  getDefaultCountriesWithFlags,
} from "@/lib/countries";
import { AnimatedSection } from "@/components/shared/animated-section";
import { SectionHeader } from "@/components/shared/section-header";
import { SectionSlider } from "@/components/shared/section-slider";
import { Skeleton } from "@/components/shared/skeletons";
import type { Country } from "@/types";

const COUNTRIES_PER_PAGE = 10;

function CountryCard({ country }: { country: Country }) {
  return (
    <Link
      href={`/products?country=${encodeURIComponent(country.name)}`}
      className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-surface p-4 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary-light/30 hover:shadow-md"
    >
      <span className="text-3xl">{country.flag || getCountryMeta(country.name).flag}</span>
      <span className="text-xs font-semibold text-dark-gray sm:text-sm">
        {country.name}
      </span>
    </Link>
  );
}

function mergeCountries(api: Country[]): Country[] {
  const defaults = getDefaultCountriesWithFlags();
  const byName = new Map<string, Country>();

  for (const d of defaults) {
    byName.set(d.name.toLowerCase(), {
      id: `default-${d.code}`,
      name: d.name,
      code: d.code,
      flag: d.flag,
      supplierCount: 0,
    });
  }

  for (const c of api) {
    const key = c.name.toLowerCase();
    const existing = byName.get(key);
    byName.set(key, {
      ...existing,
      ...c,
      flag: c.flag || existing?.flag || getCountryMeta(c.name).flag,
      code: c.code || existing?.code || getCountryMeta(c.name).code,
    });
  }

  return Array.from(byName.values()).sort((a, b) => a.name.localeCompare(b.name));
}

export function CountriesSection() {
  const { data: apiCountries = [], isLoading } = useQuery({
    queryKey: ["countries"],
    queryFn: getCountries,
  });

  const countries = useMemo(
    () => mergeCountries(apiCountries),
    [apiCountries],
  );

  const title = `Source From ${countries.length}+ Countries`;

  return (
    <AnimatedSection className="py-10 sm:py-14 fresh-section-alt">
      <div className="container-main">
        <SectionHeader
          title={title}
          subtitle="Global reach for wholesale food sourcing"
          align="center"
        />
        {isLoading && apiCountries.length === 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            {Array.from({ length: 10 }).map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-2xl" />
            ))}
          </div>
        ) : (
          <SectionSlider
            items={countries}
            itemsPerPage={COUNTRIES_PER_PAGE}
            autoPlay
            autoPlayIntervalMs={5000}
            gridClassName="grid grid-cols-2 gap-3 sm:grid-cols-5 sm:gap-4"
            renderItem={(country) => (
              <CountryCard key={country.id} country={country} />
            )}
          />
        )}
      </div>
    </AnimatedSection>
  );
}
