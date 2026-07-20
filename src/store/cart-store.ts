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
  image?: string;
};

interface CartState {
  items: CartItem[];
  drawerOpen: boolean;
  lastOrderNumber: string | null;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  setLastOrderNumber: (orderNumber: string | null) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      drawerOpen: false,
      lastOrderNumber: null,
      addItem: (item) => {
        const existing = get().items.find((i) => i.productId === item.productId);
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.productId === item.productId
                ? { ...i, quantity: item.quantity, image: item.image ?? i.image }
                : i,
            ),
          });
          return;
        }
        set({ items: [...get().items, item] });
      },
      removeItem: (productId) =>
        set({ items: get().items.filter((i) => i.productId !== productId) }),
      updateQuantity: (productId, quantity) =>
        set({
          items: get().items.map((i) =>
            i.productId === productId
              ? { ...i, quantity: Math.max(1, quantity) }
              : i,
          ),
        }),
      clear: () => set({ items: [] }),
      openDrawer: () => set({ drawerOpen: true }),
      closeDrawer: () => set({ drawerOpen: false }),
      setLastOrderNumber: (orderNumber) => set({ lastOrderNumber: orderNumber }),
    }),
    {
      name: "mfresh-cart",
      partialize: (state) => ({ items: state.items }),
    },
  ),
);
