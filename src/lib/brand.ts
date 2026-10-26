export const BRAND_NAME = "Engineer Step";
export const BRAND_NAME_AR = "إنجينير ستيب";
export const BRAND_TAGLINE = "أحذية عصرية بتصميم دقيق وراحة تدوم";

/**
 * يمكن استبدال مسار الشعار الرسمي عبر NEXT_PUBLIC_LOGO_PATH.
 * إن كان المسار فارغاً أو تعذر تحميل الصورة يظهر الشعار النصي.
 */
export const LOGO_PATH = process.env.NEXT_PUBLIC_LOGO_PATH ?? "/images/engineer-step-logo.png";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
export const CURRENCY = process.env.NEXT_PUBLIC_CURRENCY ?? "USD";
