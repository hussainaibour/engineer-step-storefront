import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/container";
import { ShopCatalog } from "@/components/shop/shop-catalog";
import { Breadcrumbs, PageHeader } from "@/components/ui/section";
import { getCategoryBySlug } from "@/lib/api";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = await getCategoryBySlug((await params).slug);
  return { title: category?.name ?? "التصنيف", description: category?.description || undefined };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();
  const sp = await searchParams;

  return (
    <>
      <PageHeader title={category.name} description={category.description || undefined}>
        <Breadcrumbs items={[{ label: "الرئيسية", href: "/" }, { label: "التصنيفات", href: "/categories" }, { label: category.name }]} />
      </PageHeader>
      <Container className="py-10 md:py-14">
        <ShopCatalog searchParams={sp} basePath={`/categories/${category.slug}`} fixedCategorySlug={category.slug} />
      </Container>
    </>
  );
}
