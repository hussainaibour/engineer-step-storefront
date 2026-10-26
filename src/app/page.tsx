import Link from "next/link";
import { ArrowLeft, MessageCircle, Sparkles } from "lucide-react";
import { Features } from "@/components/home/features";
import { CategoryTile } from "@/components/home/category-tiles";
import { Hero } from "@/components/home/hero";
import { Container } from "@/components/layout/container";
import { ProductGrid } from "@/components/products/product-card";
import { LinkButton } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionHeading } from "@/components/ui/section";
import { getCatalog, getSiteConfig } from "@/lib/api";
import { hasActiveDiscount } from "@/lib/product-utils";
import { safeHref } from "@/lib/utils";

export default async function HomePage() {
  const [{ categories, products }, site] = await Promise.all([getCatalog(), getSiteConfig()]);

  const byDate = (a: { createdAt: string }, b: { createdAt: string }) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();

  const newest = products.filter((p) => p.newArrival).sort(byDate).slice(0, 4);
  const featured = products.filter((p) => p.featured).slice(0, 4);
  const offers = products.filter(hasActiveDiscount).slice(0, 4);
  const featuredCategories = categories.filter((c) => c.featured);
  const tiles = (featuredCategories.length ? featuredCategories : categories).slice(0, 3);
  const counts = new Map(categories.map((c) => [c.id, products.filter((p) => p.categoryId === c.id).length]));

  const banner = site.promotionalBanner;
  const bannerHref = safeHref(banner.linkUrl);
  const empty = products.length === 0 && categories.length === 0;

  return (
    <>
      <Hero site={site} />
      <Features />

      {tiles.length > 0 ? (
        <section className="py-16 md:py-24">
          <Container>
            <SectionHeading eyebrow="تسوّق حسب الفئة" title="التصنيفات" href="/categories" />
            <div className="grid gap-5 md:grid-cols-3">
              {tiles.map((c) => (
                <CategoryTile key={c.id} category={c} count={counts.get(c.id)} />
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      {newest.length > 0 ? (
        <section className="pb-16 md:pb-24">
          <Container>
            <SectionHeading eyebrow="وصل حديثاً" title="أحدث المنتجات" href="/shop" />
            <ProductGrid products={newest} categories={categories} />
          </Container>
        </section>
      ) : null}

      {banner.enabled && banner.title.trim() ? (
        <section className="pb-16 md:pb-24">
          <Container>
            <div className="relative overflow-hidden rounded-[2rem] bg-ink px-8 py-12 text-white md:px-14 md:py-16">
              <div
                aria-hidden
                className="absolute inset-0 opacity-[0.1]"
                style={{ backgroundImage: "repeating-linear-gradient(135deg, #fff 0, #fff 1px, transparent 1px, transparent 18px)" }}
              />
              <div className="relative flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
                <div className="max-w-2xl">
                  <Sparkles className="mb-4 h-6 w-6 text-white/70" />
                  <h2 className="text-3xl font-extrabold leading-tight md:text-4xl">{banner.title}</h2>
                  {banner.description ? <p className="mt-3 text-base leading-loose text-white/70">{banner.description}</p> : null}
                </div>
                {bannerHref && banner.linkLabel ? (
                  <LinkButton href={bannerHref} variant="secondary" size="lg" className="shrink-0">
                    {banner.linkLabel} <ArrowLeft className="h-5 w-5" />
                  </LinkButton>
                ) : null}
              </div>
            </div>
          </Container>
        </section>
      ) : null}

      {featured.length > 0 ? (
        <section className="pb-16 md:pb-24">
          <Container>
            <SectionHeading eyebrow="اخترناها لك" title="منتجات مميزة" href="/shop" />
            <ProductGrid products={featured} categories={categories} />
          </Container>
        </section>
      ) : null}

      {site.offersEnabled && offers.length > 0 ? (
        <section className="bg-sand py-16 md:py-24">
          <Container>
            <SectionHeading eyebrow="وفّر أكثر" title="العروض" href="/offers" hrefLabel="كل العروض" />
            <ProductGrid products={offers} categories={categories} />
          </Container>
        </section>
      ) : null}

      {empty ? (
        <Container className="py-16">
          <EmptyState
            icon={<Sparkles className="h-6 w-6" />}
            title="مجموعتك تبدأ من هنا"
            description="أضف التصنيفات والمنتجات من لوحة التحكم وستظهر هنا تلقائياً."
          />
        </Container>
      ) : null}

      <section className="py-16 md:py-24">
        <Container>
          <div className="grid gap-8 rounded-[2rem] border border-line bg-white p-8 md:grid-cols-[1fr_auto] md:items-center md:p-12">
            <div>
              <h2 className="text-2xl font-extrabold md:text-3xl">تحتاج مساعدة في اختيار المقاس؟</h2>
              <p className="mt-2 max-w-xl leading-loose text-mute">
                فريقنا جاهز للإجابة عن استفساراتك حول المنتجات والمقاسات والطلبات.
              </p>
            </div>
            {site.whatsappNumber ? (
              <LinkButton href={`https://wa.me/${site.whatsappNumber}`} external variant="whatsapp" size="lg">
                <MessageCircle className="h-5 w-5" /> راسلنا على واتساب
              </LinkButton>
            ) : (
              <Link
                href="/contact"
                className="inline-flex h-13 items-center justify-center rounded-full bg-ink px-8 font-semibold text-white"
              >
                تواصل معنا
              </Link>
            )}
          </div>
        </Container>
      </section>
    </>
  );
}
