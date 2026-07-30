import { cn } from "@/lib/utils";

interface PageLoaderProps {
  className?: string;
  label?: string;
}

/** Full main-area placeholder so the footer stays pinned during navigation. */
export function PageLoader({
  className,
  label = "Loading…",
}: PageLoaderProps) {
  return (
    <div
      className={cn(
        "flex min-h-[70vh] w-full flex-col items-center justify-center gap-3 py-16",
        className,
      )}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div
        className="h-9 w-9 animate-spin rounded-full border-2 border-primary/25 border-t-primary"
        aria-hidden
      />
      <p className="text-sm text-muted">{label}</p>
    </div>
  );
}
