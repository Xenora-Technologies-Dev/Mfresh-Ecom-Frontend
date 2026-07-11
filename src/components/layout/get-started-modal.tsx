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
      className="fixed inset-0 z-[140] flex items-center justify-center p-4 sm:p-6"
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
        initial={{ opacity: 0, y: 14, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 26 }}
        className="relative z-10 w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl shadow-black/25"
      >
        <button
          type="button"
          onClick={dismiss}
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full text-muted transition hover:bg-light-gray hover:text-dark-gray"
          aria-label="Close"
        >
          <X className="h-5 w-5" strokeWidth={2} />
        </button>

        <div className="px-5 pb-6 pt-7 sm:px-8 sm:pb-8 sm:pt-8">
          <div className="mx-auto mb-5 flex justify-center">
            <span className="relative h-9 w-[130px] sm:h-10 sm:w-[148px]">
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
            className="flex flex-wrap justify-center text-center text-xl font-bold tracking-tight text-dark-gray sm:text-2xl"
            aria-label="Welcome to MFresh.ae"
          >
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
                    isBrand
                      ? "text-primary inline-block"
                      : "inline-block"
                  }
                >
                  {ch === " " ? "\u00A0" : ch}
                </motion.span>
              );
            })}
          </h2>

          <div className="mt-6 grid items-stretch gap-4 sm:mt-7 sm:grid-cols-2 sm:gap-5">
            <a
              href={`${PORTAL_URL}?role=buyer`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={dismiss}
              className="group flex h-full min-h-[280px] flex-col rounded-xl bg-secondary-muted/90 px-5 py-6 text-center transition hover:-translate-y-0.5 hover:shadow-md sm:min-h-[300px] sm:text-left"
            >
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-secondary/15 text-secondary sm:mx-0">
                <PackageSearch className="h-6 w-6" strokeWidth={2} />
              </span>
              <span className="mt-4 text-lg font-bold text-secondary">Buyer</span>
              <span className="mt-1 text-sm text-muted">
                I need wholesale supply
              </span>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-dark-gray/80">
                Source quality food for your restaurants, retail, or distribution
                network.
              </p>
              <span className="mt-auto inline-flex h-11 w-full items-center justify-center rounded-lg bg-secondary text-sm font-semibold text-white transition group-hover:bg-secondary-dark">
                I am a buyer
              </span>
            </a>

            <a
              href={`${PORTAL_URL}?role=seller`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={dismiss}
              className="group flex h-full min-h-[280px] flex-col rounded-xl bg-primary-muted px-5 py-6 text-center transition hover:-translate-y-0.5 hover:shadow-md sm:min-h-[300px] sm:text-left"
            >
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 text-primary sm:mx-0">
                <Truck className="h-6 w-6" strokeWidth={2} />
              </span>
              <span className="mt-4 text-lg font-bold text-primary">Seller</span>
              <span className="mt-1 text-sm text-muted">
                I offer products to trade
              </span>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-dark-gray/80">
                Reach buyers worldwide with verified listings and reliable
                fulfilment.
              </p>
              <span className="mt-auto inline-flex h-11 w-full items-center justify-center rounded-lg bg-primary text-sm font-semibold text-white transition group-hover:bg-primary-dark">
                I am a seller
              </span>
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
