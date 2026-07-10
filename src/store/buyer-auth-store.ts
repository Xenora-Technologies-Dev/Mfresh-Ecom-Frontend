"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Lightweight buyer session on the storefront.
 * Portal login will set this in a future release; for now Add to Cart
 * treats missing session as logged out and prompts buyer portal login.
 */
interface BuyerAuthState {
  buyerId: string | null;
  buyerName: string | null;
  buyerEmail: string | null;
  isLoggedIn: () => boolean;
  setSession: (session: {
    buyerId: string;
    buyerName?: string;
    buyerEmail?: string;
  }) => void;
  clearSession: () => void;
}

export const useBuyerAuthStore = create<BuyerAuthState>()(
  persist(
    (set, get) => ({
      buyerId: null,
      buyerName: null,
      buyerEmail: null,
      isLoggedIn: () => Boolean(get().buyerId),
      setSession: ({ buyerId, buyerName, buyerEmail }) =>
        set({
          buyerId,
          buyerName: buyerName ?? null,
          buyerEmail: buyerEmail ?? null,
        }),
      clearSession: () =>
        set({ buyerId: null, buyerName: null, buyerEmail: null }),
    }),
    { name: "mfresh-buyer-auth" },
  ),
);
