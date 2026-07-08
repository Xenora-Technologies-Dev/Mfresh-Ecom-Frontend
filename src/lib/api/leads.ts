import { api } from "./client";

export interface LeadPayload {
  type: "contact" | "buyer" | "seller" | "newsletter";
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
