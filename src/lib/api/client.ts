const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";
export const API_BASE = API_URL.replace(/\/api\/v1\/?$/, "");
const STORAGE_PUBLIC_URL =
  process.env.NEXT_PUBLIC_STORAGE_PUBLIC_URL?.replace(/\/$/, "") ?? "";

if (
  typeof window === "undefined" &&
  process.env.NODE_ENV === "production" &&
  process.env.NEXT_PHASE !== "phase-production-build" &&
  !process.env.NEXT_PUBLIC_API_URL
) {
  throw new Error("NEXT_PUBLIC_API_URL must be set in production");
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ListParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  [key: string]: string | number | boolean | undefined;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export const PLACEHOLDER_IMAGE = "/images/placeholder.svg";
export const MFRESH_LOGO = "/images/mfresh-logo.png";

type TokenGetter = () => Promise<string | null>;
let tokenGetter: TokenGetter | null = null;

/** Register Clerk getToken for authenticated API calls (client-side). */
export function setApiTokenGetter(getter: TokenGetter | null) {
  tokenGetter = getter;
}

export function storageUrl(path?: string | null): string {
  if (!path) return PLACEHOLDER_IMAGE;
  if (path.startsWith("http")) return path;
  if (STORAGE_PUBLIC_URL) {
    const normalized = path.replace(/^\/storage\//, "").replace(/^\//, "");
    return `${STORAGE_PUBLIC_URL}/${normalized}`;
  }
  return `${API_BASE}${path.startsWith("/") ? path : `/${path}`}`;
}

export function qs(params: ListParams = {}): string {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== "") sp.set(k, String(v));
  });
  const s = sp.toString();
  return s ? `?${s}` : "";
}

export async function api<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const base = process.env.NEXT_PUBLIC_API_URL;
  if (!base) {
    throw new ApiError("NEXT_PUBLIC_API_URL is not configured", 500);
  }

  const signal =
    options?.signal ??
    (typeof window === "undefined" ? AbortSignal.timeout(8_000) : undefined);

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options?.headers as Record<string, string> | undefined),
  };

  if (typeof window !== "undefined" && tokenGetter) {
    try {
      const token = await tokenGetter();
      if (token) headers.Authorization = `Bearer ${token}`;
    } catch {
      /* ignore token errors — request may still be public */
    }
  }

  const res = await fetch(`${base}${endpoint}`, {
    ...options,
    headers,
    signal,
  });

  if (!res.ok) {
    let message = res.statusText;
    try {
      const body = await res.json();
      message = body.message ?? message;
    } catch {
      message = await res.text().catch(() => message);
    }
    throw new ApiError(message, res.status);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export interface UploadedImageResult {
  id: string;
  type: string;
  urls: {
    display: string;
    thumbnail: string;
    medium: string;
    large: string;
  };
}

export async function uploadImage(
  file: File,
  type: "DISPLAY" | "ADDITIONAL" = "DISPLAY",
  preview = true,
): Promise<UploadedImageResult> {
  const base = process.env.NEXT_PUBLIC_API_URL;
  if (!base) throw new ApiError("NEXT_PUBLIC_API_URL is not configured", 500);

  const form = new FormData();
  form.append("file", file);
  const endpoint = preview
    ? `/images/preview?type=${type}`
    : `/images/upload?type=${type}`;

  const headers: Record<string, string> = {};
  if (typeof window !== "undefined" && tokenGetter) {
    try {
      const token = await tokenGetter();
      if (token) headers.Authorization = `Bearer ${token}`;
    } catch {
      /* ignore */
    }
  }

  const res = await fetch(`${base}${endpoint}`, {
    method: "POST",
    body: form,
    headers,
  });
  if (!res.ok) {
    let message = res.statusText;
    try {
      const body = await res.json();
      message = body.message ?? message;
    } catch {
      message = await res.text().catch(() => message);
    }
    throw new ApiError(message, res.status);
  }
  return res.json() as Promise<UploadedImageResult>;
}
