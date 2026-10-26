import type { CartItem, Product } from "@/lib/types";
import { BRAND_NAME_AR } from "@/lib/brand";
import { formatPrice } from "@/lib/utils";

export function buildWhatsAppOrderMessage(items: CartItem[], note?: string): string {
  const lines: string[] = [`مرحباً ${BRAND_NAME_AR}،`, "أرغب بإتمام الطلب التالي:", ""];
  items.forEach((item, i) => {
    lines.push(
      `${i + 1}. ${item.name}`,
      `   المقاس: ${item.size}`,
      item.color ? `   اللون: ${item.color}` : "",
      `   الكمية: ${item.quantity}`,
      `   السعر: ${formatPrice(item.price)}`,
      `   المجموع: ${formatPrice(item.price * item.quantity)}`,
      "",
    );
  });
  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);
  lines.push(`الإجمالي التقريبي: ${formatPrice(total)}`);
  if (note?.trim()) lines.push("", "ملاحظات:", note.trim());
  return lines.filter((l, i, a) => l !== "" || a[i - 1] !== "").join("\n");
}

export function buildSingleProductOrderMessage(input: {
  product: Product;
  size: string;
  color?: string;
  quantity: number;
  productUrl?: string;
}): string {
  const { product, size, color, quantity, productUrl } = input;
  return [
    `مرحباً ${BRAND_NAME_AR}،`,
    "أرغب بطلب المنتج التالي:",
    "",
    product.name,
    product.modelSku ? `الموديل: ${product.modelSku}` : "",
    productUrl ? `الرابط: ${productUrl}` : "",
    `المقاس: ${size}`,
    color ? `اللون: ${color}` : "",
    `الكمية: ${quantity}`,
    `السعر: ${formatPrice(product.price)}`,
    `المجموع: ${formatPrice(product.price * quantity)}`,
  ]
    .filter(Boolean)
    .join("\n");
}

const digits = (n?: string) => n?.replace(/\D/g, "") ?? "";

export function getWhatsAppOrderUrl(items: CartItem[], note: string, number: string): string | null {
  const n = digits(number);
  if (!n || items.length === 0) return null;
  return `https://wa.me/${n}?text=${encodeURIComponent(buildWhatsAppOrderMessage(items, note))}`;
}

export function getWhatsAppSingleProductUrl(input: {
  product: Product;
  size: string;
  color?: string;
  quantity: number;
  number: string;
  productUrl?: string;
}): string | null {
  const n = digits(input.number);
  if (!n) return null;
  return `https://wa.me/${n}?text=${encodeURIComponent(buildSingleProductOrderMessage(input))}`;
}
