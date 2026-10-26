import type { Metadata } from "next";
import { Gem, Footprints, HeartHandshake } from "lucide-react";
import { Container } from "@/components/layout/container";
import { LinkButton } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/section";
import { BRAND_NAME } from "@/lib/brand";

export const metadata: Metadata = { title: "من نحن" };

const VALUES = [
  { Icon: Gem, title: "تصميم مدروس", text: "نختار كل موديل بعناية ليجمع بين الأناقة والبساطة." },
  { Icon: Footprints, title: "راحة يومية", text: "أحذية مصممة لتناسب يومك من الصباح إلى المساء." },
  { Icon: HeartHandshake, title: "تواصل شخصي", text: "نساعدك في اختيار المقاس واللون مباشرة عبر واتساب." },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader eyebrow="من نحن" title="تصميم بنيّة واضحة." />
      <Container className="py-12 md:py-16">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-5 text-lg leading-loose text-ink/75">
            <p>
              <span dir="ltr" className="font-extrabold text-ink">{BRAND_NAME}</span> علامة أحذية تركّز على التصميم المدروس
              والخيارات الواضحة وتجربة تسوّق أكثر قرباً منك.
            </p>
            <p>نؤمن أن الحذاء الجيد يبدأ بتفاصيل دقيقة، وأن الشراء يجب أن يكون بسيطاً: تتصفح، تختار، وتطلب عبر واتساب.</p>
            <div className="pt-4">
              <LinkButton href="/shop" size="lg">تصفّح المنتجات</LinkButton>
            </div>
          </div>
          <div className="grid gap-4">
            {VALUES.map(({ Icon, title, text }) => (
              <div key={title} className="flex gap-4 rounded-3xl border border-line bg-white p-6">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sand">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="font-bold">{title}</h2>
                  <p className="mt-1 text-[15px] leading-relaxed text-mute">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </>
  );
}
