"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, LogIn, Menu, X } from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HeaderSearchBar, Logo, SearchBar } from "@/components/layout/search-bar";
import { LocationSelector } from "@/components/layout/location-selector";
import { CurrencySwitcher } from "@/components/shared/currency-switcher";
import { CategoriesNavDropdown } from "@/components/layout/categories-nav-dropdown";
import { NAV_LINKS, PORTAL_URL } from "@/lib/constants";
import { useFavoritesStore } from "@/store/favorites-store";
import { cn } from "@/lib/utils";

function HeaderLocationSelector() {
  return (
    <Suspense fallback={null}>
      <LocationSelector />
    </Suspense>
  );
}

function portalLoginUrl() {
  return PORTAL_URL;
}

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const favoritesCount = useFavoritesStore((s) => s.favorites.length);
  const hideHeaderSearch = pathname === "/products";

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-[100] w-full border-b border-border bg-white shadow-sm">
      <div className="container-main">
        <div className="flex h-[72px] items-center gap-3 lg:gap-4">
          <Logo className="mr-1" />

          {!hideHeaderSearch && <HeaderSearchBar />}

          <div
            className={cn(
              "hidden items-center gap-2 md:flex lg:gap-2.5",
              hideHeaderSearch && "ml-auto",
            )}
          >
            <HeaderLocationSelector />
            <CurrencySwitcher />

            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary-muted text-secondary transition-colors hover:bg-secondary/15"
            >
              <Heart className="h-5 w-5" />
              {favoritesCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-secondary text-[9px] font-bold text-white">
                  {favoritesCount > 9 ? "9+" : favoritesCount}
                </span>
              )}
            </Link>

            <div className="ml-1 hidden h-8 w-px bg-border lg:block" />

            <Link
              href={portalLoginUrl()}
              className="inline-flex h-10 shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg bg-secondary px-4 text-sm font-semibold text-white transition-colors hover:bg-secondary-dark lg:px-5"
            >
              <LogIn className="h-4 w-4 shrink-0" />
              Log In
            </Link>

            <Link
              href="/become-buyer"
              className="hidden h-10 shrink-0 items-center justify-center whitespace-nowrap rounded-lg border border-primary/30 px-3.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/5 lg:inline-flex xl:px-4 xl:text-sm"
            >
              Register as Buyer
            </Link>

            <Link
              href="/become-seller"
              className="hidden h-10 shrink-0 items-center justify-center whitespace-nowrap rounded-lg border border-secondary/30 px-3.5 text-xs font-semibold text-secondary transition-colors hover:bg-secondary/5 lg:inline-flex xl:px-4 xl:text-sm"
            >
              Register as Seller
            </Link>
          </div>

          <button
            type="button"
            className="ml-auto inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <div className="hidden border-t border-border bg-white md:block">
        <div className="container-main">
          <nav className="flex h-11 items-center gap-8">
            <CategoriesNavDropdown />
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors",
                  pathname === link.href
                    ? "text-primary"
                    : "text-dark-gray hover:text-primary",
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="ml-auto flex items-center gap-2 lg:hidden">
              <Link
                href="/become-buyer"
                className="text-xs font-semibold text-primary hover:underline"
              >
                Register as Buyer
              </Link>
              <span className="text-border">|</span>
              <Link
                href="/become-seller"
                className="text-xs font-semibold text-secondary hover:underline"
              >
                Register as Seller
              </Link>
            </div>
          </nav>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-border bg-white md:hidden"
          >
            <div className="container-main space-y-4 py-4">
              {!hideHeaderSearch && <SearchBar />}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <HeaderLocationSelector />
                  <CurrencySwitcher compact />
                </div>
                <Link
                  href="/wishlist"
                  aria-label="Wishlist"
                  className="relative flex h-10 w-10 items-center justify-center rounded-full bg-secondary-muted text-secondary"
                >
                  <Heart className="h-5 w-5" />
                  {favoritesCount > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-secondary text-[9px] font-bold text-white">
                      {favoritesCount > 9 ? "9+" : favoritesCount}
                    </span>
                  )}
                </Link>
              </div>
              <div className="flex flex-col gap-2">
                <Link
                  href={portalLoginUrl()}
                  className="inline-flex h-11 items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-secondary text-sm font-semibold text-white"
                >
                  <LogIn className="h-4 w-4" />
                  Log In
                </Link>
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/become-buyer"
                    className="inline-flex h-10 items-center justify-center whitespace-nowrap rounded-lg border border-primary/25 bg-primary/5 text-xs font-semibold text-primary"
                  >
                    Register as Buyer
                  </Link>
                  <Link
                    href="/become-seller"
                    className="inline-flex h-10 items-center justify-center whitespace-nowrap rounded-lg border border-secondary/25 bg-secondary/5 text-xs font-semibold text-secondary"
                  >
                    Register as Seller
                  </Link>
                </div>
              </div>
              <nav className="flex flex-col gap-1 border-t border-border pt-3">
                <Link
                  href="/categories"
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-dark-gray hover:bg-light-gray"
                >
                  All Categories
                </Link>
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "rounded-lg px-3 py-2.5 text-sm font-medium",
                      pathname === link.href
                        ? "bg-primary-muted text-primary"
                        : "text-dark-gray hover:bg-light-gray",
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
