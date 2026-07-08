import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  href?: string;
  linkText?: string;
  className?: string;
  align?: "left" | "center";
}

export function SectionHeader({
  title,
  subtitle,
  href,
  linkText = "View All",
  className,
  align = "left",
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "mb-8 flex flex-col gap-3 sm:mb-10",
        align === "center" && "items-center text-center",
        align === "left" && "sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div className={cn("space-y-2", align === "center" && "max-w-2xl")}>
        <h2 className="text-2xl font-bold tracking-tight text-dark-gray sm:text-3xl lg:text-4xl">
          {title}
        </h2>
        {subtitle && (
          <p className="text-base text-muted leading-relaxed sm:text-lg">
            {subtitle}
          </p>
        )}
      </div>
      {href && align === "left" && (
        <Link
          href={href}
          className="group inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
        >
          {linkText}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}
