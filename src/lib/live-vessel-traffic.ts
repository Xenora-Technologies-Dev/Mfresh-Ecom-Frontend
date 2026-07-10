export type VesselStatus = "import" | "export" | "transit";
export type VesselType = "reefer" | "container" | "bulk";

export interface Vessel {
  id: string;
  name: string;
  lat: number;
  lng: number;
  heading: number;
  status: VesselStatus;
  type: VesselType;
  cargo: string;
  region: string;
  port: string;
  speedKnots: number;
}

export const TRAFFIC_WINDOW_MS = 4 * 60 * 60 * 1000;

const FOOD_CARGO = [
  "Frozen Seafood",
  "Fresh Fruits",
  "Premium Meat",
  "Basmati Rice",
  "Dairy Products",
  "Organic Vegetables",
  "Spices & Herbs",
  "Poultry",
  "Olive Oil",
  "Coffee Beans",
  "Citrus Fruits",
  "Grain & Pulses",
];

interface Port {
  name: string;
  lat: number;
  lng: number;
}

interface RegionConfig {
  key: string;
  label: string;
  baseCount: number;
  ports: Port[];
}

/** MFresh trade regions — vessel counts per country/region with major ports */
const REGIONS: RegionConfig[] = [
  {
    key: "india",
    label: "India",
    baseCount: 22,
    ports: [
      { name: "Mumbai (JNPT)", lat: 18.95, lng: 72.95 },
      { name: "Chennai", lat: 13.08, lng: 80.29 },
      { name: "Kolkata", lat: 22.54, lng: 88.34 },
      { name: "Kochi", lat: 9.97, lng: 76.27 },
      { name: "Kandla", lat: 23.03, lng: 70.22 },
      { name: "Visakhapatnam", lat: 17.69, lng: 83.22 },
      { name: "Mundra", lat: 22.74, lng: 69.72 },
      { name: "Paradip", lat: 20.32, lng: 86.61 },
      { name: "Tuticorin", lat: 8.76, lng: 78.2 },
      { name: "Mangalore", lat: 12.92, lng: 74.86 },
    ],
  },
  {
    key: "sri-lanka",
    label: "Sri Lanka",
    baseCount: 8,
    ports: [
      { name: "Colombo", lat: 6.94, lng: 79.85 },
      { name: "Hambantota", lat: 6.12, lng: 81.12 },
      { name: "Galle", lat: 6.03, lng: 80.22 },
    ],
  },
  {
    key: "australia",
    label: "Australia",
    baseCount: 4,
    ports: [
      { name: "Sydney", lat: -33.87, lng: 151.21 },
      { name: "Melbourne", lat: -37.84, lng: 144.94 },
      { name: "Brisbane", lat: -27.45, lng: 153.07 },
      { name: "Fremantle", lat: -32.06, lng: 115.74 },
    ],
  },
  {
    key: "afghanistan",
    label: "Afghanistan",
    baseCount: 6,
    ports: [
      { name: "Chabahar (trade)", lat: 25.3, lng: 60.62 },
      { name: "Bandar Abbas", lat: 27.18, lng: 56.28 },
      { name: "Karachi (transit)", lat: 24.86, lng: 67.01 },
    ],
  },
  {
    key: "uae",
    label: "UAE",
    baseCount: 18,
    ports: [
      { name: "Jebel Ali", lat: 25.01, lng: 55.06 },
      { name: "Dubai", lat: 25.27, lng: 55.3 },
      { name: "Abu Dhabi", lat: 24.52, lng: 54.38 },
      { name: "Sharjah", lat: 25.36, lng: 55.38 },
      { name: "Fujairah", lat: 25.12, lng: 56.33 },
      { name: "Khalifa Port", lat: 24.82, lng: 54.65 },
    ],
  },
  {
    key: "oman",
    label: "Oman",
    baseCount: 10,
    ports: [
      { name: "Sohar", lat: 24.47, lng: 56.64 },
      { name: "Muscat", lat: 23.62, lng: 58.59 },
      { name: "Salalah", lat: 16.95, lng: 54.01 },
    ],
  },
  {
    key: "saudi",
    label: "Saudi Arabia",
    baseCount: 18,
    ports: [
      { name: "Jeddah", lat: 21.49, lng: 39.19 },
      { name: "Dammam", lat: 26.43, lng: 50.1 },
      { name: "Yanbu", lat: 24.09, lng: 38.06 },
      { name: "Jazan", lat: 16.89, lng: 42.55 },
      { name: "King Abdullah", lat: 22.03, lng: 39.1 },
    ],
  },
  {
    key: "qatar",
    label: "Qatar",
    baseCount: 8,
    ports: [
      { name: "Hamad Port", lat: 25.0, lng: 51.55 },
      { name: "Doha", lat: 25.29, lng: 51.53 },
      { name: "Mesaieed", lat: 24.99, lng: 51.55 },
    ],
  },
  {
    key: "bahrain",
    label: "Bahrain",
    baseCount: 9,
    ports: [
      { name: "Khalifa Bin Salman", lat: 26.2, lng: 50.61 },
      { name: "Mina Salman", lat: 26.2, lng: 50.58 },
    ],
  },
  {
    key: "kuwait",
    label: "Kuwait",
    baseCount: 9,
    ports: [
      { name: "Shuwaikh", lat: 29.35, lng: 47.93 },
      { name: "Shuaiba", lat: 29.04, lng: 48.16 },
      { name: "Mubarak Al-Kabeer", lat: 28.78, lng: 48.4 },
    ],
  },
  {
    key: "kenya",
    label: "Kenya",
    baseCount: 4,
    ports: [
      { name: "Mombasa", lat: -4.06, lng: 39.67 },
      { name: "Lamu", lat: -2.27, lng: 40.9 },
    ],
  },
  {
    key: "senegal",
    label: "Senegal",
    baseCount: 7,
    ports: [
      { name: "Dakar", lat: 14.67, lng: -17.43 },
      { name: "Kaolack", lat: 14.15, lng: -16.08 },
    ],
  },
  {
    key: "chad",
    label: "Chad",
    baseCount: 4,
    ports: [
      { name: "Douala (transit)", lat: 4.05, lng: 9.7 },
      { name: "Port Sudan (transit)", lat: 19.62, lng: 37.22 },
    ],
  },
  {
    key: "ethiopia",
    label: "Ethiopia",
    baseCount: 22,
    ports: [
      { name: "Djibouti", lat: 11.59, lng: 43.15 },
      { name: "Berbera", lat: 10.44, lng: 45.01 },
      { name: "Massawa", lat: 15.61, lng: 39.48 },
    ],
  },
  {
    key: "germany",
    label: "Germany",
    baseCount: 3,
    ports: [
      { name: "Hamburg", lat: 53.55, lng: 9.99 },
      { name: "Bremen", lat: 53.08, lng: 8.8 },
    ],
  },
  {
    key: "congo",
    label: "Congo",
    baseCount: 5,
    ports: [
      { name: "Pointe-Noire", lat: -4.78, lng: 11.86 },
      { name: "Matadi", lat: -5.82, lng: 13.46 },
    ],
  },
  {
    key: "maldives",
    label: "Maldives",
    baseCount: 2,
    ports: [{ name: "Malé", lat: 4.17, lng: 73.51 }],
  },
  {
    key: "east-africa",
    label: "East Africa",
    baseCount: 25,
    ports: [
      { name: "Mombasa", lat: -4.06, lng: 39.67 },
      { name: "Dar es Salaam", lat: -6.82, lng: 39.29 },
      { name: "Djibouti", lat: 11.59, lng: 43.15 },
      { name: "Zanzibar", lat: -6.16, lng: 39.19 },
      { name: "Maputo", lat: -25.97, lng: 32.57 },
      { name: "Beira", lat: -19.84, lng: 34.84 },
      { name: "Port Sudan", lat: 19.62, lng: 37.22 },
      { name: "Durban", lat: -29.87, lng: 31.03 },
    ],
  },
  {
    key: "west-africa",
    label: "West Africa",
    baseCount: 22,
    ports: [
      { name: "Lagos (Apapa)", lat: 6.45, lng: 3.37 },
      { name: "Abidjan", lat: 5.3, lng: -4.01 },
      { name: "Dakar", lat: 14.67, lng: -17.43 },
      { name: "Tema", lat: 5.63, lng: -0.01 },
      { name: "Casablanca", lat: 33.6, lng: -7.62 },
      { name: "Cotonou", lat: 6.35, lng: 2.43 },
      { name: "Lomé", lat: 6.13, lng: 1.22 },
    ],
  },
  {
    key: "russia",
    label: "Russia",
    baseCount: 24,
    ports: [
      { name: "St Petersburg", lat: 59.93, lng: 30.26 },
      { name: "Novorossiysk", lat: 44.72, lng: 37.77 },
      { name: "Vladivostok", lat: 43.12, lng: 131.89 },
      { name: "Murmansk", lat: 68.97, lng: 33.05 },
      { name: "Kaliningrad", lat: 54.71, lng: 20.51 },
    ],
  },
  {
    key: "ukraine",
    label: "Ukraine",
    baseCount: 48,
    ports: [
      { name: "Odesa", lat: 46.48, lng: 30.73 },
      { name: "Mykolaiv", lat: 46.97, lng: 31.99 },
      { name: "Chornomorsk", lat: 46.34, lng: 30.66 },
      { name: "Pivdennyi", lat: 46.62, lng: 31.01 },
    ],
  },
  {
    key: "turkey",
    label: "Turkey",
    baseCount: 12,
    ports: [
      { name: "Istanbul", lat: 41.01, lng: 28.98 },
      { name: "Izmir", lat: 38.42, lng: 27.14 },
      { name: "Mersin", lat: 36.8, lng: 34.64 },
      { name: "Ambarli", lat: 40.97, lng: 28.7 },
    ],
  },
  {
    key: "bangladesh",
    label: "Bangladesh",
    baseCount: 12,
    ports: [
      { name: "Chittagong", lat: 22.32, lng: 91.8 },
      { name: "Mongla", lat: 22.49, lng: 89.6 },
      { name: "Payra", lat: 21.78, lng: 90.12 },
    ],
  },
  {
    key: "poland",
    label: "Poland",
    baseCount: 4,
    ports: [
      { name: "Gdańsk", lat: 54.35, lng: 18.65 },
      { name: "Gdynia", lat: 54.53, lng: 18.55 },
    ],
  },
  {
    key: "austria",
    label: "Austria",
    baseCount: 2,
    ports: [
      { name: "Trieste (transit)", lat: 45.65, lng: 13.78 },
      { name: "Koper (transit)", lat: 45.55, lng: 13.73 },
    ],
  },
  {
    key: "thailand",
    label: "Thailand",
    baseCount: 12,
    ports: [
      { name: "Laem Chabang", lat: 13.08, lng: 100.88 },
      { name: "Bangkok", lat: 13.7, lng: 100.58 },
      { name: "Map Ta Phut", lat: 12.68, lng: 101.14 },
    ],
  },
  {
    key: "indonesia",
    label: "Indonesia",
    baseCount: 19,
    ports: [
      { name: "Tanjung Priok", lat: -6.1, lng: 106.88 },
      { name: "Surabaya", lat: -7.2, lng: 112.73 },
      { name: "Belawan", lat: 3.78, lng: 98.69 },
      { name: "Makassar", lat: -5.13, lng: 119.41 },
    ],
  },
  {
    key: "singapore",
    label: "Singapore",
    baseCount: 18,
    ports: [
      { name: "PSA Singapore", lat: 1.26, lng: 103.84 },
      { name: "Tuas", lat: 1.31, lng: 103.64 },
      { name: "Pasir Panjang", lat: 1.27, lng: 103.76 },
    ],
  },
  {
    key: "malaysia",
    label: "Malaysia",
    baseCount: 89,
    ports: [
      { name: "Port Klang", lat: 3.0, lng: 101.39 },
      { name: "Tanjung Pelepas", lat: 1.37, lng: 103.55 },
      { name: "Penang", lat: 5.42, lng: 100.34 },
      { name: "Kuantan", lat: 3.97, lng: 103.43 },
      { name: "Bintulu", lat: 3.17, lng: 113.04 },
      { name: "Kota Kinabalu", lat: 5.98, lng: 116.07 },
      { name: "Pasir Gudang", lat: 1.43, lng: 103.9 },
      { name: "Malacca", lat: 2.19, lng: 102.25 },
    ],
  },
  {
    key: "philippines",
    label: "Philippines",
    baseCount: 8,
    ports: [
      { name: "Manila", lat: 14.59, lng: 120.97 },
      { name: "Cebu", lat: 10.32, lng: 123.91 },
      { name: "Davao", lat: 7.07, lng: 125.61 },
    ],
  },
  {
    key: "myanmar",
    label: "Myanmar",
    baseCount: 8,
    ports: [
      { name: "Yangon", lat: 16.87, lng: 96.2 },
      { name: "Thilawa", lat: 16.63, lng: 96.25 },
    ],
  },
  {
    key: "vietnam",
    label: "Vietnam",
    baseCount: 8,
    ports: [
      { name: "Ho Chi Minh (Cat Lai)", lat: 10.77, lng: 106.76 },
      { name: "Haiphong", lat: 20.86, lng: 106.68 },
      { name: "Da Nang", lat: 16.07, lng: 108.22 },
    ],
  },
];

function seededRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 0xffffffff;
  };
}

export function getTrafficWindow(timestamp = Date.now()): number {
  return Math.floor(timestamp / TRAFFIC_WINDOW_MS);
}

export function getMsUntilNextWindow(timestamp = Date.now()): number {
  return TRAFFIC_WINDOW_MS - (timestamp % TRAFFIC_WINDOW_MS);
}

/** Adjust count ±2–5 from base each 4-hour window */
export function getRegionCount(
  baseCount: number,
  window: number,
  regionKey: string,
): number {
  const rand = seededRandom(window * 7919 + regionKey.length * 997);
  const delta = Math.floor(rand() * 4) + 2;
  const sign = rand() > 0.48 ? 1 : -1;
  return Math.max(Math.ceil(baseCount * 0.7), baseCount + sign * delta);
}

export function getVesselCountForWindow(window: number): number {
  return REGIONS.reduce(
    (sum, r) => sum + getRegionCount(r.baseCount, window, r.key),
    0,
  );
}

function pick<T>(rand: () => number, arr: T[]): T {
  return arr[Math.floor(rand() * arr.length)]!;
}

function vesselStatus(rand: () => number): VesselStatus {
  const r = rand();
  if (r < 0.38) return "export";
  if (r < 0.72) return "import";
  return "transit";
}

function vesselType(rand: () => number, cargo: string): VesselType {
  if (
    cargo.includes("Frozen") ||
    cargo.includes("Meat") ||
    cargo.includes("Dairy")
  )
    return "reefer";
  if (
    cargo.includes("Rice") ||
    cargo.includes("Grain") ||
    cargo.includes("Coffee")
  )
    return "bulk";
  return rand() < 0.55 ? "container" : "reefer";
}

export function generateVessels(window: number, tick = 0): Vessel[] {
  const vessels: Vessel[] = [];
  let globalIndex = 0;

  for (const region of REGIONS) {
    const count = getRegionCount(region.baseCount, window, region.key);
    const rand = seededRandom(window * 31337 + region.key.charCodeAt(0) * 1000);

    for (let i = 0; i < count; i++) {
      const port = region.ports[i % region.ports.length]!;
      const portRand = seededRandom(window + globalIndex * 17 + tick);
      const jitterLat = (portRand() - 0.5) * 1.2;
      const jitterLng = (portRand() - 0.5) * 1.4;
      const tickDrift = Math.sin((tick + globalIndex) * 0.35) * 0.06;
      const tickDriftLng = Math.cos((tick + globalIndex) * 0.3) * 0.08;
      const cargo = pick(portRand, FOOD_CARGO);
      const type = vesselType(portRand, cargo);
      const heading = portRand() * 360;

      vessels.push({
        id: `mfv-${region.key}-${window}-${i}`,
        name: `M Fresh ${type === "reefer" ? "Reefer" : type === "bulk" ? "Bulk" : "Cargo"} ${String(globalIndex + 1).padStart(3, "0")}`,
        lat: port.lat + jitterLat + tickDrift,
        lng: port.lng + jitterLng + tickDriftLng,
        heading,
        status: vesselStatus(portRand),
        type,
        cargo,
        region: region.label,
        port: port.name,
        speedKnots: Math.round(8 + portRand() * 16),
      });
      globalIndex++;
    }
  }

  return vessels;
}

export const STATUS_COLORS: Record<VesselStatus, string> = {
  export: "#4DB87A",
  import: "#FF9A56",
  transit: "#38BDF8",
};

export const STATUS_LABELS: Record<VesselStatus, string> = {
  export: "Export",
  import: "Import",
  transit: "In Transit",
};

export const REGION_SUMMARY = REGIONS.map((r) => ({
  label: r.label,
  baseCount: r.baseCount,
  ports: r.ports.length,
}));

/** Country / region names used across trade map, filters, and header selector */
export const TRADE_REGION_LABELS = REGIONS.map((r) => r.label);
