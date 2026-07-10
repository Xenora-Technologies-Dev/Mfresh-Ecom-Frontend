"use client";

import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { RotatingSearchPlaceholder } from "@/components/layout/rotating-search-placeholder";
import { cn } from "@/lib/utils";

export { Logo } from "@/components/shared/logo";

interface SearchBarProps {
  className?: string;
  size?: "default" | "lg";
  defaultValue?: string;
  onSearch?: (query: string) => void;
  iconPosition?: "left" | "right";
  animatedPlaceholder?: boolean;
}

export function SearchBar({
  className,
  size = "default",
  defaultValue = "",
  onSearch,
  iconPosition = "right",
  animatedPlaceholder = true,
}: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState(defaultValue);
  const [focused, setFocused] = useState(false);

  const showAnimatedPlaceholder =
    animatedPlaceholder && !query && !focused;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (onSearch) {
      onSearch(trimmed);
      return;
    }
    if (trimmed) {
      router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn("relative w-full", className)}>
      {iconPosition === "left" && (
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
      )}
      <Input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={animatedPlaceholder ? " " : "Search products…"}
        className={cn(
          "rounded-full border border-border/80 bg-white text-dark-gray shadow-sm placeholder:text-transparent focus-visible:border-primary/40 focus-visible:ring-2 focus-visible:ring-primary/20",
          iconPosition === "left" ? "pl-12 pr-4" : "pl-5 pr-12",
          size === "lg" ? "h-12 text-base" : "h-11 text-sm",
        )}
      />
      {showAnimatedPlaceholder && (
        <RotatingSearchPlaceholder visible />
      )}
      {iconPosition === "right" && (
        <button
          type="submit"
          aria-label="Search"
          className="absolute right-1.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-primary text-white transition-colors hover:bg-primary-dark"
        >
          <Search className="h-4 w-4" />
        </button>
      )}
    </form>
  );
}

export function HeaderSearchBar({ className }: { className?: string }) {
  return (
    <SearchBar
      className={cn("hidden min-w-0 flex-1 md:block lg:max-w-2xl xl:max-w-3xl", className)}
      iconPosition="right"
      animatedPlaceholder
    />
  );
}
