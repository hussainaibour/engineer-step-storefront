import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/container";
import { ShopCatalog } from "@/components/shop/shop-catalog";
import { PageHeader } from "@/components/ui/section";
import { getCatalog, getSiteConfig } from "@/lib/api";
import { hasActiveDiscount } from "@/lib/product-utils";

export const metadata: Metadata = { title: "العروض" };

export default async function OffersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [params, site, { products }] = await Promise.all([searchParams, getSiteConfig(), getCatalog()]);
  if (!site.offersEnabled || !products.some(hasActiveDiscount)) notFound();
  return (
    <>
      <PageHeader eyebrow="وفّر أكثر" title="العروض" description="منتجات بأسعار مخفّضة لفترة محدودة. الكميات قد تنفد." />
      <Container className="py-10 md:py-14">
        <ShopCatalog searchParams={params} basePath="/offers" onlyOffers />
      </Container>
    </>
  );
}
