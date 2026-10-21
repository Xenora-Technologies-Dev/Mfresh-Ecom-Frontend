"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PriceDisplay } from "@/components/shared/price-display";
import { PLACEHOLDER_IMAGE } from "@/lib/api/client";
import { createBuyerOrder } from "@/lib/api/orders";
import { useStorefrontUser } from "@/hooks/use-storefront-user";
import { useCartStore } from "@/store/cart-store";

export function CartDrawer() {
  const { userId } = useAuth();
  const { user } = useStorefrontUser();
  const drawerOpen = useCartStore((s) => s.drawerOpen);
  const closeDrawer = useCartStore((s) => s.closeDrawer);
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const clear = useCartStore((s) => s.clear);
  const setLastOrderNumber = useCartStore((s) => s.setLastOrderNumber);
  const lastOrderNumber = useCartStore((s) => s.lastOrderNumber);

  const [submitting, setSubmitting] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleOrder = async () => {
    if (!items.length) {
      toast.error("Your cart is empty.");
      return;
    }
    if (!userId || !user) {
      toast.error("Please sign in and complete your profile to send an enquiry.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await createBuyerOrder({
        clerkUserId: userId,
        userName: user.name,
        userEmail: user.email,
        userPhone: user.whatsapp,
        userCompany: user.company,
        userCountry: user.country,
        items: items.map((item) => ({
          productId: item.productId,
          productName: item.name,
          productSlug: item.slug,
          productImage: item.image,
          quantity: item.quantity,
          price: item.price,
          currency: item.currency,
          moqUnit: item.moqUnit,
        })),
      });
      setLastOrderNumber(res.orderNumber);
      clear();
      closeDrawer();
      setSuccessOpen(true);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not send enquiry. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {drawerOpen && (
          <div className="fixed inset-0 z-[130]">
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
              aria-label="Close cart"
              onClick={closeDrawer}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3, ease: "easeOut" }}
              role="dialog"
              aria-modal
              aria-labelledby="cart-drawer-title"
              className="absolute inset-y-0 left-0 flex w-full max-w-sm flex-col bg-white shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-border px-5 py-4">
                <h2
                  id="cart-drawer-title"
                  className="flex items-center gap-2 text-lg font-bold text-dark-gray"
                >
                  <ShoppingBag className="h-5 w-5 text-primary" />
                  Enquiry cart
                </h2>
                <button
                  type="button"
                  onClick={closeDrawer}
                  className="rounded-full p-1.5 text-muted hover:bg-light-gray"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-5 py-4">
                {items.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-muted">
                    <ShoppingBag className="h-10 w-10 text-border" />
                    <p className="text-sm">Your cart is empty.</p>
                  </div>
                ) : (
                  <ul className="space-y-3">
                    {items.map((item) => (
                      <li
                        key={item.productId}
                        className="flex gap-3 rounded-xl border border-border p-3"
                      >
                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-light-gray">
                          <Image
                            src={item.image || PLACEHOLDER_IMAGE}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        </div>
                        <div className="flex min-w-0 flex-1 flex-col justify-between gap-1.5">
                          <div>
                            <p className="line-clamp-1 text-sm font-semibold text-dark-gray">
                              {item.name}
                            </p>
                            <p className="text-xs text-muted">
                              <PriceDisplay price={item.price} storedCurrency={item.currency} />{" "}
                              / {item.moqUnit}
                            </p>
                          </div>
                          <div className="flex items-center justify-between gap-2">
                            <div className="inline-flex items-center rounded-lg border border-border">
                              <button
                                type="button"
                                aria-label="Decrease quantity"
                                className="flex h-7 w-7 items-center justify-center text-dark-gray hover:bg-light-gray disabled:opacity-40"
                                disabled={item.quantity <= 1}
                                onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                              >
                                <Minus className="h-3.5 w-3.5" />
                              </button>
                              <span className="min-w-[2rem] text-center text-xs font-semibold tabular-nums">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                aria-label="Increase quantity"
                                className="flex h-7 w-7 items-center justify-center text-dark-gray hover:bg-light-gray"
                                onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                              >
                                <Plus className="h-3.5 w-3.5" />
                              </button>
                            </div>
                            <button
                              type="button"
                              aria-label="Remove item"
                              className="flex h-7 w-7 items-center justify-center rounded-lg text-muted transition-colors hover:bg-red-50 hover:text-red-500"
                              onClick={() => removeItem(item.productId)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {items.length > 0 && (
                <div className="border-t border-border px-5 py-4">
                  <div className="mb-3 flex items-center justify-between text-sm">
                    <span className="font-medium text-muted">Indicative total</span>
                    <span className="text-base font-bold text-dark-gray">
                      <PriceDisplay price={total} storedCurrency={items[0]?.currency ?? "USD"} />
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={closeDrawer}
                      disabled={submitting}
                    >
                      Cancel
                    </Button>
                    <Button className="flex-1" onClick={handleOrder} disabled={submitting}>
                      {submitting ? "Sending enquiry…" : "Send enquiry"}
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {successOpen && (
        <div className="fixed inset-0 z-[145] flex items-center justify-center p-4">
          <button
            type="button"
            className="absolute inset-0 bg-black/50"
            aria-label="Close"
            onClick={() => setSuccessOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            role="dialog"
            aria-modal
            aria-labelledby="order-success-title"
            className="relative z-10 w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-2xl"
          >
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary-muted text-primary">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h2 id="order-success-title" className="text-lg font-bold text-dark-gray">
              Enquiry submitted
            </h2>
            <p className="mt-2 text-sm text-muted">
              Our team will review your request and contact you shortly. No payment is taken online.
            </p>
            {lastOrderNumber && (
              <p className="mt-2 text-sm text-muted">
                Enquiry number:{" "}
                <span className="font-semibold text-dark-gray">{lastOrderNumber}</span>
              </p>
            )}
            <Button className="mt-5 w-full" onClick={() => setSuccessOpen(false)}>
              Continue browsing
            </Button>
          </motion.div>
        </div>
      )}
    </>
  );
}
