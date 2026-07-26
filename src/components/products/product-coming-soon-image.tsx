"use client";

import Image from "next/image";
import { MFRESH_LOGO } from "@/lib/api/client";
import { cn } from "@/lib/utils";

interface ProductComingSoonImageProps {
  className?: string;
  /** Container aspect / sizing — fills parent when absolute */
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
}

export function ProductComingSoonImage({
  className,
  fill = true,
  sizes = "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw",
  priority,
}: ProductComingSoonImageProps) {
  return (
    <div
      className={cn(
        "relative flex h-full w-full flex-col items-center justify-center gap-2 bg-light-gray/60 p-4",
        className,
      )}
    >
      <div
        className={cn(
          "relative",
          fill ? "h-[45%] w-[55%] max-h-40 max-w-[11rem]" : "h-24 w-32",
        )}
      >
        <Image
          src={MFRESH_LOGO}
          alt="M Fresh"
          fill
          className="object-contain grayscale"
          sizes={sizes}
          priority={priority}
        />
      </div>
      <p className="text-center text-xs font-medium tracking-wide text-muted sm:text-sm">
        Coming soon...
      </p>
    </div>
  );
}
