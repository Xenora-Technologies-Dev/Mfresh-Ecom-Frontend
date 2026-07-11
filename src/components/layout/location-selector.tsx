"use client";

import { MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { getCountries } from "@/lib/api/countries";
import { DEFAULT_REGION } from "@/lib/constants";
import { DEFAULT_COUNTRY_OPTIONS, mergeCountryLists } from "@/lib/countries";
import { useRegionStore } from "@/store/region-store";
import { CountryFlagIcon } from "@/components/shared/country-flag-icon";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";

export function LocationSelector({ compact }: { compact?: boolean }) {
  const router = useRouter();
  const country = useRegionStore((s) => s.country);
  const setCountry = useRegionStore((s) => s.setCountry);
  const phase = useRegionStore((s) => s.phase);

  const { data: countries = [] } = useQuery({
    queryKey: ["countries", "header"],
    queryFn: getCountries,
    staleTime: 10 * 60 * 1000,
  });

  const options = useMemo(
    () =>
      mergeCountryLists(
        [DEFAULT_REGION],
        DEFAULT_COUNTRY_OPTIONS,
        countries.map((c) => c.name),
      ),
    [countries],
  );

  useEffect(() => {
    if (!country) {
      useRegionStore.setState({ country: DEFAULT_REGION });
    }
  }, [country]);

  const handleChange = (value: string) => {
    if (value === country) return;
    setCountry(value);
    router.refresh();
    if (typeof window !== "undefined" && window.location.pathname !== "/") {
      router.push("/");
    }
  };

  return (
    <Select
      value={country || DEFAULT_REGION}
      onValueChange={handleChange}
      disabled={phase === "loading"}
    >
      <SelectTrigger
        className={
          compact
            ? "h-9 max-w-[140px] gap-1 border-0 bg-transparent px-1 text-sm font-medium text-dark-gray shadow-none focus:ring-0"
            : "h-10 max-w-[160px] gap-1.5 border-0 bg-transparent px-2 text-sm font-medium text-dark-gray shadow-none focus:ring-0"
        }
        aria-label="Select country"
      >
        <MapPin className="h-4 w-4 shrink-0 text-secondary" />
        <span className="truncate">{country || DEFAULT_REGION}</span>
      </SelectTrigger>
      <SelectContent align="end" className="z-[200] max-h-72">
        {options.map((name) => (
          <SelectItem key={name} value={name} className="cursor-pointer">
            <span className="flex items-center gap-2">
              <CountryFlagIcon country={name} size={18} />
              <span>{name}</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
