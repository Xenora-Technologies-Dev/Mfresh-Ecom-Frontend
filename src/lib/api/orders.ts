import { api, qs, type ListParams, type PaginatedResponse } from "./client";

export type OrderKind = "BUYER_ORDER" | "SELLER_LISTING";

export type OrderStatus =
  | "PLACED"
  | "UNDER_VERIFICATION"
  | "VERIFIED"
  | "REJECTED"
  | "COMPLETED"
  | "CANCELLED";

export interface OrderItem {
  id: string;
  productId?: string | null;
  productSlug?: string | null;
  productName: string;
  productImage?: string | null;
  quantity: number;
  moqUnit: string;
  price: number;
  currency: string;
}

export interface CreateBuyerOrderItemInput {
  productId?: string;
  productSlug?: string;
  productName: string;
  productImage?: string;
  quantity: number;
  moqUnit: string;
  price: number;
  currency?: string;
}

export interface CreateBuyerOrderInput {
  clerkUserId: string;
  userName: string;
  userEmail: string;
  userPhone?: string;
  userCompany?: string;
  userCountry?: string;
  items: CreateBuyerOrderItemInput[];
}

export interface CreateSellerListingInput {
  clerkUserId: string;
  userName: string;
  userEmail: string;
  userPhone?: string;
  userCompany?: string;
  userCountry?: string;
  productName: string;
  productDescription?: string;
  productOrigin?: string;
  productImage?: string;
  productMoq?: number;
  productMoqUnit?: string;
  productPrice?: number;
  productCurrency?: string;
}

/** Unified order/listing record — buyer orders and seller listings share one resource, distinguished by `kind`. */
export interface Order {
  id: string;
  orderNumber: string;
  kind: OrderKind;
  status: OrderStatus;
  clerkUserId: string;
  userName: string;
  userEmail: string;
  userPhone?: string | null;
  userCompany?: string | null;
  userCountry?: string | null;
  productName?: string | null;
  productDescription?: string | null;
  productOrigin?: string | null;
  productImage?: string | null;
  productMoq?: number | null;
  productMoqUnit?: string | null;
  productPrice?: number | null;
  productCurrency?: string | null;
  remarks?: string | null;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderListParams extends ListParams {
  kind?: OrderKind;
  status?: OrderStatus;
  clerkUserId?: string;
}

export interface ReviewOrderInput {
  status: "VERIFIED" | "REJECTED";
  remarks?: string;
}

export function createBuyerOrder(data: CreateBuyerOrderInput) {
  return api<Order>("/orders/buyer", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function createSellerListing(data: CreateSellerListingInput) {
  return api<Order>("/orders/seller-listing", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function listOrders(params: OrderListParams = {}) {
  return api<PaginatedResponse<Order>>(`/orders${qs(params)}`);
}

export function getOrder(id: string) {
  return api<Order>(`/orders/${id}`);
}

export function reviewOrder(id: string, data: ReviewOrderInput) {
  return api<Order>(`/orders/${id}/review`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}
