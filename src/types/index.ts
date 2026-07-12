export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  productCount: number;
  subcategories: SubCategory[];
}

export interface SubCategory {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  image?: string;
}

export interface Supplier {
  id: string;
  name: string;
  slug: string;
  logo: string;
  country: string;
  description: string;
  productCount: number;
  rating: number;
  verified: boolean;
  specialties: string[];
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  images: string[];
  mainImage?: string;
  subImages?: string[];
  displayImage?: string;
  price: number;
  currency: string;
  moq: number;
  moqUnit: string;
  country: string;
  categoryId: string;
  categoryName: string;
  categorySlug?: string;
  subCategoryId?: string;
  subCategoryName?: string;
  subCategorySlug?: string;
  supplierId: string;
  supplierName: string;
  featured?: boolean;
  popular?: boolean;
  isNew?: boolean;
  isActive?: boolean;
  soldOut?: boolean;
  specifications?: Record<string, string>;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  image: string;
  /** Optional portrait / mobile crop — falls back to `image` */
  mobileImage?: string;
  accent: "navy" | "red" | "green" | "orange";
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  avatar: string;
  rating: number;
}

export interface Country {
  id: string;
  name: string;
  code: string;
  flag: string;
  supplierCount: number;
}

export interface SearchResult {
  products: Product[];
  categories: Category[];
  suppliers: Supplier[];
  total: number;
}

export interface ProductFilters {
  category?: string;
  subCategory?: string;
  country?: string;
  supplier?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  popular?: boolean;
  featured?: boolean;
  isNew?: boolean;
  page?: number;
  limit?: number;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}
