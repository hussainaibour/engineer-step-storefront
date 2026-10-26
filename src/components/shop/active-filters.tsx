"use client";

import { X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import type { Category } from "@/lib/types";

export function ActiveFilters({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const go = (mutate: (p: URLSearchParams) => void) => {
    const next = new URLSearchParams(params.toString());
    mutate(next);
    next.delete("page");
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const chips: { key: string; label: string; remove: () => void }[] = [];
  const q = params.get("q");
  if (q) chips.push({ key: "q", label: `بحث: ${q}`, remove: () => go((p) => p.delete("q")) });

  const cat = params.get("category");
  if (cat) {
    chips.push({
      key: "cat",
      label: categories.find((c) => c.slug === cat)?.name ?? cat,
      remove: () => go((p) => p.delete("category")),
    });
  }
  for (const key of ["sizes", "colors"] as const) {
    const list = params.get(key)?.split(",").filter(Boolean) ?? [];
    list.forEach((v) =>
      chips.push({
        key: `${key}-${v}`,
        label: key === "sizes" ? `مقاس ${v}` : v,
        remove: () =>
          go((p) => {
            const rest = list.filter((x) => x !== v);
            if (rest.length) p.set(key, rest.join(","));
            else p.delete(key);
          }),
      }),
    );
  }
  const min = params.get("min");
  if (min) chips.push({ key: "min", label: `من ${formatPrice(Number(min))}`, remove: () => go((p) => p.delete("min")) });
  const max = params.get("max");
  if (max) chips.push({ key: "max", label: `إلى ${formatPrice(Number(max))}`, remove: () => go((p) => p.delete("max")) });
  if (params.get("instock") === "1") chips.push({ key: "stock", label: "المتوفر فقط", remove: () => go((p) => p.delete("instock")) });
  if (params.get("sale") === "1") chips.push({ key: "sale", label: "مخفّض", remove: () => go((p) => p.delete("sale")) });

  if (chips.length === 0) return null;
  return (
    <div className="mb-6 flex flex-wrap gap-2">
      {chips.map((c) => (
        <button
          key={c.key}
          type="button"
          onClick={c.remove}
          className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-1.5 text-sm font-semibold text-white"
        >
          {c.label}
          <X className="h-3.5 w-3.5" aria-label="إزالة" />
        </button>
      ))}
    </div>
  );
}
