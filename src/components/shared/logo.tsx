"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/providers/theme-provider";
import { DEFAULT_LOGO_PATH } from "@/lib/theme";
import { cn } from "@/lib/utils";

/**
 * Local brand mark (~519×228). Always serve the bundled public asset so
 * a missing/broken theme upload cannot blank the header/footer.
 */
const LOGO_BOX =
  "relative block h-[48px] w-[112px] shrink-0 overflow-visible sm:h-[60px] sm:w-[140px] lg:h-[68px] lg:w-[158px]";

const FOOTER_LOGO_BOX =
  "relative block h-[36px] w-[84px] shrink-0 overflow-visible sm:h-[42px] sm:w-[98px]";

export function Logo({
  className,
  variant = "default",
}: {
  className?: string;
  /** Footer sits on navy — give the mark a white plate so it stays crisp */
  variant?: "default" | "footer";
}) {
  const { theme, isReady } = useTheme();
  const pathname = usePathname();
  const boxClass = variant === "footer" ? FOOTER_LOGO_BOX : LOGO_BOX;

  const handleHomeClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (!isReady) {
    return <div className={cn(boxClass, className)} aria-hidden />;
  }

  if (theme.logoStyle === "image") {
    return (
      <Link
        href="/"
        onClick={handleHomeClick}
        className={cn(
          "group inline-flex w-fit shrink-0 items-center overflow-visible",
          variant === "footer" &&
            "rounded-lg bg-white px-2 py-1 shadow-sm ring-1 ring-white/20",
          className,
        )}
        aria-label="MFresh home"
      >
        <span className={boxClass}>
          {/* Native img: reliable for /public assets; avoids Next Image + bad theme URLs */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={DEFAULT_LOGO_PATH}
            alt="M Fresh"
            width={168}
            height={72}
            className="h-full w-full object-contain object-left"
            decoding="async"
          />
        </span>
      </Link>
    );
  }

  return (
    <Link
      href="/"
      onClick={handleHomeClick}
      className={cn(
        "group flex shrink-0 items-center rounded-xl bg-primary/5 px-3 py-1.5 ring-1 ring-primary/15 transition-all hover:bg-primary/10 hover:ring-primary/30 sm:px-4",
        className,
      )}
    >
      <span className="flex items-baseline gap-0 font-black tracking-tight">
        <span className="text-3xl text-primary sm:text-4xl lg:text-[2.5rem]">M</span>
        <span className="relative text-3xl text-secondary sm:text-4xl lg:text-[2.5rem]">
          Fresh
        </span>
      </span>
    </Link>
  );
}
