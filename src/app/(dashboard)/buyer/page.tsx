"use client";

import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { ShoppingBag, ClipboardList, ArrowRight, MessageSquare } from "lucide-react";
import { useStorefrontUser } from "@/hooks/use-storefront-user";
import { listOrders } from "@/lib/api/orders";
import { listMyLeads, type LeadRecord } from "@/lib/api/leads";
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
  NEW: "bg-sky-50 text-sky-700",
  PLACED: "bg-sky-50 text-sky-700",
  CONTACTED: "bg-amber-50 text-amber-700",
  QUOTED: "bg-violet-50 text-violet-700",
  CLOSED: "bg-gray-100 text-gray-600",
  CANCELLED: "bg-gray-100 text-gray-600",
  UNDER_VERIFICATION: "bg-amber-50 text-amber-700",
  VERIFIED: "bg-emerald-50 text-emerald-700",
  REJECTED: "bg-red-50 text-red-700",
};

type Row = {
  id: string;
  number: string;
  kind: string;
  status: string;
  summary: string;
  createdAt: string;
};

export default function BuyerDashboardPage() {
  const { userId } = useAuth();
  const { user } = useStorefrontUser();

  const { data: ordersData, isLoading: ordersLoading } = useQuery({
    queryKey: ["buyer-enquiries", userId],
    queryFn: () =>
      listOrders({ clerkUserId: userId ?? "", kind: "BUYER_ORDER", limit: 50 }),
    enabled: Boolean(userId),
  });

  const { data: leadsData, isLoading: leadsLoading } = useQuery({
    queryKey: ["buyer-leads", userId],
    queryFn: () => listMyLeads({ limit: 50 }),
    enabled: Boolean(userId),
  });

  const isLoading = ordersLoading || leadsLoading;

  const cartRows: Row[] = (ordersData?.data ?? []).map((order) => ({
    id: order.id,
    number: order.orderNumber,
    kind: "Cart enquiry",
    status: order.status === "PLACED" ? "NEW" : order.status,
    summary: `${order.items?.length ?? 0} item(s)`,
    createdAt: order.createdAt,
  }));

  const leadRows: Row[] = (leadsData?.data ?? [])
    .filter((l: LeadRecord) => l.type === "quote" || l.type === "wishlist")
    .map((l: LeadRecord) => ({
      id: l.id,
      number: l.id.slice(-8).toUpperCase(),
      kind: l.type === "quote" ? "Quick quote" : "Wishlist",
      status: (l.status || (l.isRead ? "CONTACTED" : "NEW")).toUpperCase(),
      summary: l.subject || l.type,
      createdAt: l.createdAt,
    }));

  const rows = [...cartRows, ...leadRows].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
  const openCount = rows.filter((r) =>
    ["NEW", "CONTACTED", "QUOTED", "PLACED"].includes(r.status),
  ).length;

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/5 via-white to-white p-8 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-primary">Buyer workspace</p>
            <h2 className="mt-1 text-2xl font-bold text-dark-gray">
              Welcome back, {user?.name ?? "Buyer"}
            </h2>
            <p className="mt-2 max-w-xl text-muted">
              Browse the catalogue, send enquiries, and track responses from our team here.
              No payment is taken on the platform.
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
              <p className="text-sm text-muted">Open enquiries</p>
              <p className="mt-1 text-3xl font-bold text-dark-gray">
                {isLoading ? "…" : openCount}
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
              <p className="text-sm text-muted">Total enquiries</p>
              <p className="mt-1 text-3xl font-bold text-dark-gray">
                {isLoading ? "…" : rows.length}
              </p>
            </div>
            <div className="rounded-xl bg-secondary/10 p-3 text-secondary">
              <MessageSquare className="h-5 w-5" />
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
          <p className="text-sm text-muted">Continue sourcing</p>
          <Button asChild className="mt-3 w-full" size="sm">
            <Link href="/products">
              Browse products <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      <div id="enquiries">
        <h3 className="mb-4 text-lg font-semibold text-dark-gray">My enquiries</h3>
        <div className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
          {isLoading ? (
            <div className="p-8 text-center text-sm text-muted">Loading enquiries…</div>
          ) : rows.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted">
              You haven&apos;t sent any enquiries yet. Add products to your cart or use Quick Quote.
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-light-gray/40 text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th className="px-4 py-3">Ref</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Summary</th>
                  <th className="px-4 py-3">Sent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.map((row) => (
                  <tr key={`${row.kind}-${row.id}`} className="hover:bg-primary/5">
                    <td className="px-4 py-3 font-medium text-dark-gray">{row.number}</td>
                    <td className="px-4 py-3 text-muted">{row.kind}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                          STATUS_STYLES[row.status] ?? "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {row.status.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted">{row.summary}</td>
                    <td className="px-4 py-3 text-muted">{formatDate(row.createdAt)}</td>
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
