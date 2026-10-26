import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Check, MessageCircle, X } from "lucide-react";
import { Container } from "@/components/layout/container";
import { AddToCartPanel } from "@/components/products/add-to-cart-panel";
import { ProductGrid } from "@/components/products/product-card";
import { ProductGallery } from "@/components/products/product-gallery";
import { Breadcrumbs, SectionHeading } from "@/components/ui/section";
import { getCatalog, getProductBySlug, getSiteConfig } from "@/lib/api";
import { BRAND_NAME_AR, SITE_URL } from "@/lib/brand";
import { getDiscountPercent, hasActiveDiscount } from "@/lib/product-utils";
import { formatPrice } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProductBySlug((await params).slug);
  if (!product) return { title: "المنتج غير موجود" };
  const description = product.seoDescription || product.description.slice(0, 160) || undefined;
  return {
    title: product.seoTitle || product.name,
    description,
    openGraph: {
      title: product.seoTitle || product.name,
      description,
      images: product.images[0] ? [product.images[0]] : undefined,
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const [product, { categories, products }, site] = await Promise.all([
    getProductBySlug(slug),
    getCatalog(),
    getSiteConfig(),
  ]);
  if (!product) notFound();

  const category = categories.find((c) => c.id === product.categoryId);
  const related = products.filter((p) => p.categoryId === product.categoryId && p.id !== product.id).slice(0, 4);
  const onSale = hasActiveDiscount(product);
  const percent = getDiscountPercent(product);
  const lowStock =
    product.inStock && product.stockTracking && product.stockQuantity != null && product.stockQuantity > 0 && product.stockQuantity <= 5;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images,
    description: product.description,
    sku: product.modelSku || undefined,
    brand: { "@type": "Brand", name: BRAND_NAME_AR },
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/product/${product.slug}`,
      price: product.price,
      availability: product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };

  return (
    <Container className="py-8 md:py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Breadcrumbs
        items={[
          { label: "الرئيسية", href: "/" },
          { label: "المتجر", href: "/shop" },
          ...(category ? [{ label: category.name, href: `/categories/${category.slug}` }] : []),
          { label: product.name },
        ]}
      />

      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
        <ProductGallery images={product.images} productName={product.name} />

        <div className="lg:sticky lg:top-28 lg:self-start">
          {category ? <p className="text-sm font-semibold text-mute">{category.name}</p> : null}
          <h1 className="mt-1 text-3xl font-extrabold leading-tight tracking-tight md:text-4xl">{product.name}</h1>
          {product.modelSku ? (
            <p className="mt-2 text-sm text-mute">
              رمز الموديل: <span dir="ltr" className="font-semibold text-ink">{product.modelSku}</span>
            </p>
          ) : null}

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <p className={`text-3xl font-extrabold ${onSale ? "text-sale" : ""}`}>{formatPrice(product.price)}</p>
            {onSale && product.originalPrice != null ? (
              <>
                <p className="text-lg text-mute line-through">{formatPrice(product.originalPrice)}</p>
                {percent ? <span className="rounded-full bg-sale px-3 py-1 text-sm font-bold text-white">وفّر {percent}%</span> : null}
              </>
            ) : null}
          </div>

          <p className="mt-4 inline-flex items-center gap-2 text-sm font-semibold">
            {product.inStock ? (
              <>
                <Check className="h-4 w-4 text-ok" />
                <span className="text-ok">{lowStock ? `متوفر — بقي ${product.stockQuantity} فقط` : "متوفر"}</span>
              </>
            ) : (
              <>
                <X className="h-4 w-4 text-sale" />
                <span className="text-sale">غير متوفر حالياً</span>
              </>
            )}
          </p>

          {product.description ? (
            <p className="mt-5 whitespace-pre-line text-base leading-loose text-ink/75">{product.description}</p>
          ) : null}

          <div className="my-7 border-t border-line" />
          <AddToCartPanel product={product} whatsappNumber={site.whatsappNumber} />

          {site.whatsappNumber ? (
            <p className="mt-6 flex items-center gap-2 text-sm text-mute">
              <MessageCircle className="h-4 w-4" /> لديك سؤال عن هذا المنتج؟ راسلنا على واتساب.
            </p>
          ) : null}
        </div>
      </div>

      {related.length > 0 ? (
        <section className="mt-20 border-t border-line pt-14">
          <SectionHeading title="منتجات مشابهة" href={category ? `/categories/${category.slug}` : "/shop"} />
          <ProductGrid products={related} categories={categories} />
        </section>
      ) : null}
    </Container>
  );
}
