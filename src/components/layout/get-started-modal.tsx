"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { PackageSearch, Truck, X } from "lucide-react";
import { PORTAL_URL } from "@/lib/constants";
import { DEFAULT_LOGO_PATH } from "@/lib/theme";

/**
 * In-memory only — survives client navigations within this tab load,
 * clears on refresh / new visit so the popup can show again.
 */
let shownThisPageLoad = false;

const TITLE_CHARS = Array.from("Welcome to MFresh.ae");

export function GetStartedModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (shownThisPageLoad) return;
    const t = setTimeout(() => {
      shownThisPageLoad = true;
      setOpen(true);
    }, 600);
    return () => clearTimeout(t);
  }, []);

  const dismiss = () => setOpen(false);

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
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 26 }}
        className="relative z-10 flex max-h-[min(92dvh,720px)] w-full max-w-2xl flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl shadow-black/25 sm:rounded-2xl"
      >
        <button
          type="button"
          onClick={dismiss}
          className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-muted shadow-sm ring-1 ring-border transition hover:bg-light-gray hover:text-dark-gray sm:h-9 sm:w-9 sm:bg-transparent sm:shadow-none sm:ring-0"
          aria-label="Close"
        >
          <X className="h-5 w-5" strokeWidth={2} />
        </button>

        <div className="overflow-y-auto overscroll-contain px-4 pb-5 pt-6 sm:px-8 sm:pb-8 sm:pt-8">
          <div className="mx-auto mb-4 flex justify-center sm:mb-5">
            <span className="relative h-8 w-[116px] sm:h-10 sm:w-[148px]">
              <Image
                src={DEFAULT_LOGO_PATH}
                alt="M Fresh"
                fill
                className="object-contain"
                unoptimized
                priority
              />
            </span>
          </div>

          <h2
            id="get-started-title"
            className="text-center text-lg font-bold tracking-tight text-dark-gray xs:text-xl sm:text-2xl"
            aria-label="Welcome to MFresh.ae"
          >
            <span className="inline">
              {TITLE_CHARS.map((ch, i) => {
                const brandStart = "Welcome to ".length;
                const isBrand = i >= brandStart;
                return (
                  <motion.span
                    key={`${ch}-${i}`}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.12 + i * 0.045,
                      duration: 0.28,
                      ease: "easeOut",
                    }}
                    className={
                      isBrand ? "inline text-primary" : "inline"
                    }
                  >
                    {ch === " " ? "\u00A0" : ch}
                  </motion.span>
                );
              })}
            </span>
          </h2>

          <div className="mt-5 grid items-stretch gap-3 sm:mt-7 sm:grid-cols-2 sm:gap-5">
            <a
              href={`${PORTAL_URL}?role=buyer`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={dismiss}
              className="group flex h-full min-h-0 flex-col rounded-xl bg-secondary-muted/90 px-4 py-4 text-center transition hover:-translate-y-0.5 hover:shadow-md sm:min-h-[280px] sm:px-5 sm:py-6 sm:text-left"
            >
              <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-secondary/15 text-secondary sm:mx-0 sm:h-12 sm:w-12">
                <PackageSearch className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2} />
              </span>
              <span className="mt-3 text-base font-bold text-secondary sm:mt-4 sm:text-lg">
                Buyer
              </span>
              <span className="mt-0.5 text-xs text-muted sm:mt-1 sm:text-sm">
                I need wholesale supply
              </span>
              <p className="mt-2 hidden flex-1 text-sm leading-relaxed text-dark-gray/80 sm:mt-3 sm:block">
                Source quality food for your restaurants, retail, or distribution
                network.
              </p>
              <span className="mt-3 inline-flex h-10 w-full items-center justify-center rounded-lg bg-secondary text-sm font-semibold text-white transition group-hover:bg-secondary-dark sm:mt-auto sm:h-11">
                I am a buyer
              </span>
            </a>

            <a
              href={`${PORTAL_URL}?role=seller`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={dismiss}
              className="group flex h-full min-h-0 flex-col rounded-xl bg-primary-muted px-4 py-4 text-center transition hover:-translate-y-0.5 hover:shadow-md sm:min-h-[280px] sm:px-5 sm:py-6 sm:text-left"
            >
              <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-primary/15 text-primary sm:mx-0 sm:h-12 sm:w-12">
                <Truck className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2} />
              </span>
              <span className="mt-3 text-base font-bold text-primary sm:mt-4 sm:text-lg">
                Seller
              </span>
              <span className="mt-0.5 text-xs text-muted sm:mt-1 sm:text-sm">
                I offer products to trade
              </span>
              <p className="mt-2 hidden flex-1 text-sm leading-relaxed text-dark-gray/80 sm:mt-3 sm:block">
                Reach buyers worldwide with verified listings and reliable
                fulfilment.
              </p>
              <span className="mt-3 inline-flex h-10 w-full items-center justify-center rounded-lg bg-primary text-sm font-semibold text-white transition group-hover:bg-primary-dark sm:mt-auto sm:h-11">
                I am a seller
              </span>
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
