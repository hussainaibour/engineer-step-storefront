import type { Metadata } from "next";
import { CartView } from "@/components/cart/cart-view";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/ui/section";
import { getSiteConfig } from "@/lib/api";

export const metadata: Metadata = { title: "سلة التسوق" };

export default async function CartPage() {
  const site = await getSiteConfig();
  return (
    <>
      <PageHeader eyebrow="مراجعة الطلب" title="سلة التسوق" />
      <Container className="py-10 md:py-14">
        <CartView whatsappNumber={site.whatsappNumber} />
      </Container>
    </>
  );
}
