import { ArrowLeft, MessageCircle } from "lucide-react";
import { Container } from "@/components/layout/container";
import { LinkButton } from "@/components/ui/button";
import { BRAND_NAME } from "@/lib/brand";
import type { SiteConfig } from "@/lib/types";
import { safeHref } from "@/lib/utils";

export function Hero({ site }: { site: SiteConfig }) {
  const image = safeHref(site.hero.imageUrl);
  return (
    <section className="relative overflow-hidden border-b border-line">
      <Container className="grid items-center gap-10 py-12 md:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <div className="animate-fade-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-1.5 text-sm font-semibold">
            <span className="h-2 w-2 rounded-full bg-ok" /> تشكيلة جديدة متوفرة الآن
          </span>
          <h1 className="mt-6 text-[2.6rem] font-extrabold leading-[1.15] tracking-tight md:text-6xl lg:text-7xl">
            خطوة واثقة،
            <br />
            <span className="text-mute">بتصميم دقيق.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-loose text-mute md:text-lg">
            في <span dir="ltr" className="font-bold text-ink">{BRAND_NAME}</span> نجمع بين التصميم العصري والراحة اليومية. اختر مقاسك ولونك واطلب مباشرة عبر واتساب.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <LinkButton href="/shop" size="lg">
              تسوّق الآن <ArrowLeft className="h-5 w-5" />
            </LinkButton>
            {site.whatsappNumber ? (
              <LinkButton href={`https://wa.me/${site.whatsappNumber}`} external variant="secondary" size="lg">
                <MessageCircle className="h-5 w-5" /> تواصل معنا
              </LinkButton>
            ) : (
              <LinkButton href="/categories" variant="secondary" size="lg">
                تصفّح التصنيفات
              </LinkButton>
            )}
          </div>
        </div>

        <div className="relative animate-fade-up [animation-delay:120ms]">
          <div className="relative aspect-[4/4.4] overflow-hidden rounded-[2rem] bg-ink shadow-lift">
            {image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={image} alt={site.hero.imageAlt || BRAND_NAME} className="absolute inset-0 h-full w-full object-cover" />
            ) : (
              <HeroPlaceholder />
            )}
          </div>
          <div aria-hidden className="absolute -bottom-5 -start-5 -z-10 h-40 w-40 rounded-full bg-sand" />
        </div>
      </Container>
    </section>
  );
}

function HeroPlaceholder() {
  return (
    <div className="absolute inset-0 flex flex-col justify-between p-8 text-white">
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, #fff 0, #fff 1px, transparent 1px, transparent 18px)",
        }}
      />
      <div aria-hidden className="absolute -end-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-2xl" />
      <span dir="ltr" className="relative text-sm font-semibold tracking-[0.3em] text-white/60">
        {BRAND_NAME.toUpperCase()}
      </span>
      <div className="relative">
        <p dir="ltr" className="text-[7rem] font-extrabold leading-none tracking-tighter md:text-[9rem]">
          ES
        </p>
        <p className="mt-2 max-w-[16rem] text-sm leading-relaxed text-white/60">
          يمكنك تغيير هذه الصورة من لوحة التحكم ← إعدادات الموقع.
        </p>
      </div>
    </div>
  );
}
