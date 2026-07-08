import { cn } from "@/lib/utils";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  className?: string;
  children?: React.ReactNode;
}

export function PageHero({ title, subtitle, className, children }: PageHeroProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden bg-gradient-to-br from-primary/5 via-white to-secondary/5 py-16 sm:py-20 lg:py-24",
        className,
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(23,138,70,0.08),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(247,147,30,0.06),transparent_50%)]" />
      <div className="container-main relative">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-bold tracking-tight text-dark-gray sm:text-4xl lg:text-5xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-4 text-lg text-muted leading-relaxed sm:text-xl">
              {subtitle}
            </p>
          )}
          {children && <div className="mt-8">{children}</div>}
        </div>
      </div>
    </section>
  );
}
