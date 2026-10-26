import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { ShopCatalog } from "@/components/shop/shop-catalog";
import { PageHeader } from "@/components/ui/section";

export const metadata: Metadata = { title: "المتجر" };

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const q = Array.isArray(params.q) ? params.q[0] : params.q;
  return (
    <>
      <PageHeader
        eyebrow="المتجر"
        title={q ? `نتائج البحث: ${q}` : "كل المنتجات"}
        description="تصفّح التشكيلة كاملة وصفِّ النتائج حسب التصنيف والمقاس واللون والسعر."
      />
      <Container className="py-10 md:py-14">
        <ShopCatalog searchParams={params} basePath="/shop" />
      </Container>
    </>
  );
}
