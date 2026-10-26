"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function SortSelect() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="hidden font-semibold text-mute sm:inline">الترتيب:</span>
      <select
        value={params.get("sort") ?? "newest"}
        onChange={(e) => {
          const next = new URLSearchParams(params.toString());
          if (e.target.value === "newest") next.delete("sort");
          else next.set("sort", e.target.value);
          next.delete("page");
          const qs = next.toString();
          router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
        }}
        className="h-11 rounded-full border border-line bg-white px-4 text-sm font-semibold focus:border-ink focus:outline-none"
      >
        <option value="newest">الأحدث</option>
        <option value="price-asc">السعر: من الأقل للأعلى</option>
        <option value="price-desc">السعر: من الأعلى للأقل</option>
      </select>
    </label>
  );
}
