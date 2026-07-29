"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { PackageSearch, Truck, X, ArrowRight } from "lucide-react";
import { DEFAULT_LOGO_PATH } from "@/lib/theme";
import { cn } from "@/lib/utils";

/**
 * In-memory only — survives client navigations within this tab load,
 * clears on refresh / new visit so the popup can show again.
 */
let shownThisPageLoad = false;

type Role = "buyer" | "seller";

const ROLE_COPY: Record<
  Role,
  {
    label: string;
    tagline: string;
    description: string;
    cta: string;
    Icon: typeof PackageSearch;
  }
> = {
  buyer: {
    label: "Buyer",
    tagline: "I need wholesale supply",
    description:
      "Source quality food for your restaurants, retail, or distribution network.",
    cta: "Continue as buyer",
    Icon: PackageSearch,
  },
  seller: {
    label: "Seller",
    tagline: "I offer products to trade",
    description:
      "Reach buyers worldwide with verified listings and reliable fulfilment.",
    cta: "Continue as seller",
    Icon: Truck,
  },
};

export function GetStartedModal() {
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState<Role>("buyer");

  useEffect(() => {
    if (shownThisPageLoad) return;
    const t = setTimeout(() => {
      shownThisPageLoad = true;
      setOpen(true);
    }, 600);
    return () => clearTimeout(t);
  }, []);

  const dismiss = () => setOpen(false);
  const copy = ROLE_COPY[role];
  const Icon = copy.Icon;

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[140] flex items-end justify-center p-0 sm:items-center sm:p-5 md:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="get-started-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        aria-label="Close welcome"
        onClick={dismiss}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 320, damping: 28 }}
        className="relative z-10 w-full max-w-md overflow-hidden rounded-t-3xl bg-white shadow-2xl shadow-black/25 sm:rounded-3xl"
      >
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-primary/10 via-secondary/5 to-transparent"
          aria-hidden
        />

        <button
          type="button"
          onClick={dismiss}
          className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-muted shadow-sm ring-1 ring-border transition hover:bg-light-gray hover:text-dark-gray sm:h-9 sm:w-9"
          aria-label="Close"
        >
          <X className="h-5 w-5" strokeWidth={2} />
        </button>

        <div className="relative px-5 pb-6 pt-7 sm:px-7 sm:pb-8 sm:pt-8">
          <div className="mx-auto mb-4 flex justify-center">
            <span className="relative h-8 w-[116px] sm:h-9 sm:w-[132px]">
              <Image
                src={DEFAULT_LOGO_PATH}
                alt="M Fresh Trade Hub"
                fill
                className="object-contain"
                unoptimized
                priority
              />
            </span>
          </div>

          <h2
            id="get-started-title"
            className="text-center text-xl font-bold tracking-tight text-dark-gray sm:text-2xl"
          >
            <span className="block">Welcome to</span>
            <span className="mt-1 flex items-center justify-center gap-0 overflow-hidden text-primary">
              <motion.span
                initial={{ opacity: 0, x: -28 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ type: "spring", stiffness: 280, damping: 24, delay: 0.08 }}
                className="inline-block"
              >
                MFresh
              </motion.span>
              <motion.span
                initial={{ opacity: 0, x: 28 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ type: "spring", stiffness: 280, damping: 24, delay: 0.14 }}
                className="inline-block"
              >
                TradeHub.com
              </motion.span>
            </span>
          </h2>
          <p className="mt-2 text-center text-sm text-muted">
            How would you like to get started?
          </p>

          {/* Segmented role picker */}
          <div
            className="mt-6 grid grid-cols-2 gap-1 rounded-2xl bg-light-gray p-1"
            role="tablist"
            aria-label="Choose role"
          >
            {(["buyer", "seller"] as const).map((option) => {
              const active = role === option;
              const OptionIcon = ROLE_COPY[option].Icon;
              return (
                <button
                  key={option}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setRole(option)}
                  className={cn(
                    "relative flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold transition-colors",
                    active
                      ? option === "buyer"
                        ? "bg-secondary text-white shadow-sm"
                        : "bg-primary text-white shadow-sm"
                      : "text-muted hover:text-dark-gray",
                  )}
                >
                  <OptionIcon className="h-4 w-4 shrink-0" strokeWidth={2} />
                  {ROLE_COPY[option].label}
                </button>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={role}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="mt-5"
            >
              <div
                className={cn(
                  "rounded-2xl px-4 py-4 sm:px-5 sm:py-5",
                  role === "buyer" ? "bg-secondary-muted/80" : "bg-primary-muted",
                )}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={cn(
                      "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
                      role === "buyer"
                        ? "bg-secondary/15 text-secondary"
                        : "bg-primary/15 text-primary",
                    )}
                  >
                    <Icon className="h-5 w-5" strokeWidth={2} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p
                      className={cn(
                        "text-base font-bold",
                        role === "buyer" ? "text-secondary" : "text-primary",
                      )}
                    >
                      {copy.label}
                    </p>
                    <p className="mt-0.5 text-sm text-muted">{copy.tagline}</p>
                    <p className="mt-2 text-sm leading-relaxed text-dark-gray/80">
                      {copy.description}
                    </p>
                  </div>
                </div>
              </div>

              <Link
                href={`/sign-up?role=${role}`}
                onClick={dismiss}
                className={cn(
                  "mt-4 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold text-white transition",
                  role === "buyer"
                    ? "bg-secondary hover:bg-secondary-dark"
                    : "bg-primary hover:bg-primary-dark",
                )}
              >
                {copy.cta}
                <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
              </Link>
            </motion.div>
          </AnimatePresence>

          <button
            type="button"
            onClick={dismiss}
            className="mt-3 w-full py-2 text-center text-sm text-muted transition hover:text-dark-gray"
          >
            Browse as guest
          </button>
        </div>
      </motion.div>
    </div>
  );
}
