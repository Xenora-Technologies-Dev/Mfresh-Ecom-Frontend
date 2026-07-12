import { Newspaper, CalendarDays, Clapperboard } from "lucide-react";
import { PageHero } from "@/components/shared/page-hero";
import { AnimatedSection } from "@/components/shared/animated-section";

export const metadata = {
  title: "Media Center",
  description:
    "Coming soon — M Fresh media, events, and news from our global B2B food marketplace.",
};

const UPCOMING = [
  {
    icon: Clapperboard,
    title: "Media",
    description:
      "Brand stories, product features, and press assets for partners and media.",
  },
  {
    icon: CalendarDays,
    title: "Events",
    description:
      "Trade shows, tasting sessions, and industry gatherings with M Fresh.",
  },
  {
    icon: Newspaper,
    title: "News",
    description:
      "Company updates, market insights, and announcements across our network.",
  },
] as const;

export default function MediaCenterPage() {
  return (
    <>
      <PageHero
        title="Media Center"
        subtitle="Media, events, and news related to M Fresh — launching soon."
      />

      <AnimatedSection className="pb-16 pt-4 sm:pb-20 sm:pt-6">
        <div className="container-main">
          <div className="mx-auto max-w-2xl rounded-2xl border border-border bg-white px-6 py-10 text-center shadow-sm sm:px-10 sm:py-12">
            <span className="inline-flex items-center rounded-full bg-primary-muted px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
              Coming soon
            </span>
            <h2 className="mt-4 text-2xl font-bold text-dark-gray sm:text-3xl">
              We’re preparing the Media Center
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
              This page will host media, events, and news related to M Fresh —
              stay tuned for stories from our global food marketplace.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:mt-12 sm:grid-cols-3 sm:gap-5">
            {UPCOMING.map(({ icon: Icon, title, description }) => (
              <article
                key={title}
                className="rounded-2xl border border-border bg-surface p-5 sm:p-6"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary-muted text-secondary">
                  <Icon className="h-5 w-5" strokeWidth={2} />
                </span>
                <h3 className="mt-4 text-lg font-bold text-dark-gray">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </AnimatedSection>
    </>
  );
}
