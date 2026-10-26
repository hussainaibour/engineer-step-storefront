"use client";

import { SlidersHorizontal, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import type { Category } from "@/lib/types";

interface Props {
  categories: Category[];
  sizes: string[];
  colors: string[];
  hideCategories?: boolean;
  maxPrice: number;
  resultCount: number;
}

function useQueryUpdater() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  return {
    params,
    update(changes: Record<string, string | null>) {
      const next = new URLSearchParams(params.toString());
      Object.entries(changes).forEach(([k, v]) => (v ? next.set(k, v) : next.delete(k)));
      next.delete("page");
      const qs = next.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    clear() {
      const next = new URLSearchParams();
      const q = params.get("q");
      if (q) next.set("q", q);
      const qs = next.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
  };
}

export function ShopFilters({ categories, sizes, colors, hideCategories, maxPrice, resultCount }: Props) {
  const [open, setOpen] = useState(false);
  const { params } = useQueryUpdater();
  const activeCount = ["category", "sizes", "colors", "min", "max", "instock", "sale"].filter((k) => params.get(k)).length;

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const panel = (
    <FiltersBody
      categories={categories}
      sizes={sizes}
      colors={colors}
      hideCategories={hideCategories}
      maxPrice={maxPrice}
    />
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-11 items-center gap-2 rounded-full border border-line bg-white px-5 text-sm font-semibold lg:hidden"
      >
        <SlidersHorizontal className="h-4 w-4" />
        تصفية
        {activeCount > 0 ? (
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-ink px-1 text-[11px] text-white">
            {activeCount}
          </span>
        ) : null}
      </button>

      <div className="hidden lg:block">{panel}</div>

      <div className={cn("fixed inset-0 z-[60] lg:hidden", open ? "visible" : "invisible")}>
        <div className={cn("absolute inset-0 bg-ink/50 transition-opacity", open ? "opacity-100" : "opacity-0")} onClick={() => setOpen(false)} />
        <div
          className={cn(
            "absolute inset-x-0 bottom-0 flex max-h-[88vh] flex-col rounded-t-3xl bg-paper transition-transform duration-300",
            open ? "translate-y-0" : "translate-y-full",
          )}
        >
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <h2 className="text-lg font-extrabold">تصفية المنتجات</h2>
            <button type="button" aria-label="إغلاق" onClick={() => setOpen(false)} className="rounded-full border border-line bg-white p-2">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-5 py-5">{panel}</div>
          <div className="border-t border-line p-4">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="h-12 w-full rounded-full bg-ink font-semibold text-white"
            >
              عرض {resultCount} منتج
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function FiltersBody({
  categories,
  sizes,
  colors,
  hideCategories,
  maxPrice,
}: Omit<Props, "resultCount">) {
  const { params, update, clear } = useQueryUpdater();
  const selectedSizes = params.get("sizes")?.split(",").filter(Boolean) ?? [];
  const selectedColors = params.get("colors")?.split(",").filter(Boolean) ?? [];
  const [min, setMin] = useState(params.get("min") ?? "");
  const [max, setMax] = useState(params.get("max") ?? "");

  useEffect(() => {
    setMin(params.get("min") ?? "");
    setMax(params.get("max") ?? "");
  }, [params]);

  const toggle = (key: "sizes" | "colors", list: string[], value: string) => {
    const next = list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
    update({ [key]: next.length ? next.join(",") : null });
  };

  const hasAny = ["category", "sizes", "colors", "min", "max", "instock", "sale"].some((k) => params.get(k));

  return (
    <div className="space-y-8">
      {hasAny ? (
        <button type="button" onClick={clear} className="text-sm font-semibold text-sale underline underline-offset-4">
          مسح كل الفلاتر
        </button>
      ) : null}

      {!hideCategories && categories.length > 0 ? (
        <Group title="التصنيف">
          <div className="flex flex-col gap-1">
            <Option active={!params.get("category")} onClick={() => update({ category: null })}>
              الكل
            </Option>
            {categories.map((c) => (
              <Option key={c.id} active={params.get("category") === c.slug} onClick={() => update({ category: c.slug })}>
                {c.name}
              </Option>
            ))}
          </div>
        </Group>
      ) : null}

      <Group title="السعر">
        <form
          className="flex items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            update({ min: min || null, max: max || null });
          }}
        >
          <input
            inputMode="decimal"
            aria-label="أقل سعر"
            placeholder="من"
            value={min}
            onChange={(e) => setMin(e.target.value.replace(/[^\d.]/g, ""))}
            className="h-10 w-full min-w-0 rounded-xl border border-line bg-white px-3 text-sm focus:border-ink focus:outline-none"
          />
          <span className="text-mute">–</span>
          <input
            inputMode="decimal"
            aria-label="أعلى سعر"
            placeholder={maxPrice ? String(Math.ceil(maxPrice)) : "إلى"}
            value={max}
            onChange={(e) => setMax(e.target.value.replace(/[^\d.]/g, ""))}
            className="h-10 w-full min-w-0 rounded-xl border border-line bg-white px-3 text-sm focus:border-ink focus:outline-none"
          />
          <button type="submit" className="h-10 shrink-0 rounded-xl bg-ink px-4 text-sm font-semibold text-white">
            تطبيق
          </button>
        </form>
      </Group>

      {sizes.length > 0 ? (
        <Group title="المقاس">
          <div className="flex flex-wrap gap-2">
            {sizes.map((s) => (
              <Chip key={s} active={selectedSizes.includes(s)} onClick={() => toggle("sizes", selectedSizes, s)}>
                {s}
              </Chip>
            ))}
          </div>
        </Group>
      ) : null}

      {colors.length > 0 ? (
        <Group title="اللون">
          <div className="flex flex-wrap gap-2">
            {colors.map((c) => (
              <Chip key={c} active={selectedColors.includes(c)} onClick={() => toggle("colors", selectedColors, c)}>
                {c}
              </Chip>
            ))}
          </div>
        </Group>
      ) : null}

      <Group title="التوفر">
        <div className="space-y-3">
          <Check checked={params.get("instock") === "1"} onChange={(v) => update({ instock: v ? "1" : null })}>
            المتوفر فقط
          </Check>
          <Check checked={params.get("sale") === "1"} onChange={(v) => update({ sale: v ? "1" : null })}>
            المنتجات المخفّضة
          </Check>
        </div>
      </Group>
    </div>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="mb-3 text-sm font-extrabold">{title}</h3>
      {children}
    </section>
  );
}

function Option({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-xl px-3 py-2 text-start text-[15px] transition-colors",
        active ? "bg-ink font-semibold text-white" : "hover:bg-sand",
      )}
    >
      {children}
    </button>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "h-10 min-w-11 rounded-xl border px-3 text-sm font-semibold transition-colors",
        active ? "border-ink bg-ink text-white" : "border-line bg-white hover:border-ink",
      )}
    >
      {children}
    </button>
  );
}

function Check({ checked, onChange, children }: { checked: boolean; onChange: (v: boolean) => void; children: React.ReactNode }) {
  return (
    <label className="flex cursor-pointer items-center gap-3 text-[15px]">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-5 w-5 rounded-md border-line accent-ink"
      />
      {children}
    </label>
  );
}
