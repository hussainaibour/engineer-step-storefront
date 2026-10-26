import type { Product } from "@/lib/types";

export function hasActiveDiscount(product: Product): boolean {
  return (
    product.originalPrice != null &&
    Number.isFinite(product.originalPrice) &&
    product.originalPrice > 0 &&
    product.originalPrice > product.price
  );
}

export function getDiscountPercent(product: Product): number | null {
  if (!hasActiveDiscount(product) || product.originalPrice == null) return null;
  const pct = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  return pct > 0 ? pct : null;
}

export function collectUniqueSizes(products: Product[]): string[] {
  const set = new Set<string>();
  products.forEach((p) => p.sizes.forEach((s) => s.trim() && set.add(s.trim())));
  return Array.from(set).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
}

export function collectUniqueColors(products: Product[]): string[] {
  const set = new Set<string>();
  products.forEach((p) => p.colors.forEach((c) => c.trim() && set.add(c.trim())));
  return Array.from(set).sort((a, b) => a.localeCompare(b, "ar"));
}

/** يحوّل استجابة Laravel (قد تحتوي null) إلى Product آمن. */
export function normalizeProduct(raw: Partial<Product> & Pick<Product, "id" | "name" | "slug">): Product {
  const original = raw.originalPrice;
  const qty = raw.stockQuantity;
  return {
    id: raw.id,
    name: raw.name,
    slug: raw.slug,
    description: raw.description ?? "",
    price: Number(raw.price ?? 0),
    originalPrice: original != null && Number.isFinite(Number(original)) ? Number(original) : undefined,
    modelSku: raw.modelSku?.trim() ?? "",
    categoryId: raw.categoryId ?? "",
    sizes: Array.isArray(raw.sizes) ? raw.sizes : [],
    colors: Array.isArray(raw.colors) ? raw.colors : [],
    images: Array.isArray(raw.images) ? raw.images : [],
    featured: Boolean(raw.featured),
    newArrival: Boolean(raw.newArrival),
    inStock: raw.inStock !== false,
    stockTracking: Boolean(raw.stockTracking),
    stockQuantity: qty != null && Number.isFinite(Number(qty)) ? Number(qty) : undefined,
    seoTitle: raw.seoTitle ?? "",
    seoDescription: raw.seoDescription ?? "",
    createdAt: raw.createdAt ?? new Date(0).toISOString(),
    updatedAt: raw.updatedAt ?? new Date(0).toISOString(),
    status: raw.status ?? "published",
  };
}
