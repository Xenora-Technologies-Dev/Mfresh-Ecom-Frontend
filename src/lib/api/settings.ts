import { api } from "./client";

export interface SiteSettings {
  site_name?: string;
  contact_email?: string;
  contact_phone?: string;
  support_address?: string;
  promotional_message?: string;
}

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    return await api<SiteSettings>("/public/settings/site");
  } catch {
    return {};
  }
}
