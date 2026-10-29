"use client";

import Link from "next/link";
import { MessageCircle, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { Button, LinkButton } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Label, Textarea } from "@/components/ui/fields";
import { useCart } from "@/context/cart-context";
import { formatPrice } from "@/lib/utils";
import { getWhatsAppOrderUrl } from "@/lib/whatsapp";

export function CartView({ whatsappNumber }: { whatsappNumber: string }) {
  const { items, hydrated, subtotal, setQuantity, removeItem, clearCart } = useCart();
  const [note, setNote] = useState("");
  const url = useMemo(() => getWhatsAppOrderUrl(items, note, whatsappNumber), [items, note, whatsappNumber]);

  if (!hydrated) return <div className="h-64 animate-pulse rounded-3xl bg-sand" />;

  if (items.length === 0) {
    return (
      <EmptyState
        icon={<ShoppingBag className="h-6 w-6" />}
        title="سلتك فارغة"
        description="تصفّح المتجر وأضف الأحذية التي تعجبك، ثم أرسل طلبك عبر واتساب بضغطة واحدة."
        action={<LinkButton href="/shop">تصفّح المتجر</LinkButton>}
      />
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_24rem]">
      <ul className="space-y-4">
        {items.map((item) => {
          const key = { productId: item.productId, size: item.size, color: item.color };
          return (
            <li
              key={`${item.productId}|${item.size}|${item.color ?? ""}`}
              className="grid grid-cols-[5.5rem_1fr_auto] gap-4 rounded-2xl border border-line bg-white p-4 md:grid-cols-[7rem_1fr_auto] md:gap-6"
            >
              <Link href={`/product/${item.slug}`} className="aspect-[4/5] overflow-hidden rounded-xl bg-sand">
                {item.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                ) : null}
              </Link>
              <div className="min-w-0">
                <Link href={`/product/${item.slug}`} className="line-clamp-2 font-bold hover:text-ink/70">
                  {item.name}
                </Link>
                <p className="mt-1 text-sm text-mute">
                  المقاس: {item.size}
                  {item.color ? ` · اللون: ${item.color}` : ""}
                </p>
                <p className="mt-2 font-bold">{formatPrice(item.price)}</p>
                <div className="mt-3 inline-flex items-center rounded-full border border-line">
                  <button
                    type="button"
                    aria-label="إنقاص الكمية"
                    onClick={() => setQuantity(key, item.quantity - 1)}
                    className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-sand"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="min-w-8 text-center text-sm font-bold">{item.quantity}</span>
                  <button
                    type="button"
                    aria-label="زيادة الكمية"
                    onClick={() => setQuantity(key, item.quantity + 1)}
                    className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-sand"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              <div className="flex flex-col items-end justify-between">
                <button
                  type="button"
                  aria-label="حذف المنتج"
                  onClick={() => removeItem(key)}
                  className="rounded-full p-2 text-mute hover:bg-sand hover:text-ink"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <p className="font-extrabold">{formatPrice(item.price * item.quantity)}</p>
              </div>
            </li>
          );
        })}
      </ul>

      <aside className="h-fit space-y-5 rounded-3xl border border-line bg-white p-6 shadow-soft lg:sticky lg:top-28">
        <h2 className="text-lg font-extrabold">ملخص الطلب</h2>
        <div className="flex items-center justify-between border-b border-line pb-4">
          <span className="text-mute">المجموع التقريبي</span>
          <span className="text-xl font-extrabold">{formatPrice(subtotal)}</span>
        </div>
        <div>
          <Label htmlFor="order-note">ملاحظات الطلب (اختياري)</Label>
          <Textarea
            id="order-note"
            placeholder="عنوان التوصيل، وقت التواصل المناسب..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
        {url ? (
          <LinkButton href={url} external variant="whatsapp" size="lg" className="w-full">
            <MessageCircle className="h-5 w-5" />
            إرسال الطلب عبر واتساب
          </LinkButton>
        ) : (
          <p className="rounded-xl bg-sand p-3 text-sm text-mute">الطلب عبر واتساب غير مفعّل حالياً. يرجى التواصل مع المتجر.</p>
        )}
        <p className="text-xs leading-relaxed text-mute">
          سيفتح واتساب برسالة جاهزة تراجعها قبل الإرسال. يتم تأكيد السعر والتوفر مع المتجر.
        </p>
        <Button variant="ghost" className="w-full" onClick={clearCart}>
          إفراغ السلة
        </Button>
      </aside>
    </div>
  );
}
