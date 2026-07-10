import { api } from "./client";

export interface LeadPayload {
  type: "contact" | "buyer" | "seller" | "newsletter" | "wishlist" | "quote";
  contactName: string;
  email: string;
  businessName?: string;
  phone?: string;
  businessType?: string;
  subject?: string;
  message?: string;
  country?: string;
}

export async function submitLead(payload: LeadPayload) {
  return api<{ id: string }>("/public/leads", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function submitQuickQuote(payload: {
  firstName: string;
  lastName: string;
  companyName: string;
  email: string;
  dialCode: string;
  phone: string;
  quantity: string;
  targetPrice: string;
  message?: string;
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    currency: string;
    moq: number;
    moqUnit: string;
    country: string;
    image: string;
    categoryName: string;
  };
}) {
  return submitLead({
    type: "quote",
    contactName: `${payload.firstName} ${payload.lastName}`.trim(),
    email: payload.email,
    businessName: payload.companyName,
    phone: `${payload.dialCode} ${payload.phone}`.trim(),
    country: payload.product.country,
    subject: `Quick Quote: ${payload.product.name}`,
    businessType: "quote",
    message: JSON.stringify({
      kind: "quote",
      firstName: payload.firstName,
      lastName: payload.lastName,
      dialCode: payload.dialCode,
      phone: payload.phone,
      quantity: payload.quantity,
      targetPrice: payload.targetPrice,
      note: payload.message ?? "",
      product: payload.product,
    }),
  });
}

export async function shareWishlist(payload: {
  contactName: string;
  email: string;
  phone: string;
  country: string;
  companyName: string;
  products: {
    id: string;
    name: string;
    slug: string;
    price: number;
    currency: string;
    country: string;
    image: string;
  }[];
}) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3006";
  return submitLead({
    type: "wishlist",
    contactName: payload.contactName,
    email: payload.email,
    phone: payload.phone,
    country: payload.country,
    businessName: payload.companyName,
    subject: `Wishlist Share (${payload.products.length} items)`,
    businessType: "wishlist",
    message: JSON.stringify({
      kind: "wishlist",
      productIds: payload.products.map((p) => p.id),
      products: payload.products.map((p) => ({
        ...p,
        url: `${siteUrl}/products/${p.slug}`,
      })),
    }),
  });
}
