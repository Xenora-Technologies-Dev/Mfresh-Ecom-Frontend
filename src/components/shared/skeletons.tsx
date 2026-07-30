import { cn } from "@/lib/utils";

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-lg bg-gray-200/80",
        className,
      )}
      {...props}
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-lg border border-gray-100 bg-white">
      <Skeleton className="aspect-square w-full shrink-0 rounded-none" />
      <div className="flex flex-1 flex-col gap-0.5 p-2 sm:p-2.5">
        <Skeleton className="h-3.5 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="min-h-[2.75rem] w-full sm:min-h-[3rem]" />
        <div className="mt-auto space-y-1 pt-1">
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-4 w-2/5" />
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 10 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-2 sm:gap-3 lg:grid-cols-5">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3 rounded-xl border border-gray-100 bg-white p-4">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-10 w-full" />
      ))}
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5">
      <Skeleton className="h-4 w-24 mb-3" />
      <Skeleton className="h-8 w-16" />
    </div>
  );
}
