"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTheme } from "@/providers/theme-provider";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  const { theme, logoUrl, isReady } = useTheme();
  const pathname = usePathname();

  // Avoid soft-nav remount when already on home (prevents insertBefore DOM errors)
  const handleHomeClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Never paint default text logo until branding is ready
  if (!isReady) {
    return (
      <div
        className={cn(
          "h-[56px] w-[160px] shrink-0 sm:h-[62px] sm:w-[180px] lg:h-[68px] lg:w-[200px]",
          className,
        )}
        aria-hidden
      />
    );
  }

  if (theme.logoStyle === "image" && logoUrl) {
    return (
      <Link
        href="/"
        onClick={handleHomeClick}
        className={cn(
          "group flex shrink-0 items-center py-0.5 transition-transform hover:scale-[1.02]",
          className,
        )}
      >
        <span className="relative block h-[56px] w-[160px] sm:h-[62px] sm:w-[180px] lg:h-[68px] lg:w-[200px]">
          <Image
            src={logoUrl}
            alt="M Fresh"
            fill
            className="object-contain object-left drop-shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
            priority
            unoptimized
            sizes="(max-width: 640px) 160px, (max-width: 1024px) 180px, 200px"
          />
        </span>
      </Link>
    );
  }

  // Text logo only when admin explicitly saved logoStyle "text"
  return (
    <Link
      href="/"
      onClick={handleHomeClick}
      className={cn(
        "group flex shrink-0 items-center rounded-xl bg-primary/5 px-3 py-1.5 ring-1 ring-primary/15 transition-all hover:bg-primary/10 hover:ring-primary/30 sm:px-4",
        className,
      )}
    >
      <span className="flex items-baseline gap-0 font-black uppercase tracking-tight">
        <span className="text-3xl text-primary sm:text-4xl lg:text-[2.5rem]">M</span>
        <span className="relative text-3xl text-dark-gray sm:text-4xl lg:text-[2.5rem]">
          Fresh
          <svg
            className="absolute -bottom-1 left-0 w-full transition-all group-hover:stroke-[4]"
            viewBox="0 0 80 8"
            fill="none"
            aria-hidden
          >
            <path
              d="M2 6C20 2 40 1 78 4"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              className="text-secondary"
            />
          </svg>
        </span>
      </span>
    </Link>
  );
}
