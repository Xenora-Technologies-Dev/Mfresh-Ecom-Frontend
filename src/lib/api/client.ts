const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4005/api/v1";
export const API_BASE = API_URL.replace(/\/api\/v1\/?$/, "");
const STORAGE_PUBLIC_URL =
  process.env.NEXT_PUBLIC_STORAGE_PUBLIC_URL?.replace(/\/$/, "") ?? "";

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
  // Server-side fetches without a timeout can hang Netlify static generation
  const signal =
    options?.signal ??
    (typeof window === "undefined" ? AbortSignal.timeout(8_000) : undefined);

  const res = await fetch(`${API_URL}${endpoint}`, {
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
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
