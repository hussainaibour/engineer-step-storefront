import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  page: number;
  pages: number;
  basePath: string;
  searchParams: Record<string, string | string[] | undefined>;
}

export function ShopPagination({ page, pages, basePath, searchParams }: Props) {
  if (pages <= 1) return null;

  const href = (p: number) => {
    const qs = new URLSearchParams();
    Object.entries(searchParams).forEach(([k, v]) => {
      const val = Array.isArray(v) ? v[0] : v;
      if (val && k !== "page") qs.set(k, val);
    });
    if (p > 1) qs.set("page", String(p));
    const s = qs.toString();
    return s ? `${basePath}?${s}` : basePath;
  };

  const numbers = Array.from({ length: pages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === pages || Math.abs(p - page) <= 1,
  );

  const base = "flex h-11 min-w-11 items-center justify-center rounded-full border px-3 text-sm font-semibold transition-colors";

  return (
    <nav aria-label="التنقل بين الصفحات" className="mt-12 flex items-center justify-center gap-2">
      {page > 1 ? (
        <Link href={href(page - 1)} aria-label="الصفحة السابقة" className={cn(base, "border-line bg-white hover:border-ink")}>
          <ChevronRight className="h-4 w-4" />
        </Link>
      ) : null}
      {numbers.map((p, i) => (
        <span key={p} className="flex items-center gap-2">
          {i > 0 && p - numbers[i - 1] > 1 ? <span className="text-mute">…</span> : null}
          <Link
            href={href(p)}
            aria-current={p === page ? "page" : undefined}
            className={cn(base, p === page ? "border-ink bg-ink text-white" : "border-line bg-white hover:border-ink")}
          >
            {p}
          </Link>
        </span>
      ))}
      {page < pages ? (
        <Link href={href(page + 1)} aria-label="الصفحة التالية" className={cn(base, "border-line bg-white hover:border-ink")}>
          <ChevronLeft className="h-4 w-4" />
        </Link>
      ) : null}
    </nav>
  );
}
