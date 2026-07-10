/** Structured product detail fields stored in Product.specifications JSON */

export type ProductSpecs = {
  // Product Details
  varietyName?: string;
  productCode?: string;
  cultivationType?: string;
  grade?: string;
  shelfLife?: string;
  // About
  aboutVariety?: string;
  // Stock Dimensions
  packagingType?: string;
  packagingWeight?: string;
  unitsPerPackaging?: string;
  packagingPerTon?: string;
  packagingPerContainer?: string;
  // Quick Details
  pricePerKg?: string;
  pricePerPackaging?: string;
  sellingRange?: string;
  storage?: string;
  temperature?: string;
  halalStatus?: string;
  hasTechSpecSheet?: string;
  // Shipping
  shippingFrom?: string;
  shippingMode?: string;
  port?: string;
  containerType?: string;
  incoterm?: string;
  leadTimeDays?: string;
  // Additional
  hsCode?: string;
  storageTemperature?: string;
  transportTemperature?: string;
  productType?: string;
};

export const PRODUCT_SPEC_SECTIONS: {
  key: keyof ProductSpecs;
  label: string;
  section:
    | "details"
    | "about"
    | "stock"
    | "quick"
    | "shipping"
    | "additional";
  placeholder?: string;
}[] = [
  { key: "varietyName", label: "Variety Name", section: "details", placeholder: "e.g. Standard White" },
  { key: "productCode", label: "Product Code", section: "details", placeholder: "e.g. FV00438" },
  { key: "cultivationType", label: "Cultivation Type", section: "details", placeholder: "e.g. Processed" },
  { key: "grade", label: "Grade", section: "details", placeholder: "e.g. A" },
  { key: "shelfLife", label: "Shelf Life", section: "details", placeholder: "e.g. 90 days" },
  { key: "aboutVariety", label: "About the Variety", section: "about", placeholder: "Short description of the variety" },
  { key: "packagingType", label: "Packaging Type", section: "stock", placeholder: "e.g. Carton" },
  { key: "packagingWeight", label: "Packaging Weight", section: "stock", placeholder: "e.g. 19.44" },
  { key: "unitsPerPackaging", label: "Units per Packaging", section: "stock", placeholder: "e.g. 360" },
  { key: "packagingPerTon", label: "Packaging Qty per Ton", section: "stock", placeholder: "e.g. 51.4" },
  { key: "packagingPerContainer", label: "Packaging Qty per Container", section: "stock", placeholder: "e.g. 1312" },
  { key: "pricePerKg", label: "Price per Kg", section: "quick", placeholder: "e.g. 2.2" },
  { key: "pricePerPackaging", label: "Price per Packaging", section: "quick", placeholder: "e.g. 37.97" },
  { key: "sellingRange", label: "Selling Range", section: "quick", placeholder: "e.g. Core" },
  { key: "storage", label: "Storage", section: "quick", placeholder: "e.g. CHILLED" },
  { key: "temperature", label: "Temperature", section: "quick", placeholder: "e.g. CHILLED" },
  { key: "halalStatus", label: "Halal Status", section: "quick", placeholder: "Yes / No" },
  { key: "hasTechSpecSheet", label: "Tech Spec Sheet", section: "quick", placeholder: "Yes / No" },
  { key: "shippingFrom", label: "Shipping From", section: "shipping", placeholder: "e.g. India" },
  { key: "shippingMode", label: "Shipping Mode", section: "shipping", placeholder: "e.g. SHIP" },
  { key: "port", label: "Port", section: "shipping", placeholder: "e.g. Cochin" },
  { key: "containerType", label: "Container Type", section: "shipping", placeholder: "e.g. Reefer" },
  { key: "incoterm", label: "INCOTERM", section: "shipping", placeholder: "e.g. DDP" },
  { key: "leadTimeDays", label: "Lead Time (days)", section: "shipping", placeholder: "e.g. 21" },
  { key: "hsCode", label: "HS Code", section: "additional", placeholder: "e.g. 04072100" },
  { key: "storageTemperature", label: "Storage Temperature", section: "additional", placeholder: "e.g. 4°C" },
  { key: "transportTemperature", label: "Transportation Temperature", section: "additional", placeholder: "e.g. 1°C" },
  { key: "productType", label: "Product Type", section: "additional", placeholder: "e.g. Non-DG" },
];

export function parseProductSpecs(
  raw?: Record<string, string> | null,
): ProductSpecs {
  if (!raw || typeof raw !== "object") return {};
  const specs: ProductSpecs = {};
  for (const field of PRODUCT_SPEC_SECTIONS) {
    const value = raw[field.key];
    if (value != null && String(value).trim() !== "") {
      specs[field.key] = String(value);
    }
  }
  return specs;
}

export function specsToRecord(specs: ProductSpecs): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(specs)) {
    if (v != null && String(v).trim() !== "") out[k] = String(v).trim();
  }
  return out;
}

export function hasAnySpec(specs: ProductSpecs, keys: (keyof ProductSpecs)[]) {
  return keys.some((k) => specs[k] && String(specs[k]).trim() !== "");
}
