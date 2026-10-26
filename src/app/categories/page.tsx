import type { Metadata } from "next";
import { Layers } from "lucide-react";
import { CategoryTile } from "@/components/home/category-tiles";
import { Container } from "@/components/layout/container";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/section";
import { getCatalog } from "@/lib/api";

export const metadata: Metadata = { title: "التصنيفات" };

export default async function CategoriesPage() {
  const { categories, products } = await getCatalog();
  return (
    <>
      <PageHeader eyebrow="تسوّق حسب الفئة" title="التصنيفات" description="اختر الفئة التي تناسبك وابدأ التصفح." />
      <Container className="py-10 md:py-14">
        {categories.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((c) => (
              <CategoryTile key={c.id} category={c} count={products.filter((p) => p.categoryId === c.id).length} />
            ))}
          </div>
        ) : (
          <EmptyState icon={<Layers className="h-6 w-6" />} title="لا توجد تصنيفات بعد" description="ستظهر التصنيفات هنا فور إضافتها من لوحة التحكم." />
        )}
      </Container>
    </>
  );
}
