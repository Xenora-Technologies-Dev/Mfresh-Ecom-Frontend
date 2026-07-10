import { TRADE_REGION_LABELS } from "@/lib/live-vessel-traffic";
import { DEFAULT_REGION } from "@/lib/constants";
import {
  getCircleFlagUrlFromCode,
  isoCodeToEmoji,
  resolveCountryCode,
} from "@/lib/world-countries";

export type CountryOption = {
  name: string;
  code: string;
  flag: string;
};

export const COUNTRY_META: Record<string, { code: string; flag: string }> = {
  UAE: { code: "AE", flag: "🇦🇪" },
  "United Arab Emirates": { code: "AE", flag: "🇦🇪" },
  India: { code: "IN", flag: "🇮🇳" },
  "Sri Lanka": { code: "LK", flag: "🇱🇰" },
  Australia: { code: "AU", flag: "🇦🇺" },
  Afghanistan: { code: "AF", flag: "🇦🇫" },
  Oman: { code: "OM", flag: "🇴🇲" },
  "Saudi Arabia": { code: "SA", flag: "🇸🇦" },
  Qatar: { code: "QA", flag: "🇶🇦" },
  Bahrain: { code: "BH", flag: "🇧🇭" },
  Kuwait: { code: "KW", flag: "🇰🇼" },
  Kenya: { code: "KE", flag: "🇰🇪" },
  Senegal: { code: "SN", flag: "🇸🇳" },
  Chad: { code: "TD", flag: "🇹🇩" },
  Ethiopia: { code: "ET", flag: "🇪🇹" },
  Germany: { code: "DE", flag: "🇩🇪" },
  Congo: { code: "CG", flag: "🇨🇬" },
  Maldives: { code: "MV", flag: "🇲🇻" },
  "East Africa": { code: "EA", flag: "🌍" },
  "West Africa": { code: "WA", flag: "🌍" },
  Russia: { code: "RU", flag: "🇷🇺" },
  Ukraine: { code: "UA", flag: "🇺🇦" },
  Turkey: { code: "TR", flag: "🇹🇷" },
  Bangladesh: { code: "BD", flag: "🇧🇩" },
  Poland: { code: "PL", flag: "🇵🇱" },
  Austria: { code: "AT", flag: "🇦🇹" },
  Thailand: { code: "TH", flag: "🇹🇭" },
  Indonesia: { code: "ID", flag: "🇮🇩" },
  Singapore: { code: "SG", flag: "🇸🇬" },
  Malaysia: { code: "MY", flag: "🇲🇾" },
  Philippines: { code: "PH", flag: "🇵🇭" },
  Myanmar: { code: "MM", flag: "🇲🇲" },
  Vietnam: { code: "VN", flag: "🇻🇳" },
  China: { code: "CN", flag: "🇨🇳" },
  Norway: { code: "NO", flag: "🇳🇴" },
  Italy: { code: "IT", flag: "🇮🇹" },
  Japan: { code: "JP", flag: "🇯🇵" },
  France: { code: "FR", flag: "🇫🇷" },
  Lebanon: { code: "LB", flag: "🇱🇧" },
  Iran: { code: "IR", flag: "🇮🇷" },
  Chile: { code: "CL", flag: "🇨🇱" },
  Belgium: { code: "BE", flag: "🇧🇪" },
};

const EXTRA_COUNTRIES = [
  "China",
  "Norway",
  "Italy",
  "Japan",
  "France",
  "Lebanon",
  "Iran",
  "Chile",
  "Belgium",
];

export const DEFAULT_COUNTRY_OPTIONS = [
  DEFAULT_REGION,
  ...TRADE_REGION_LABELS.filter((name) => name !== DEFAULT_REGION),
  ...EXTRA_COUNTRIES,
];

export function getCountryMeta(name: string): { code: string; flag: string } {
  if (COUNTRY_META[name]) return COUNTRY_META[name];
  const code = resolveCountryCode(name) ?? name.slice(0, 2).toUpperCase();
  return { code, flag: isoCodeToEmoji(code) };
}

export function getCircleFlagUrl(nameOrCode: string): string | null {
  if (COUNTRY_META[nameOrCode]) {
    return getCircleFlagUrlFromCode(COUNTRY_META[nameOrCode].code);
  }
  const code = resolveCountryCode(nameOrCode);
  if (!code) return null;
  return getCircleFlagUrlFromCode(code);
}

export function getDefaultCountriesWithFlags(): CountryOption[] {
  return DEFAULT_COUNTRY_OPTIONS.map((name) => {
    const meta = getCountryMeta(name);
    return { name, code: meta.code, flag: meta.flag };
  });
}

export function getSelectableCountries(): CountryOption[] {
  return mergeCountryLists(DEFAULT_COUNTRY_OPTIONS).map((name) => {
    const meta = getCountryMeta(name);
    return { name, code: meta.code, flag: meta.flag };
  });
}

export function mergeCountryLists(...lists: (string | undefined | null)[][]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const list of lists) {
    for (const raw of list) {
      const name = raw?.trim();
      if (!name) continue;
      const key = name.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      result.push(name);
    }
  }
  return result.sort((a, b) => a.localeCompare(b));
}
