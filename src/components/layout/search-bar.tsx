"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  className?: string;
  placeholder?: string;
  size?: "default" | "lg";
  defaultValue?: string;
  onSearch?: (query: string) => void;
}

export function SearchBar({
  className,
  placeholder = "Search products, categories, suppliers...",
  size = "default",
  defaultValue = "",
  onSearch,
}: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState(defaultValue);

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
      <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
      <Input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "pl-12 pr-4 rounded-2xl border-gray-200/80 bg-white/90 shadow-sm",
          size === "lg" && "h-14 text-base",
        )}
      />
    </form>
  );
}

export function HeaderSearchBar({ className }: { className?: string }) {
  return (
    <SearchBar
      className={cn("hidden lg:block max-w-md", className)}
      placeholder="Search marketplace..."
    />
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2 shrink-0", className)}>
      <Image
        src="/logo.png"
        alt="MFresh"
        width={150}
        height={56}
        className="h-11 w-auto object-contain sm:h-12"
        priority
      />
    </Link>
  );
}
