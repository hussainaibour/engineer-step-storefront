import Link from "next/link";
import { ImageIcon } from "lucide-react";
import { getDiscountPercent, hasActiveDiscount } from "@/lib/product-utils";
import type { Category, Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

export function ProductCard({ product, category }: { product: Product; category?: Category }) {
  const [first, second] = product.images;
  const onSale = hasActiveDiscount(product);
  const percent = getDiscountPercent(product);
  const href = `/product/${product.slug}`;

  return (
    <article className="group flex flex-col">
      <Link
        href={href}
        className="relative block aspect-[4/5] overflow-hidden rounded-2xl bg-sand transition-shadow duration-300 group-hover:shadow-lift"
        aria-label={product.name}
      >
        {first ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={first}
              alt={product.name}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition-all duration-500 group-hover:scale-105"
            />
            {second ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={second}
                alt=""
                loading="lazy"
                aria-hidden
                className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              />
            ) : null}
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-mute/60">
            <ImageIcon className="h-8 w-8" strokeWidth={1.25} />
            <span className="text-xs font-medium">الصورة قريباً</span>
          </div>
        )}

        <div className="absolute start-3 top-3 flex flex-col items-start gap-1.5">
          {onSale && percent ? (
            <span className="rounded-full bg-sale px-2.5 py-0.5 text-xs font-bold text-white">خصم {percent}%</span>
          ) : null}
          {product.newArrival ? (
            <span className="rounded-full bg-ink px-2.5 py-0.5 text-xs font-bold text-white">جديد</span>
          ) : null}
        </div>
        {!product.inStock ? (
          <div className="absolute inset-0 flex items-center justify-center bg-paper/70 backdrop-blur-[1px]">
            <span className="rounded-full bg-white px-4 py-1.5 text-sm font-bold shadow-soft">نفدت الكمية</span>
          </div>
        ) : null}
      </Link>

      <div className="mt-4 space-y-1 px-1">
        {category ? <p className="text-[13px] font-medium text-mute">{category.name}</p> : null}
        <h3 className="line-clamp-2 text-[16px] font-bold leading-snug">
          <Link href={href} className="hover:text-ink/70">
            {product.name}
          </Link>
        </h3>
        <div className="flex items-baseline gap-2 pt-1">
          <span className={`text-[17px] font-extrabold ${onSale ? "text-sale" : ""}`}>{formatPrice(product.price)}</span>
          {onSale && product.originalPrice != null ? (
            <span className="text-sm text-mute line-through">{formatPrice(product.originalPrice)}</span>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export function ProductGrid({
  products,
  categories,
  columns = 4,
}: {
  products: Product[];
  categories: Category[];
  columns?: 3 | 4;
}) {
  const byId = new Map(categories.map((c) => [c.id, c]));
  return (
    <div className={`grid grid-cols-2 gap-x-4 gap-y-9 md:gap-x-6 ${columns === 3 ? "md:grid-cols-3" : "lg:grid-cols-4"}`}>
      {products.map((p) => (
        <ProductCard key={p.id} product={p} category={byId.get(p.categoryId)} />
      ))}
    </div>
  );
}
