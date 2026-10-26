import { MessageCircle, Palette, Ruler, ShieldCheck } from "lucide-react";
import { Container } from "@/components/layout/container";

const ITEMS = [
  { Icon: MessageCircle, title: "اطلب عبر واتساب", text: "رسالة جاهزة بتفاصيل طلبك بضغطة واحدة." },
  { Icon: Ruler, title: "اختر مقاسك بسهولة", text: "مقاسات متعددة لكل موديل بوضوح." },
  { Icon: Palette, title: "ألوان متنوعة", text: "تشكيلة ألوان تناسب كل ذوق." },
  { Icon: ShieldCheck, title: "تواصل مباشر", text: "نؤكد معك التوفر والسعر قبل الطلب." },
];

export function Features() {
  return (
    <section aria-label="مزايا التسوق" className="border-b border-line bg-white">
      <Container className="grid grid-cols-2 gap-6 py-8 lg:grid-cols-4">
        {ITEMS.map(({ Icon, title, text }) => (
          <div key={title} className="flex items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-sand">
              <Icon className="h-5 w-5" />
            </span>
            <div>
              <h3 className="text-[15px] font-bold">{title}</h3>
              <p className="mt-0.5 hidden text-sm leading-relaxed text-mute sm:block">{text}</p>
            </div>
          </div>
        ))}
      </Container>
    </section>
  );
}
