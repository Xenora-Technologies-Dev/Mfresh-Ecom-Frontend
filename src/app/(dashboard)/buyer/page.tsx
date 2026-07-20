"use client";

import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { ShoppingBag, ClipboardList, ArrowRight, Package } from "lucide-react";
import { useStorefrontUser } from "@/hooks/use-storefront-user";
import { listOrders } from "@/lib/api/orders";
import { Button } from "@/components/ui/button";

function formatDate(value: string): string {
  try {
    return new Date(value).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return value;
  }
}

const STATUS_STYLES: Record<string, string> = {
  PLACED: "bg-sky-50 text-sky-700",
  UNDER_VERIFICATION: "bg-amber-50 text-amber-700",
  VERIFIED: "bg-emerald-50 text-emerald-700",
  REJECTED: "bg-red-50 text-red-700",
  COMPLETED: "bg-primary/10 text-primary",
  CANCELLED: "bg-gray-100 text-gray-600",
};

export default function BuyerDashboardPage() {
  const { userId } = useAuth();
  const { user } = useStorefrontUser();

  const { data, isLoading } = useQuery({
    queryKey: ["buyer-orders", userId],
    queryFn: () =>
      listOrders({ clerkUserId: userId ?? "", kind: "BUYER_ORDER", limit: 50 }),
    enabled: Boolean(userId),
  });

  const orders = data?.data ?? [];
  const activeOrders = orders.filter(
    (o) => o.status === "PLACED" || o.status === "UNDER_VERIFICATION" || o.status === "VERIFIED",
  );

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/5 via-white to-white p-8 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-primary">Buyer Dashboard</p>
            <h2 className="mt-1 text-2xl font-bold text-dark-gray">
              Welcome back, {user?.name ?? "Buyer"}
            </h2>
            <p className="mt-2 max-w-xl text-muted">
              Source premium food ingredients at wholesale prices and track your orders here.
            </p>
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <ShoppingBag className="h-7 w-7" />
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted">Active Orders</p>
              <p className="mt-1 text-3xl font-bold text-dark-gray">
                {isLoading ? "…" : activeOrders.length}
              </p>
            </div>
            <div className="rounded-xl bg-primary/10 p-3 text-primary">
              <ClipboardList className="h-5 w-5" />
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted">Total Orders</p>
              <p className="mt-1 text-3xl font-bold text-dark-gray">
                {isLoading ? "…" : orders.length}
              </p>
            </div>
            <div className="rounded-xl bg-secondary/10 p-3 text-secondary">
              <Package className="h-5 w-5" />
            </div>
          </div>
        </div>
        <Link
          href="/products"
          className="group flex flex-col justify-between rounded-xl border border-border bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
        >
          <p className="text-sm font-semibold text-dark-gray group-hover:text-primary">
            Browse Products
          </p>
          <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary">
            Explore catalog <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </Link>
      </div>

      <div id="orders">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-dark-gray">My Orders</h3>
          <Button size="sm" asChild>
            <Link href="/products">
              Browse Products
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
          {isLoading ? (
            <div className="p-8 text-center text-sm text-muted">Loading orders…</div>
          ) : orders.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted">
              You haven&apos;t placed any orders yet.
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-light-gray/40 text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th className="px-4 py-3">Order #</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Items</th>
                  <th className="px-4 py-3">Placed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-primary/5">
                    <td className="px-4 py-3 font-medium text-dark-gray">{order.orderNumber}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                          STATUS_STYLES[order.status] ?? "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {order.status.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted">{order.items?.length ?? 0}</td>
                    <td className="px-4 py-3 text-muted">{formatDate(order.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
