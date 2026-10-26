import { cache } from "react";
import { normalizeProduct } from "@/lib/product-utils";
import type { Catalog, Category, Product, ProductFilters, SiteConfig } from "@/lib/types";
import { hasActiveDiscount } from "@/lib/product-utils";

/**
 * طبقة البيانات: تقرأ من واجهة Laravel (GET /api/catalog و /api/site).
 * أي تعديل من لوحة التحكم يظهر في الموقع خلال REVALIDATE ثانية.
 */
const API_URL = (process.env.LARAVEL_API_URL ?? "http://localhost:8000/api").replace(/\/$/, "");
const REVALIDATE = 30;

export const EMPTY_SITE: SiteConfig = {
  whatsappNumber: "",
  offersEnabled: true,
  hero: { imageUrl: "", imageAlt: "" },
  contact: { email: "", phone: "", address: "", businessHours: "" },
  social: { instagram: "", facebook: "", x: "", tiktok: "" },
  promotionalBanner: { enabled: false, title: "", description: "", linkUrl: "", linkLabel: "" },
};

async function getJson<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_URL}${path}`, {
      headers: { Accept: "application/json" },
      next: { revalidate: REVALIDATE },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null; // الخادم غير متاح: يعرض الموقع حالة فارغة بدل الانهيار
  }
}

export const getCatalog = cache(async (): Promise<Catalog> => {
  const data = await getJson<Partial<Catalog>>("/catalog");
  const categories = (data?.categories ?? []) as Category[];
  const products = ((data?.products ?? []) as Product[]).map((p) => normalizeProduct(p));
  categories.sort((a, b) => a.displayOrder - b.displayOrder || a.name.localeCompare(b.name, "ar"));
  return { categories, products };
});

export const getSiteConfig = cache(async (): Promise<SiteConfig> => {
  const data = await getJson<Partial<SiteConfig>>("/site");
  return {
    ...EMPTY_SITE,
    ...data,
    whatsappNumber: (data?.whatsappNumber ?? "").replace(/\D/g, ""),
    hero: { ...EMPTY_SITE.hero, ...data?.hero },
    contact: { ...EMPTY_SITE.contact, ...data?.contact },
    social: { ...EMPTY_SITE.social, ...data?.social },
    promotionalBanner: { ...EMPTY_SITE.promotionalBanner, ...data?.promotionalBanner },
  };
});

export async function getCategories(): Promise<Category[]> {
  return (await getCatalog()).categories;
}
export async function getProducts(): Promise<Product[]> {
  return (await getCatalog()).products;
}
function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export async function getCategoryBySlug(slug: string): Promise<Category | undefined> {
  const s = safeDecode(slug);
  return (await getCategories()).find((c) => c.slug === s);
}
export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const s = safeDecode(slug);
  return (await getProducts()).find((p) => p.slug === s);
}

export function filterAndSortProducts(
  products: Product[],
  categories: Category[],
  filters: ProductFilters,
): Product[] {
  let result = [...products];
  const categorySlug = filters.categorySlug?.trim();
  const search = filters.search?.trim().toLowerCase();

  if (categorySlug) {
    const category = categories.find((c) => c.slug === categorySlug);
    result = category ? result.filter((p) => p.categoryId === category.id) : [];
  }
  if (search) {
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(search) ||
        p.description.toLowerCase().includes(search) ||
        p.modelSku.toLowerCase().includes(search),
    );
  }
  if (filters.minPrice != null) result = result.filter((p) => p.price >= filters.minPrice!);
  if (filters.maxPrice != null) result = result.filter((p) => p.price <= filters.maxPrice!);
  if (filters.sizes?.length) {
    const set = new Set(filters.sizes.map((s) => s.toUpperCase()));
    result = result.filter((p) => p.sizes.some((s) => set.has(s.toUpperCase())));
  }
  if (filters.colors?.length) {
    const set = new Set(filters.colors.map((c) => c.toLowerCase()));
    result = result.filter((p) => p.colors.some((c) => set.has(c.toLowerCase())));
  }
  if (filters.inStockOnly) result = result.filter((p) => p.inStock);
  if (filters.onSaleOnly) result = result.filter(hasActiveDiscount);

  switch (filters.sort ?? "newest") {
    case "price-asc":
      result.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      result.sort((a, b) => b.price - a.price);
      break;
    default:
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  return result;
}
