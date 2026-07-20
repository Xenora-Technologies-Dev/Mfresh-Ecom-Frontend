export type PortalRole = "admin" | "buyer" | "seller";

export type SignupPortalRole = Exclude<PortalRole, "admin">;

export interface PortalUser {
  email: string;
  name: string;
  role: PortalRole;
  company?: string;
  country?: string;
  whatsapp?: string;
}

const RAW_OPS_PORTAL_URL =
  process.env.NEXT_PUBLIC_PORTAL_URL ??
  process.env.NEXT_PUBLIC_OPS_PORTAL_URL ??
  "http://localhost:3007";

/** Ops portal base URL with any trailing `/login` path stripped. */
function opsPortalBase(): string {
  const base = RAW_OPS_PORTAL_URL.replace(/\/login\/?$/, "").replace(/\/$/, "");
  return base || "http://localhost:3007";
}

export function getDashboardPath(role: PortalRole): string {
  switch (role) {
    case "buyer":
      return "/buyer";
    case "seller":
      return "/seller";
    case "admin":
      // Admins don't have a storefront dashboard — send them to operations.
      return opsPortalBase();
    default:
      return "/";
  }
}

export function parsePortalRole(value: unknown): PortalRole | null {
  if (value === "admin" || value === "buyer" || value === "seller") return value;
  return null;
}
