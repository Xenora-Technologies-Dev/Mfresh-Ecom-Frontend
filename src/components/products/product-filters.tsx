"use client";

import { useQuery } from "@tanstack/react-query";
import { getCategories } from "@/lib/api/categories";
import { getUniqueCountries } from "@/lib/api/products";
import { DEFAULT_COUNTRY_OPTIONS, mergeCountryLists } from "@/lib/countries";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type { ProductFilters } from "@/types";

interface ProductFiltersPanelProps {
  filters: ProductFilters;
  onChange: (filters: ProductFilters) => void;
  onReset: () => void;
}

export function ProductFiltersPanel({
  filters,
  onChange,
  onReset,
}: ProductFiltersPanelProps) {
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const { data: countriesMeta = [] } = useQuery({
    queryKey: ["products-countries"],
    queryFn: getUniqueCountries,
  });

  const countries = mergeCountryLists(
    DEFAULT_COUNTRY_OPTIONS,
    countriesMeta,
  );

  return (
    <div className="space-y-6 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-dark-gray">Filters</h3>
        <Button variant="ghost" size="sm" onClick={onReset}>
          Reset
        </Button>
      </div>

      <div className="space-y-2">
        <Label>Category</Label>
        <Select
          value={filters.category ?? "all"}
          onValueChange={(v) =>
            onChange({ ...filters, category: v === "all" ? undefined : v })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Country</Label>
        <Select
          value={filters.country ?? "all"}
          onValueChange={(v) =>
            onChange({ ...filters, country: v === "all" ? undefined : v })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="All countries" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All countries</SelectItem>
            {countries.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
