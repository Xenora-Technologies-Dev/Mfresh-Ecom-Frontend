import { getCountryMeta } from "@/lib/countries";

const FOOD_BLURBS: Record<string, string> = {
  UAE: "Discover dates, fresh seafood, and premium Gulf produce from trusted UAE suppliers.",
  "United Arab Emirates":
    "Discover dates, fresh seafood, and premium Gulf produce from trusted UAE suppliers.",
  India:
    "Explore spices, basmati rice, frozen seafood, and farm-fresh produce from India.",
  "Sri Lanka":
    "Source Ceylon tea, coconut products, and tropical seafood from Sri Lanka.",
  Australia:
    "Find premium beef, lamb, dairy, and clean-label produce from Australia.",
  Afghanistan:
    "Discover dried fruits, nuts, and traditional staples from Afghanistan’s trade routes.",
  Oman: "Browse Omani dates, fish, and regional specialty foods for wholesale buyers.",
  "Saudi Arabia":
    "Access dates, dairy, poultry, and Halal-certified staples from Saudi Arabia.",
  Qatar: "Source chilled dairy, poultry, and Gulf market essentials from Qatar.",
  Bahrain: "Explore seafood, dairy, and regional grocery staples from Bahrain.",
  Kuwait: "Find Halal meats, dairy, and wholesale pantry goods from Kuwait.",
  Kenya: "Discover Kenyan tea, coffee, avocados, and fresh produce for export.",
  Senegal: "Source West African fish, groundnuts, and regional staples from Senegal.",
  Chad: "Explore grains, livestock products, and regional foods from Chad.",
  Ethiopia: "Find world-famous coffee, spices, and pulses from Ethiopia.",
  Germany: "Browse European dairy, meats, and processed foods from Germany.",
  Congo: "Discover cassava, palm oil, and Central African food staples from Congo.",
  Maldives: "Source premium tuna and Indian Ocean seafood from the Maldives.",
  "East Africa":
    "Explore coffee, tea, spices, and fresh produce across East Africa.",
  "West Africa":
    "Discover cocoa, cashews, fish, and regional staples from West Africa.",
  Russia: "Find grains, oils, frozen fish, and bulk commodities from Russia.",
  Ukraine: "Source sunflower oil, grains, and agri-exports from Ukraine.",
  Turkey: "Explore olives, nuts, dried fruits, and Mediterranean foods from Turkey.",
  Bangladesh: "Discover frozen seafood, rice, and ready foods from Bangladesh.",
  Poland: "Browse dairy, meats, and European pantry staples from Poland.",
  Austria: "Find alpine dairy, meats, and specialty foods from Austria.",
  Thailand: "Source rice, seafood, tropical fruits, and Thai specialties.",
  Indonesia: "Explore palm oil, spices, seafood, and tropical produce from Indonesia.",
  Singapore: "Access Asia’s hub for packaged foods, spices, and re-export trade.",
  Malaysia: "Discover palm oil, seafood, spices, and Halal foods from Malaysia.",
  Philippines: "Find tropical fruits, coconut products, and seafood from the Philippines.",
  Myanmar: "Explore rice, pulses, and regional agri-products from Myanmar.",
  Vietnam: "Source coffee, seafood, rice, and fresh produce from Vietnam.",
  China: "Browse tea, seafood, produce, and bulk food ingredients from China.",
  Norway: "Discover premium salmon, seafood, and cold-chain exports from Norway.",
  Italy: "Explore olive oil, pasta, cheeses, and Mediterranean specialties from Italy.",
  Japan: "Find premium seafood, rice, and specialty ingredients from Japan.",
  France: "Source cheeses, wines-adjacent pantry goods, and fine foods from France.",
  Lebanon: "Discover olive oil, spices, and Levantine specialties from Lebanon.",
  Iran: "Explore pistachios, saffron, dried fruits, and traditional staples from Iran.",
  Chile: "Find premium fruits, seafood, and Southern Hemisphere produce from Chile.",
  Belgium: "Browse chocolates, dairy, and European specialty foods from Belgium.",
};

export function getCountryFoodBlurb(country: string): string {
  return (
    FOOD_BLURBS[country] ??
    `Explore verified food suppliers and wholesale products from ${country}.`
  );
}

export function getCountryWelcomeCopy(country: string) {
  const meta = getCountryMeta(country);
  return {
    flag: meta.flag,
    blurb: getCountryFoodBlurb(country),
    title: `Welcome to M Fresh - ${country}`,
  };
}
