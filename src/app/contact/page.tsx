import type { Metadata } from "next";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Container } from "@/components/layout/container";
import { LinkButton } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/section";
import { getSiteConfig } from "@/lib/api";
import { safeHref } from "@/lib/utils";

export const metadata: Metadata = { title: "اتصل بنا" };

const SOCIAL = [
  ["instagram", "إنستغرام"],
  ["facebook", "فيسبوك"],
  ["x", "X"],
  ["tiktok", "تيك توك"],
] as const;

export default async function ContactPage() {
  const site = await getSiteConfig();
  const c = site.contact;
  const rows = [
    c.phone && { Icon: Phone, label: "الهاتف", node: <a dir="ltr" href={`tel:${c.phone}`} className="font-semibold hover:underline">{c.phone}</a> },
    c.email && { Icon: Mail, label: "البريد الإلكتروني", node: <a href={`mailto:${c.email}`} className="break-all font-semibold hover:underline">{c.email}</a> },
    c.address && { Icon: MapPin, label: "العنوان", node: <span className="whitespace-pre-line font-semibold">{c.address}</span> },
    c.businessHours && { Icon: Clock, label: "ساعات العمل", node: <span className="whitespace-pre-line font-semibold">{c.businessHours}</span> },
  ].filter(Boolean) as { Icon: typeof Phone; label: string; node: React.ReactNode }[];
  const socials = SOCIAL.map(([k, label]) => ({ label, href: safeHref(site.social[k]) })).filter((s) => s.href);

  return (
    <>
      <PageHeader eyebrow="اتصل بنا" title="يسعدنا سماعك" description="للاستفسار عن المقاسات والتوفر والطلبات، تواصل معنا بإحدى الطرق التالية." />
      <Container className="py-12 md:py-16">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="flex flex-col justify-between gap-8 rounded-3xl bg-ink p-8 text-white md:p-10">
            <div>
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
                <MessageCircle className="h-6 w-6" />
              </span>
              <h2 className="mt-6 text-2xl font-extrabold">أسرع طريقة للتواصل</h2>
              <p className="mt-2 leading-loose text-white/65">راسلنا على واتساب وسنردّ عليك بأقرب وقت.</p>
            </div>
            {site.whatsappNumber ? (
              <LinkButton href={`https://wa.me/${site.whatsappNumber}`} external variant="whatsapp" size="lg" className="w-full">
                ابدأ المحادثة على واتساب
              </LinkButton>
            ) : (
              <p className="rounded-xl bg-white/10 p-4 text-sm text-white/70">رقم واتساب غير مضبوط بعد. يمكن إضافته من لوحة التحكم.</p>
            )}
          </div>

          <div className="rounded-3xl border border-line bg-white p-8 md:p-10">
            {rows.length > 0 ? (
              <dl className="divide-y divide-line">
                {rows.map(({ Icon, label, node }) => (
                  <div key={label} className="flex items-start gap-4 py-5 first:pt-0 last:pb-0">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-sand">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <dt className="text-sm text-mute">{label}</dt>
                      <dd className="mt-0.5 text-[16px]">{node}</dd>
                    </div>
                  </div>
                ))}
              </dl>
            ) : (
              <p className="leading-loose text-mute">لم تُضف بيانات التواصل بعد. يمكن إضافتها من لوحة التحكم ← إعدادات الموقع.</p>
            )}
            {socials.length > 0 ? (
              <div className="mt-8 flex flex-wrap gap-2 border-t border-line pt-6">
                {socials.map((s) => (
                  <a key={s.label} href={s.href!} target="_blank" rel="noopener noreferrer" className="rounded-full border border-line px-5 py-2 text-sm font-semibold hover:border-ink">
                    {s.label}
                  </a>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </Container>
    </>
  );
}
