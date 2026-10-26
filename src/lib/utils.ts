import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { CURRENCY } from "@/lib/brand";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const SYMBOLS: Record<string, string> = {
  USD: "$", EUR: "€", GBP: "£", SAR: "ر.س", AED: "د.إ", SYP: "ل.س", TRY: "₺", EGP: "ج.م", JOD: "د.أ", KWD: "د.ك", QAR: "ر.ق",
};

/** تنسيق السعر: رقم لاتيني + رمز العملة (NEXT_PUBLIC_CURRENCY). */
export function formatPrice(amount: number): string {
  const num = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount);
  const symbol = SYMBOLS[CURRENCY.toUpperCase()] ?? CURRENCY;
  // ‎ يمنع انقلاب ترتيب الرقم والرمز داخل النص العربي
  return symbol === "$" || symbol === "€" || symbol === "£" ? `\u200E${symbol}${num}` : `${num} ${symbol}`;
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("ar-u-nu-latn").format(value);
}

/** يسمح فقط بروابط http(s) أو مسارات داخلية */
export function safeHref(value: string | undefined | null): string | null {
  const v = value?.trim();
  if (!v) return null;
  if (v.startsWith("/") && !v.startsWith("//")) return v;
  return /^https?:\/\//i.test(v) ? v : null;
}
