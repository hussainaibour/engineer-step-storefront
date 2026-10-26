import type { ProductFilters, ProductSortOption } from "@/lib/types";

export const SHOP_PAGE_SIZE = 12;

type Params = Record<string, string | string[] | undefined>;

function read(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function num(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

export function parseProductFilters(params: Params): ProductFilters {
  const sortRaw = read(params.sort);
  const sort: ProductSortOption =
    sortRaw === "price-asc" || sortRaw === "price-desc" || sortRaw === "newest" ? sortRaw : "newest";
  return {
    categorySlug: read(params.category),
    search: read(params.q),
    minPrice: num(read(params.min)),
    maxPrice: num(read(params.max)),
    sizes: read(params.sizes)?.split(",").filter(Boolean),
    colors: read(params.colors)?.split(",").filter(Boolean),
    inStockOnly: read(params.instock) === "1",
    onSaleOnly: read(params.sale) === "1",
    sort,
  };
}

export function getPageParam(params: Params): number {
  const page = Number(read(params.page) ?? 1);
  return Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
}

export function paginate<T>(items: T[], page: number, pageSize: number): T[] {
  const start = (page - 1) * pageSize;
  return items.slice(start, start + pageSize);
}

export function totalPages(count: number, pageSize: number): number {
  return Math.max(1, Math.ceil(count / pageSize));
}
