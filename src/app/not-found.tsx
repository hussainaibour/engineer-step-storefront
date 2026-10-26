import { Container } from "@/components/layout/container";
import { LinkButton } from "@/components/ui/button";

export default function NotFound() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p dir="ltr" className="text-[7rem] font-extrabold leading-none tracking-tighter text-ink/10">404</p>
      <h1 className="mt-2 text-3xl font-extrabold">الصفحة غير موجودة</h1>
      <p className="mt-3 max-w-md leading-loose text-mute">ربما تم نقل الصفحة أو حذفها. تابع التسوق من المتجر.</p>
      <div className="mt-8 flex gap-3">
        <LinkButton href="/">الرئيسية</LinkButton>
        <LinkButton href="/shop" variant="secondary">المتجر</LinkButton>
      </div>
    </Container>
  );
}
