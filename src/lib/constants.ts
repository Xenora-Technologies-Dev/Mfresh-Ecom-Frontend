export const SITE_NAME = "M Fresh";
export const SITE_TAGLINE = "Global B2B Food Marketplace";
export const MFRESH_WEBSITE = "https://www.mfresh.ae";
export const SITE_DESCRIPTION =
  "Premium B2B food marketplace connecting buyers and verified suppliers across the Middle East, Asia-Pacific, and worldwide.";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3006";
export const PORTAL_URL =
  process.env.NEXT_PUBLIC_PORTAL_URL ??
  process.env.NEXT_PUBLIC_ADMIN_URL ??
  "http://localhost:3007/login";

/** @deprecated Use PORTAL_URL */
export const ADMIN_PORTAL_URL = PORTAL_URL;

export const STOREFRONT_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3006";

export const COLORS = {
  primary: "#00A651",
  primaryDark: "#008A43",
  primaryLight: "#33B873",
  primaryMuted: "#E6F7ED",
  secondary: "#1C1D71",
  secondaryDark: "#14155A",
  freshMint: "#F3FAF5",
  white: "#FFFFFF",
  lightGray: "#F5F8F6",
  darkGray: "#1C1D71",
} as const;

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/distribution", label: "Distribution" },
  { href: "/categories", label: "Categories" },
  { href: "/products", label: "Products" },
  { href: "/live-shipping-tracker", label: "Live Shipping Tracker" },
  { href: "/media-center", label: "Media Center" },
  { href: "/contact", label: "Contact Us" },
  { href: "/faqs", label: "FAQs" },
] as const;

export const DEFAULT_REGION = "UAE";

export const FOOTER_LINKS = {
  marketplace: [
    { href: "/categories", label: "Categories" },
    { href: "/products", label: "Products" },
    { href: "/search", label: "Search" },
  ],
  company: [
    { href: "/about", label: "About Us" },
    { href: "/distribution", label: "Distribution" },
    { href: "/live-shipping-tracker", label: "Live Shipping Tracker" },
    { href: "/media-center", label: "Media Center" },
    { href: "/contact", label: "Contact" },
    { href: "/faqs", label: "FAQs" },
  ],
  legal: [
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
  ],
  join: [
    { href: "/become-buyer", label: "Become a Buyer" },
    { href: "/become-seller", label: "Become a Seller" },
    { href: `${PORTAL_URL}?role=buyer`, label: "Buyer Portal" },
    { href: `${PORTAL_URL}?role=seller`, label: "Seller Portal" },
  ],
} as const;

export const WHY_CHOOSE_US = [
  {
    title: "Verified Suppliers",
    description:
      "Every supplier is vetted for quality, compliance, and reliability before joining our platform.",
    icon: "ShieldCheck",
  },
  {
    title: "Global Sourcing",
    description:
      "Access premium ingredients and products from trusted suppliers across 40+ countries.",
    icon: "Globe",
  },
  {
    title: "Competitive Pricing",
    description:
      "Transparent wholesale pricing in USD with local currency conversion for AED and SGD.",
    icon: "TrendingDown",
  },
  {
    title: "International Logistics",
    description:
      "Streamlined ordering and delivery with coverage across the UAE, Singapore, and beyond.",
    icon: "Truck",
  },
] as const;
