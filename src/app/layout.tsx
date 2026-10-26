import type { Metadata, Viewport } from "next";
import "@fontsource/cairo/400.css";
import "@fontsource/cairo/500.css";
import "@fontsource/cairo/600.css";
import "@fontsource/cairo/700.css";
import "@fontsource/cairo/800.css";
import { FloatingWhatsApp } from "@/components/layout/floating-whatsapp";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { CartProvider } from "@/context/cart-context";
import { getSiteConfig } from "@/lib/api";
import { BRAND_NAME, BRAND_NAME_AR, BRAND_TAGLINE, SITE_URL } from "@/lib/brand";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${BRAND_NAME_AR} | ${BRAND_TAGLINE}`, template: `%s | ${BRAND_NAME_AR}` },
  description: `${BRAND_NAME_AR} — ${BRAND_TAGLINE}. تسوّق أحدث التصاميم واطلب بسهولة عبر واتساب.`,
  icons: {
    icon: "/images/engineer-step-favicon.png",
    shortcut: "/images/engineer-step-favicon.png",
    apple: "/images/engineer-step-favicon.png",
  },
  openGraph: { type: "website", locale: "ar_AR", siteName: BRAND_NAME },
};

export const viewport: Viewport = { themeColor: "#faf8f5", width: "device-width", initialScale: 1 };

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const site = await getSiteConfig();
  return (
    <html lang="ar" dir="rtl">
      <body className="flex min-h-dvh flex-col">
        <CartProvider>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
          <FloatingWhatsApp number={site.whatsappNumber} />
        </CartProvider>
      </body>
    </html>
  );
}
