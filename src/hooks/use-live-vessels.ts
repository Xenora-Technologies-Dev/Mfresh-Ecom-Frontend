"use client";

import { useEffect, useMemo, useState } from "react";
import {
  generateVessels,
  getTrafficWindow,
  getVesselCountForWindow,
  getMsUntilNextWindow,
} from "@/lib/live-vessel-traffic";

export function useLiveVessels() {
  const [tick, setTick] = useState(0);
  const [windowId, setWindowId] = useState(() => getTrafficWindow());

  useEffect(() => {
    const drift = setInterval(() => setTick((t) => t + 1), 8000);
    return () => clearInterval(drift);
  }, []);

  useEffect(() => {
    const check = () => {
      const current = getTrafficWindow();
      setWindowId((prev) => (prev !== current ? current : prev));
    };
    const msUntil = getMsUntilNextWindow();
    const timer = setTimeout(check, msUntil + 500);
    const interval = setInterval(check, 60_000);
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [windowId]);

  const vessels = useMemo(
    () => generateVessels(windowId, tick),
    [windowId, tick],
  );
  const count = getVesselCountForWindow(windowId);

  return { vessels, count, windowId };
}
