"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Store, Package, ClipboardList, Plus } from "lucide-react";
import { useStorefrontUser } from "@/hooks/use-storefront-user";
import { listOrders } from "@/lib/api/orders";
import { SellProductModal } from "@/components/dashboard/sell-product-modal";
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

export default function SellerDashboardPage() {
  const { userId } = useAuth();
  const { user } = useStorefrontUser();
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["seller-listings", userId],
    queryFn: () =>
      listOrders({ clerkUserId: userId ?? "", kind: "SELLER_LISTING", limit: 50 }),
    enabled: Boolean(userId),
  });

  const listings = data?.data ?? [];
  const pending = listings.filter((l) => l.status === "UNDER_VERIFICATION");
  const verified = listings.filter((l) => l.status === "VERIFIED");

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-border bg-gradient-to-br from-secondary/5 via-white to-white p-8 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-secondary">Seller Dashboard</p>
            <h2 className="mt-1 text-2xl font-bold text-dark-gray">
              Welcome, {user?.name ?? "Seller"}
            </h2>
            <p className="mt-2 max-w-xl text-muted">
              Manage your product listings and track their verification status.
            </p>
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary/10 text-secondary">
            <Store className="h-7 w-7" />
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted">Listed Products</p>
              <p className="mt-1 text-3xl font-bold text-dark-gray">
                {isLoading ? "…" : listings.length}
              </p>
            </div>
            <div className="rounded-xl bg-secondary/10 p-3 text-secondary">
              <Package className="h-5 w-5" />
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted">Pending Verification</p>
              <p className="mt-1 text-3xl font-bold text-dark-gray">
                {isLoading ? "…" : pending.length}
              </p>
            </div>
            <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
              <ClipboardList className="h-5 w-5" />
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted">Verified</p>
              <p className="mt-1 text-3xl font-bold text-dark-gray">
                {isLoading ? "…" : verified.length}
              </p>
            </div>
            <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
              <Store className="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>

      <div id="orders">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-dark-gray">My Orders</h3>
          <Button size="sm" onClick={() => setModalOpen(true)}>
            <Plus className="h-4 w-4" />
            Sell
          </Button>
        </div>

        <div className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
          {isLoading ? (
            <div className="p-8 text-center text-sm text-muted">Loading listings…</div>
          ) : listings.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted">
              You haven&apos;t listed any products yet. Click &ldquo;Sell&rdquo; to get started.
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-light-gray/40 text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th className="px-4 py-3">Order #</th>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Listed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {listings.map((listing) => (
                  <tr key={listing.id} className="hover:bg-secondary/5">
                    <td className="px-4 py-3 font-medium text-dark-gray">
                      {listing.orderNumber}
                    </td>
                    <td className="px-4 py-3 text-muted">{listing.productName}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                          STATUS_STYLES[listing.status] ?? "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {listing.status.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted">{formatDate(listing.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {user && userId && (
        <SellProductModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          user={user}
          clerkUserId={userId}
          onCreated={() =>
            queryClient.invalidateQueries({ queryKey: ["seller-listings", userId] })
          }
        />
      )}
    </div>
  );
}
