import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Category } from "@/lib/types";
import { safeHref } from "@/lib/utils";

export function CategoryTile({ category, count }: { category: Category; count?: number }) {
  const cover = safeHref(category.coverImage);
  return (
    <Link
      href={`/categories/${category.slug}`}
      className="group relative flex aspect-[4/3] overflow-hidden rounded-3xl bg-ink text-white shadow-soft transition-shadow hover:shadow-lift md:aspect-[5/4]"
    >
      {cover ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={cover}
          alt=""
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      ) : (
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.14]"
          style={{ backgroundImage: "repeating-linear-gradient(135deg, #fff 0, #fff 1px, transparent 1px, transparent 16px)" }}
        />
      )}
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />
      <div className="relative mt-auto flex w-full items-end justify-between gap-4 p-6">
        <div>
          <h3 className="text-xl font-extrabold md:text-2xl">{category.name}</h3>
          {count != null ? <p className="mt-0.5 text-sm text-white/70">{count} منتج</p> : null}
        </div>
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-ink transition-transform group-hover:-translate-x-1">
          <ArrowLeft className="h-5 w-5" />
        </span>
      </div>
    </Link>
  );
}
