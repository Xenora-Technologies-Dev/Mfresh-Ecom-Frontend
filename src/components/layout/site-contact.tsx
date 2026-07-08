"use client";

import { useQuery } from "@tanstack/react-query";
import { Phone } from "lucide-react";
import { getSiteSettings } from "@/lib/api/settings";

export function SiteContactBar() {
  const { data: settings } = useQuery({
    queryKey: ["site-settings"],
    queryFn: getSiteSettings,
    staleTime: 5 * 60 * 1000,
  });

  const phone = settings?.contact_phone;
  const email = settings?.contact_email;

  if (!phone && !email) return null;

  return (
    <p className="flex items-center gap-2">
      <Phone className="h-3.5 w-3.5 text-primary" />
      {[phone, email].filter(Boolean).join(" · ")}
    </p>
  );
}
