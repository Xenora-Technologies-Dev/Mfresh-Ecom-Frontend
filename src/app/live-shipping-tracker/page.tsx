import { PageHero } from "@/components/shared/page-hero";
import { LiveVesselTrafficSection } from "@/components/home/live-vessel-traffic-section";

export const metadata = {
  title: "Live Shipping Tracker",
  description:
    "Track M Fresh food import and export shipments live across global trade routes.",
};

export default function LiveShippingTrackerPage() {
  return (
    <>
      <PageHero
        title="Live Shipping Tracker"
        subtitle="Follow M Fresh food import and export vessels in real time across global trade routes."
      />
      <LiveVesselTrafficSection />
    </>
  );
}
