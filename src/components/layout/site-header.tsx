import { SiteHeaderClient } from "@/components/layout/site-header-client";
import { getCatalog, getSiteConfig } from "@/lib/api";
import { hasActiveDiscount } from "@/lib/product-utils";

export async function SiteHeader() {
  const [{ categories, products }, site] = await Promise.all([getCatalog(), getSiteConfig()]);
  const banner = site.promotionalBanner;
  const announcement =
    banner.enabled && banner.title.trim()
      ? banner.title
      : site.contact.businessHours.trim()
        ? `ساعات العمل: ${site.contact.businessHours.replace(/\s*\n\s*/g, " · ")}`
        : undefined;

  return (
    <SiteHeaderClient
      categories={categories}
      showOffers={site.offersEnabled && products.some(hasActiveDiscount)}
      announcement={announcement}
      whatsappNumber={site.whatsappNumber}
    />
  );
}
