"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, ShoppingBag, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Logo } from "@/components/brand/logo";
import { Container } from "@/components/layout/container";
import { HeaderSearch } from "@/components/layout/header-search";
import { useCart } from "@/context/cart-context";
import type { Category } from "@/lib/types";
import { cn } from "@/lib/utils";

interface Props {
  categories: Category[];
  showOffers: boolean;
  announcement?: string;
  whatsappNumber: string;
}

export function SiteHeaderClient({ categories, showOffers, announcement, whatsappNumber }: Props) {
  const { itemCount } = useCart();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const links = [
    { href: "/", label: "الرئيسية" },
    { href: "/shop", label: "المتجر" },
    ...(showOffers ? [{ href: "/offers", label: "العروض", accent: true }] : []),
    { href: "/about", label: "من نحن" },
    { href: "/contact", label: "اتصل بنا" },
  ];
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className="sticky top-0 z-50">
      {announcement ? (
        <div className="bg-ink text-white">
          <Container className="flex min-h-9 items-center justify-center py-1.5 text-center text-[13px] font-medium">
            {announcement}
          </Container>
        </div>
      ) : null}

      <div className="border-b border-line bg-paper/90 backdrop-blur-md">
        <Container className="flex h-[4.5rem] items-center gap-6">
          <Logo />

          <nav aria-label="القائمة الرئيسية" className="hidden flex-1 items-center justify-center gap-1 lg:flex">
            {links.slice(0, 2).map((l) => (
              <NavLink key={l.href} {...l} active={isActive(l.href)} />
            ))}

            <div className="group relative">
              <Link
                href="/categories"
                className={cn(
                  "inline-flex items-center gap-1 rounded-full px-4 py-2 text-[15px] font-semibold transition-colors hover:bg-ink/5",
                  isActive("/categories") && "bg-ink/5",
                )}
              >
                التصنيفات <ChevronDown className="h-3.5 w-3.5 transition-transform group-hover:rotate-180" />
              </Link>
              {categories.length > 0 ? (
                <div className="invisible absolute start-0 top-full z-10 w-60 translate-y-1 pt-2 opacity-0 transition-all group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                  <div className="rounded-2xl border border-line bg-white p-2 shadow-lift">
                    {categories.map((c) => (
                      <Link
                        key={c.id}
                        href={`/categories/${c.slug}`}
                        className="block rounded-xl px-3 py-2.5 text-[15px] font-medium hover:bg-sand"
                      >
                        {c.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>

            {links.slice(2).map((l) => (
              <NavLink key={l.href} {...l} active={isActive(l.href)} />
            ))}
          </nav>

          <div className="ms-auto flex items-center gap-2 lg:ms-0">
            <HeaderSearch className="hidden w-56 xl:block" />
            <Link
              href="/cart"
              aria-label={`سلة التسوق${itemCount ? ` (${itemCount})` : ""}`}
              className="relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white transition-colors hover:border-ink"
            >
              <ShoppingBag className="h-[18px] w-[18px]" />
              {itemCount > 0 ? (
                <span className="absolute -end-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-ink px-1 text-[11px] font-bold text-white">
                  {itemCount}
                </span>
              ) : null}
            </Link>
            <button
              type="button"
              aria-label="فتح القائمة"
              aria-expanded={open}
              onClick={() => setOpen(true)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white lg:hidden"
            >
              <Menu className="h-[18px] w-[18px]" />
            </button>
          </div>
        </Container>
      </div>

      {/* القائمة الجانبية للجوال */}
      <div className={cn("fixed inset-0 z-50 lg:hidden", open ? "visible" : "invisible")} aria-hidden={!open}>
        <div
          className={cn("absolute inset-0 bg-ink/50 transition-opacity", open ? "opacity-100" : "opacity-0")}
          onClick={() => setOpen(false)}
        />
        <aside
          className={cn(
            "absolute inset-y-0 end-0 flex w-[min(22rem,88vw)] flex-col bg-paper shadow-lift transition-transform duration-300",
            open ? "translate-x-0" : "translate-x-full rtl:-translate-x-full",
          )}
        >
          <div className="flex h-[4.5rem] items-center justify-between border-b border-line px-5">
            <Logo />
            <button
              type="button"
              aria-label="إغلاق القائمة"
              onClick={() => setOpen(false)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-5 py-5">
            <HeaderSearch id="mobile-header-search" className="mb-5" />
            <ul className="space-y-1">
              {links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className={cn(
                      "block rounded-xl px-4 py-3 text-base font-semibold",
                      isActive(l.href) ? "bg-ink text-white" : "hover:bg-sand",
                    )}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            {categories.length > 0 ? (
              <>
                <p className="mb-2 mt-6 px-4 text-sm font-semibold text-mute">التصنيفات</p>
                <ul className="space-y-1">
                  {categories.map((c) => (
                    <li key={c.id}>
                      <Link href={`/categories/${c.slug}`} className="block rounded-xl px-4 py-2.5 text-[15px] hover:bg-sand">
                        {c.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
          </div>
          {whatsappNumber ? (
            <div className="border-t border-line p-5">
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-12 items-center justify-center rounded-full bg-[#128c4a] font-semibold text-white"
              >
                تواصل عبر واتساب
              </a>
            </div>
          ) : null}
        </aside>
      </div>
    </header>
  );
}

function NavLink({ href, label, active, accent }: { href: string; label: string; active: boolean; accent?: boolean }) {
  return (
    <Link
      href={href}
      className={cn(
        "rounded-full px-4 py-2 text-[15px] font-semibold transition-colors hover:bg-ink/5",
        active && "bg-ink/5",
        accent && "text-sale",
      )}
    >
      {label}
    </Link>
  );
}
