"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

const SEARCH_TERMS = [
  "Seafood",
  "Meat",
  "Fruits",
  "Vegetables",
  "Poultry",
  "Dairy",
  "Grains",
] as const;

interface RotatingSearchPlaceholderProps {
  visible: boolean;
  className?: string;
}

export function RotatingSearchPlaceholder({
  visible,
  className,
}: RotatingSearchPlaceholderProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!visible) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % SEARCH_TERMS.length);
    }, 2500);
    return () => clearInterval(timer);
  }, [visible]);

  if (!visible) return null;

  return (
    <span
      className={cn(
        "pointer-events-none absolute left-5 top-1/2 flex -translate-y-1/2 items-center text-sm text-muted/80",
        className,
      )}
      aria-hidden
    >
      <span>Search&nbsp;</span>
      <span className="relative inline-block h-5 min-w-[5.75rem] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.span
            key={SEARCH_TERMS[index]}
            initial={{ y: 14, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -14, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-0 top-0 font-medium text-primary/70"
          >
            {SEARCH_TERMS[index]}
          </motion.span>
        </AnimatePresence>
      </span>
    </span>
  );
}
