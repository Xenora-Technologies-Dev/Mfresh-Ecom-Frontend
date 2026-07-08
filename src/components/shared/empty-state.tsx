import { PackageOpen } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title?: string;
  message?: string;
  className?: string;
}

export function EmptyState({
  title = "Nothing here yet",
  message = "Check back soon — new items are added through the admin portal.",
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-fresh-mint/30 px-6 py-16 text-center",
        className,
      )}
    >
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary-muted text-primary">
        <PackageOpen className="h-7 w-7" />
      </div>
      <h3 className="text-lg font-semibold text-dark-gray">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-muted">{message}</p>
    </div>
  );
}
