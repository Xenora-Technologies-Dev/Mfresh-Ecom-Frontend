"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogIn, Menu, X } from "lucide-react";
import { SiteContactBar } from "@/components/layout/site-contact";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { HeaderSearchBar, Logo, SearchBar } from "@/components/layout/search-bar";
import { CurrencySwitcher } from "@/components/shared/currency-switcher";
import { NAV_LINKS, PORTAL_URL, SITE_TAGLINE } from "@/lib/constants";
import { cn } from "@/lib/utils";

function portalLoginUrl(role?: "buyer" | "seller") {
  return role ? `${PORTAL_URL}?role=${role}` : PORTAL_URL;
}

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-all duration-300",
        scrolled
          ? "glass-header border-border shadow-sm"
          : "border-transparent bg-fresh-mint/80",
      )}
    >
      <div className="hidden border-b border-primary-muted bg-primary-muted/60 lg:block">
        <div className="container-main flex items-center justify-between py-2 text-xs text-muted">
          <SiteContactBar />
          <div className="flex items-center gap-4">
            <CurrencySwitcher compact />
            <span className="text-border">|</span>
            <span>{SITE_TAGLINE}</span>
          </div>
        </div>
      </div>

      <div className="container-main">
        <div className="flex h-16 items-center justify-between gap-4 lg:h-[72px]">
          <Logo />

          <nav className="hidden items-center gap-0.5 xl:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  pathname === link.href
                    ? "bg-primary/10 text-primary"
                    : "text-dark-gray hover:bg-light-gray hover:text-primary",
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <HeaderSearchBar />

          <div className="hidden items-center gap-2 md:flex">
            <Button variant="ghost" size="sm" asChild>
              <a href={portalLoginUrl()}>
                <LogIn className="h-4 w-4" />
                Login
              </a>
            </Button>
            <Button variant="outline" size="sm" className="border-primary/30 text-primary" asChild>
              <Link href="/become-buyer">Register as Buyer</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/become-seller">Register as Seller</Link>
            </Button>
          </div>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border lg:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-border bg-white lg:hidden overflow-hidden"
          >
            <div className="container-main space-y-4 py-4">
              <SearchBar />
              <div className="flex items-center justify-between rounded-lg border border-border bg-fresh-mint/80 px-3 py-2">
                <span className="text-xs font-medium text-muted">Currency</span>
                <CurrencySwitcher compact />
              </div>
              <nav className="flex flex-col gap-1">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "rounded-lg px-4 py-3 text-sm font-medium",
                      pathname === link.href
                        ? "bg-primary/10 text-primary"
                        : "text-dark-gray hover:bg-light-gray",
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <div className="flex flex-col gap-2 pt-2">
                <Button variant="outline" className="w-full" asChild>
                  <a href={portalLoginUrl()}>Login</a>
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" asChild>
                    <Link href="/become-buyer">Buyer</Link>
                  </Button>
                  <Button className="flex-1" asChild>
                    <Link href="/become-seller">Seller</Link>
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
