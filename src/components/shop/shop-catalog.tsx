import { PackageSearch } from "lucide-react";
import { Suspense } from "react";
import { ProductGrid } from "@/components/products/product-card";
import { ActiveFilters } from "@/components/shop/active-filters";
import { ShopFilters } from "@/components/shop/shop-filters";
import { ShopPagination } from "@/components/shop/shop-pagination";
import { SortSelect } from "@/components/shop/sort-select";
import { LinkButton } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { filterAndSortProducts, getCatalog } from "@/lib/api";
import { collectUniqueColors, collectUniqueSizes, hasActiveDiscount } from "@/lib/product-utils";
import { getPageParam, paginate, parseProductFilters, SHOP_PAGE_SIZE, totalPages } from "@/lib/shop-params";
import { formatNumber } from "@/lib/utils";

interface Props {
  searchParams: Record<string, string | string[] | undefined>;
  basePath: string;
  /** يثبّت التصنيف (صفحة تصنيف) */
  fixedCategorySlug?: string;
  /** يقتصر على المنتجات المخفّضة (صفحة العروض) */
  onlyOffers?: boolean;
}

export async function ShopCatalog({ searchParams, basePath, fixedCategorySlug, onlyOffers }: Props) {
  const { categories, products } = await getCatalog();
  const filters = parseProductFilters(searchParams);
  if (fixedCategorySlug) filters.categorySlug = fixedCategorySlug;
  if (onlyOffers) filters.onSaleOnly = true;

  // خيارات الفلاتر تُشتق من نطاق العرض الحالي (التصنيف/العروض)
  const scope = products.filter((p) => {
    if (fixedCategorySlug) {
      const c = categories.find((x) => x.slug === fixedCategorySlug);
      if (!c || p.categoryId !== c.id) return false;
    }
    return onlyOffers ? hasActiveDiscount(p) : true;
  });

  const filtered = filterAndSortProducts(products, categories, filters);
  const pages = totalPages(filtered.length, SHOP_PAGE_SIZE);
  const page = Math.min(getPageParam(searchParams), pages);
  const visible = paginate(filtered, page, SHOP_PAGE_SIZE);
  const maxPrice = scope.reduce((m, p) => Math.max(m, p.price), 0);

  return (
    <div className="grid gap-10 lg:grid-cols-[16rem_1fr]">
      <aside className="lg:sticky lg:top-28 lg:self-start">
        <Suspense fallback={null}>
          <div className="flex items-center justify-between gap-3 lg:block">
            <ShopFilters
              categories={categories}
              sizes={collectUniqueSizes(scope)}
              colors={collectUniqueColors(scope)}
              hideCategories={Boolean(fixedCategorySlug)}
              maxPrice={maxPrice}
              resultCount={filtered.length}
            />
            <div className="lg:hidden">
              <SortSelect />
            </div>
          </div>
        </Suspense>
      </aside>

      <section className="min-w-0">
        <div className="mb-6 flex items-center justify-between gap-4">
          <p className="text-[15px] text-mute">
            <span className="font-bold text-ink">{formatNumber(filtered.length)}</span> منتج
          </p>
          <div className="hidden lg:block">
            <Suspense fallback={null}>
              <SortSelect />
            </Suspense>
          </div>
        </div>

        <Suspense fallback={null}>
          <ActiveFilters categories={categories} />
        </Suspense>

        {visible.length > 0 ? (
          <>
            <ProductGrid products={visible} categories={categories} columns={3} />
            <ShopPagination page={page} pages={pages} basePath={basePath} searchParams={searchParams} />
          </>
        ) : (
          <EmptyState
            icon={<PackageSearch className="h-6 w-6" />}
            title={products.length === 0 ? "المتجر قيد التجهيز" : "لا توجد نتائج مطابقة"}
            description={
              products.length === 0
                ? "سنضيف المنتجات قريباً. تابعنا أو تواصل معنا لمعرفة آخر الجديد."
                : "جرّب تعديل الفلاتر أو البحث بكلمات مختلفة."
            }
            action={products.length > 0 ? <LinkButton href={basePath} variant="outline">مسح الفلاتر</LinkButton> : undefined}
          />
        )}
      </section>
    </div>
  );
}
