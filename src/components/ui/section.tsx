import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  href,
  hrefLabel = "عرض الكل",
  className,
}: {
  eyebrow?: string;
  title: string;
  href?: string;
  hrefLabel?: string;
  className?: string;
}) {
  return (
    <div className={cn("mb-8 flex items-end justify-between gap-4", className)}>
      <div>
        {eyebrow ? <p className="mb-1 text-sm font-semibold text-mute">{eyebrow}</p> : null}
        <h2 className="text-2xl font-extrabold tracking-tight md:text-3xl">{title}</h2>
      </div>
      {href ? (
        <Link
          href={href}
          className="group inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-ink/80 hover:text-ink"
        >
          {hrefLabel}
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        </Link>
      ) : null}
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <div className="border-b border-line bg-sand/60">
      <div className="mx-auto w-full max-w-page px-5 py-10 md:px-8 md:py-14">
        {children}
        {eyebrow ? <p className="mb-2 text-sm font-semibold text-mute">{eyebrow}</p> : null}
        <h1 className="text-3xl font-extrabold tracking-tight md:text-5xl">{title}</h1>
        {description ? <p className="mt-3 max-w-2xl text-base leading-relaxed text-mute">{description}</p> : null}
      </div>
    </div>
  );
}

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="مسار التنقل" className="mb-5 flex flex-wrap items-center gap-2 text-sm text-mute">
      {items.map((item, i) => (
        <span key={`${item.label}-${i}`} className="flex items-center gap-2">
          {i > 0 ? <span aria-hidden>/</span> : null}
          {item.href ? (
            <Link href={item.href} className="hover:text-ink">
              {item.label}
            </Link>
          ) : (
            <span className="font-semibold text-ink">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
