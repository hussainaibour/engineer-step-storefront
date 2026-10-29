import Link from "next/link";
import { Facebook, Instagram, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Container } from "@/components/layout/container";
import { BRAND_NAME, BRAND_TAGLINE } from "@/lib/brand";
import { getCatalog, getSiteConfig } from "@/lib/api";
import { hasActiveDiscount } from "@/lib/product-utils";
import { safeHref } from "@/lib/utils";
import { WHATSAPP_NUMBER } from "@/lib/whatsapp";

const SOCIAL = [
  { key: "x", label: "X", Icon: null },
  { key: "tiktok", label: "تيك توك", Icon: null },
] as const;

const SOCIAL_LINKS = [
  {
    key: "whatsapp",
    label: "واتساب",
    Icon: MessageCircle,
    href: `https://wa.me/${WHATSAPP_NUMBER}`,
  },
  {
    key: "instagram",
    label: "إنستغرام",
    Icon: Instagram,
    href: "https://www.instagram.com/engineer_step_sy?exln=MTYwZzhnbnBnbm9kOQ%3D%3D&utm_source=qr",
  },
  {
    key: "facebook",
    label: "فيسبوك",
    Icon: Facebook,
    href: "https://www.facebook.com/share/1Hxey2RRV4/?mibextid=wwXIfr",
  },
] as const;

export async function SiteFooter() {
  const [{ categories, products }, site] = await Promise.all([getCatalog(), getSiteConfig()]);
  const showOffers = site.offersEnabled && products.some(hasActiveDiscount);
  const socials = [
    ...SOCIAL_LINKS,
    ...SOCIAL.map((s) => ({ ...s, href: safeHref(site.social[s.key]) })).filter((s) => s.href),
  ];

  return (
    <footer className="mt-24 bg-ink text-white">
      <Container className="grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div className="space-y-5">
          <Logo light />
          <p className="max-w-xs text-[15px] leading-relaxed text-white/65">{BRAND_TAGLINE}</p>
          {socials.length > 0 ? (
            <div className="flex gap-2">
              {socials.map(({ key, label, Icon, href }) => (
                <a
                  key={key}
                  href={href!}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="inline-flex h-10 min-w-10 items-center justify-center rounded-full border border-white/20 px-3 text-sm font-semibold transition-colors hover:bg-white hover:text-ink"
                >
                  {Icon ? <Icon className="h-4 w-4" /> : label}
                </a>
              ))}
            </div>
          ) : null}
        </div>

        <FooterColumn title="تسوّق">
          <FooterLink href="/shop">كل المنتجات</FooterLink>
          <FooterLink href="/categories">التصنيفات</FooterLink>
          {showOffers ? <FooterLink href="/offers">العروض</FooterLink> : null}
          <FooterLink href="/cart">سلة التسوق</FooterLink>
        </FooterColumn>

        <FooterColumn title="التصنيفات">
          {categories.slice(0, 6).map((c) => (
            <FooterLink key={c.id} href={`/categories/${c.slug}`}>
              {c.name}
            </FooterLink>
          ))}
          {categories.length === 0 ? <li className="text-sm text-white/45">قريباً</li> : null}
        </FooterColumn>

        <FooterColumn title="تواصل معنا">
          <FooterLink href="/about">من نحن</FooterLink>
          <FooterLink href="/contact">اتصل بنا</FooterLink>
          {site.contact.phone ? (
            <li className="flex items-center gap-2 text-[15px] text-white/70">
              <Phone className="h-4 w-4 shrink-0" />
              <a dir="ltr" href={`tel:${site.contact.phone}`} className="hover:text-white">
                {site.contact.phone}
              </a>
            </li>
          ) : null}
          {site.contact.email ? (
            <li className="flex items-center gap-2 text-[15px] text-white/70">
              <Mail className="h-4 w-4 shrink-0" />
              <a href={`mailto:${site.contact.email}`} className="break-all hover:text-white">
                {site.contact.email}
              </a>
            </li>
          ) : null}
          {site.contact.address ? (
            <li className="flex items-start gap-2 text-[15px] text-white/70">
              <MapPin className="mt-1 h-4 w-4 shrink-0" />
              <span className="whitespace-pre-line">{site.contact.address}</span>
            </li>
          ) : null}
        </FooterColumn>
      </Container>

      <div className="border-t border-white/10">
        <Container className="flex flex-col gap-2 py-6 text-sm text-white/50 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} <span dir="ltr">{BRAND_NAME}</span>. جميع الحقوق محفوظة.
          </p>
        </Container>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-5 text-base font-bold">{title}</h3>
      <ul className="space-y-3">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="text-[15px] text-white/70 transition-colors hover:text-white">
        {children}
      </Link>
    </li>
  );
}
