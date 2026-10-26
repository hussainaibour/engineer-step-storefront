# Engineer Step — واجهة المتجر (Next.js) المرتبطة بـ Laravel

واجهة عربية RTL احترافية، تقرأ كل بياناتها (المنتجات، التصنيفات، الإعدادات، العروض، البانر، واتساب) من لوحة التحكم في Laravel.
لا توجد لوحة إدارة هنا: الإدارة كلها في مشروع Laravel (`/admin`).

## التشغيل
```sh
npm install
cp .env.example .env.local      # عدّل LARAVEL_API_URL
npm run dev                     # http://localhost:3000
```
شغّل Laravel أولاً (`php artisan serve`) ليظهر المحتوى. إن كان الخادم متوقفاً يعرض الموقع حالة فارغة بدل الانهيار.

## الربط مع Laravel
| الواجهة | Laravel |
|---|---|
| `getCatalog()` | `GET /api/catalog` |
| `getSiteConfig()` | `GET /api/site` |
أي تعديل في لوحة التحكم يظهر في الموقع خلال 30 ثانية (`REVALIDATE` في `src/lib/api.ts`).
صور المنتجات تأتي بروابط مطلقة من `APP_URL` في Laravel — تأكد أنه يشير لعنوان الخادم الحقيقي، ونفّذ `php artisan storage:link`.

## المتغيرات (`.env.local`)
- `LARAVEL_API_URL` — مثال `http://localhost:8000/api`
- `NEXT_PUBLIC_CURRENCY` — USD / SAR / AED / SYP ...
- `NEXT_PUBLIC_SITE_URL` — عنوان الموقع العام
- `NEXT_PUBLIC_LOGO_PATH` — مسار اختياري للشعار في `public/`؛ افتراضياً يستخدم الموقع `public/images/engineer-step-logo.png`، وإن كان المسار فارغاً أو تعذر تحميل الصورة يظهر شعار نصي.

## الصفحات
`/` الرئيسية · `/shop` المتجر (فلاتر: تصنيف، سعر، مقاس، لون، توفر، تخفيض + ترتيب + ترقيم) · `/categories` و`/categories/[slug]` · `/product/[slug]` (معرض صور، مقاس/لون/كمية، طلب واتساب، SEO + JSON-LD) · `/offers` · `/cart` (طلب كامل عبر واتساب) · `/about` · `/contact` · 404.

## ملاحظات تصميم
- نظام ألوان ثابت (حبر/ورقي دافئ/رملي + أحمر للتخفيض فقط) معرَّف في `src/app/globals.css`.
- خط Cairo (عربي + لاتيني) عبر `@fontsource` — لا يحتاج اتصالاً بـ Google وقت البناء.
- متجاوب بالكامل، قوائم جوال جانبية، فلاتر كـ bottom-sheet، دعم `prefers-reduced-motion`.

## الفحص
```sh
npm run lint && npm run typecheck && npm run build
```
