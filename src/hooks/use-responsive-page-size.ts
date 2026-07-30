"use client";

import { useEffect, useState } from "react";

export type BreakpointColumns = {
  base: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
  "2xl"?: number;
};

const QUERIES: { key: keyof BreakpointColumns; mq: string }[] = [
  { key: "2xl", mq: "(min-width: 1536px)" },
  { key: "xl", mq: "(min-width: 1280px)" },
  { key: "lg", mq: "(min-width: 1024px)" },
  { key: "md", mq: "(min-width: 768px)" },
  { key: "sm", mq: "(min-width: 640px)" },
];

/** Columns active at the current viewport for a Tailwind-aligned map. */
export function resolveBreakpointColumns(columns: BreakpointColumns): number {
  if (typeof window === "undefined") return columns.base;
  for (const { key, mq } of QUERIES) {
    const value = columns[key];
    if (value != null && window.matchMedia(mq).matches) return value;
  }
  return columns.base;
}

/**
 * Page size that always fills complete rows: columns-at-breakpoint × rows.
 * Prevents half-empty last rows in carousels/grids.
 */
export function useResponsivePageSize(
  columns: BreakpointColumns,
  rows: number,
): number {
  const { base, sm, md, lg, xl } = columns;
  const xl2 = columns["2xl"];
  const [pageSize, setPageSize] = useState(() => base * rows);

  useEffect(() => {
    const map: BreakpointColumns = { base, sm, md, lg, xl, "2xl": xl2 };
    const sync = () => {
      setPageSize(resolveBreakpointColumns(map) * rows);
    };
    sync();

    const mqls = QUERIES.map(({ mq }) => window.matchMedia(mq));
    mqls.forEach((mql) => mql.addEventListener("change", sync));
    return () => mqls.forEach((mql) => mql.removeEventListener("change", sync));
  }, [base, sm, md, lg, xl, xl2, rows]);

  return Math.max(1, pageSize);
}
