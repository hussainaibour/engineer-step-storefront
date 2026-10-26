export type PublicationStatus = "draft" | "published";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  coverImage?: string;
  featured: boolean;
  displayOrder: number;
  status: PublicationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  modelSku: string;
  categoryId: string;
  sizes: string[];
  colors: string[];
  images: string[];
  featured: boolean;
  newArrival: boolean;
  inStock: boolean;
  stockTracking: boolean;
  stockQuantity?: number;
  status: PublicationStatus;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Catalog {
  categories: Category[];
  products: Product[];
}

/** نفس شكل الاستجابة من GET /api/site في Laravel */
export interface SiteConfig {
  whatsappNumber: string;
  offersEnabled: boolean;
  hero: { imageUrl: string; imageAlt: string };
  contact: { email: string; phone: string; address: string; businessHours: string };
  social: { instagram: string; facebook: string; x: string; tiktok: string };
  promotionalBanner: {
    enabled: boolean;
    title: string;
    description: string;
    linkUrl: string;
    linkLabel: string;
  };
}

export type ProductSortOption = "newest" | "price-asc" | "price-desc";

export interface ProductFilters {
  categorySlug?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sizes?: string[];
  colors?: string[];
  inStockOnly?: boolean;
  onSaleOnly?: boolean;
  sort?: ProductSortOption;
}

export interface CartItem {
  productId: string;
  name: string;
  slug: string;
  price: number;
  size: string;
  color?: string;
  quantity: number;
  image?: string;
}
