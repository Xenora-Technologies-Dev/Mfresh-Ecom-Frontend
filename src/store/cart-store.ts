"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  quantity: number;
  moqUnit: string;
  price: number;
  currency: string;
};

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  clear: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const existing = get().items.find((i) => i.productId === item.productId);
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.productId === item.productId
                ? { ...i, quantity: item.quantity }
                : i,
            ),
          });
          return;
        }
        set({ items: [...get().items, item] });
      },
      clear: () => set({ items: [] }),
    }),
    { name: "mfresh-cart" },
  ),
);
