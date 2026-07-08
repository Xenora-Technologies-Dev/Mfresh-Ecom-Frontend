"use client";

import { useQuery } from "@tanstack/react-query";
import { getCategories } from "@/lib/api/categories";
import { getPriceRange, getUniqueCountries } from "@/lib/api/products";
import { getSuppliers } from "@/lib/api/suppliers";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCurrencyStore } from "@/store/currency-store";
import { convertFromUsd, toUsdAmount } from "@/lib/currency";
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
  const { data: suppliers = [] } = useQuery({
    queryKey: ["suppliers"],
    queryFn: getSuppliers,
  });

  const { data: meta } = useQuery({
    queryKey: ["products-meta"],
    queryFn: async () => {
      const [priceRange, countries] = await Promise.all([
        getPriceRange(),
        getUniqueCountries(),
      ]);
      return { priceRange, countries };
    },
  });

  const countries = meta?.countries ?? [];
  const priceRange = meta?.priceRange ?? { min: 0, max: 0 };
  const { currency, rates } = useCurrencyStore();

  const displayMin = Math.round(
    convertFromUsd(toUsdAmount(priceRange.min, "USD", rates), currency, rates),
  );
  const displayMax = Math.round(
    convertFromUsd(toUsdAmount(priceRange.max, "USD", rates), currency, rates),
  );
  const selectedCategory = categories.find((c) => c.id === filters.category);

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
            onChange({ ...filters, category: v === "all" ? undefined : v, subCategory: undefined })
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

      {selectedCategory && selectedCategory.subcategories.length > 0 && (
        <div className="space-y-2">
          <Label>Sub Category (optional)</Label>
          <Select
            value={filters.subCategory ?? "all"}
            onValueChange={(v) =>
              onChange({
                ...filters,
                subCategory: v === "all" ? undefined : v,
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="All subcategories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All subcategories</SelectItem>
              {selectedCategory.subcategories.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

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

      <div className="space-y-2">
        <Label>Supplier</Label>
        <Select
          value={filters.supplier ?? "all"}
          onValueChange={(v) =>
            onChange({ ...filters, supplier: v === "all" ? undefined : v })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="All suppliers" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All suppliers</SelectItem>
            {suppliers.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>
          Price Range ({displayMin} - {displayMax} {currency})
        </Label>
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={filters.minPrice ?? ""}
            onChange={(e) =>
              onChange({
                ...filters,
                minPrice: e.target.value ? Number(e.target.value) : undefined,
              })
            }
          />
          <Input
            type="number"
            placeholder="Max"
            value={filters.maxPrice ?? ""}
            onChange={(e) =>
              onChange({
                ...filters,
                maxPrice: e.target.value ? Number(e.target.value) : undefined,
              })
            }
          />
        </div>
      </div>
    </div>
  );
}
