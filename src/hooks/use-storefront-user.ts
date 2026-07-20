"use client";

import { useMemo } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import { parsePortalRole, type PortalUser } from "@/lib/auth/roles";

function displayName(
  firstName?: string | null,
  lastName?: string | null,
  fullName?: string | null,
  email?: string | null,
): string {
  if (fullName?.trim()) return fullName.trim();
  const joined = [firstName, lastName].filter(Boolean).join(" ").trim();
  if (joined) return joined;
  return email?.split("@")[0] || "User";
}

function isOnboardingComplete(value: unknown): boolean {
  return value === true || value === "true";
}

/**
 * Storefront-only user hook — resolves to a buyer or seller profile.
 * Admins (operations) never resolve here; they belong on the ops portal.
 */
export function useStorefrontUser() {
  const { isLoaded, isSignedIn, user } = useUser();
  const { signOut } = useClerk();

  const storefrontUser: PortalUser | null = useMemo(() => {
    if (!isSignedIn || !user) return null;

    const meta = user.publicMetadata as Record<string, unknown>;
    if (!isOnboardingComplete(meta.onboardingComplete)) return null;

    const role = parsePortalRole(meta.portalRole);
    if (!role || role === "admin") return null;

    return {
      email: user.primaryEmailAddress?.emailAddress ?? "",
      name: displayName(
        user.firstName,
        user.lastName,
        user.fullName,
        user.primaryEmailAddress?.emailAddress,
      ),
      role,
      company:
        typeof meta.organizationName === "string"
          ? meta.organizationName
          : undefined,
      country: typeof meta.country === "string" ? meta.country : undefined,
      whatsapp: typeof meta.whatsapp === "string" ? meta.whatsapp : undefined,
    };
  }, [isSignedIn, user]);

  const logout = async () => {
    await signOut({ redirectUrl: "/" });
  };

  return {
    isLoaded,
    isSignedIn: Boolean(isSignedIn),
    user: storefrontUser,
    logout,
  };
}
