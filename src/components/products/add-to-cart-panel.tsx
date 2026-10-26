"use client";

import { Check, Minus, Plus, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/cart-context";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";
import { getWhatsAppSingleProductUrl } from "@/lib/whatsapp";

export function AddToCartPanel({ product, whatsappNumber }: { product: Product; whatsappNumber: string }) {
  const { addItem } = useCart();
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const needsSize = product.sizes.length > 0;
  const needsColor = product.colors.length > 0;
  const ready = product.inStock && (!needsSize || Boolean(size)) && (!needsColor || Boolean(color));
  const maxQty = product.stockTracking && product.stockQuantity != null ? Math.max(1, product.stockQuantity) : 99;
  const chosenSize = size || "—";

  const missing = !product.inStock
    ? "هذا المنتج غير متوفر حالياً."
    : needsSize && !size
      ? "اختر المقاس للمتابعة."
      : needsColor && !color
        ? "اختر اللون للمتابعة."
        : null;

  const addToCart = () => {
    if (!ready) return;
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      size: chosenSize,
      color: color || undefined,
      image: product.images[0],
      quantity,
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2200);
  };

  const orderNow = () => {
    if (!ready) return;
    const url = getWhatsAppSingleProductUrl({
      product,
      size: chosenSize,
      color: color || undefined,
      quantity,
      number: whatsappNumber,
      productUrl: `${window.location.origin}/product/${product.slug}`,
    });
    if (url) window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="space-y-6">
      {needsSize ? (
        <fieldset>
          <legend className="mb-3 flex w-full items-center justify-between text-sm font-bold">
            <span>المقاس</span>
            {size ? <span className="font-medium text-mute">المختار: {size}</span> : null}
          </legend>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSize(s)}
                aria-pressed={size === s}
                className={cn(
                  "h-11 min-w-12 rounded-xl border px-4 text-[15px] font-semibold transition-colors",
                  size === s ? "border-ink bg-ink text-white" : "border-line bg-white hover:border-ink",
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </fieldset>
      ) : null}

      {needsColor ? (
        <fieldset>
          <legend className="mb-3 flex w-full items-center justify-between text-sm font-bold">
            <span>اللون</span>
            {color ? <span className="font-medium text-mute">المختار: {color}</span> : null}
          </legend>
          <div className="flex flex-wrap gap-2">
            {product.colors.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                aria-pressed={color === c}
                className={cn(
                  "h-11 rounded-xl border px-5 text-[15px] font-semibold transition-colors",
                  color === c ? "border-ink bg-ink text-white" : "border-line bg-white hover:border-ink",
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </fieldset>
      ) : null}

      <div>
        <p className="mb-3 text-sm font-bold">الكمية</p>
        <div className="inline-flex items-center rounded-full border border-line bg-white">
          <button
            type="button"
            aria-label="إنقاص الكمية"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-sand"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="min-w-10 text-center text-[15px] font-bold" aria-live="polite">
            {quantity}
          </span>
          <button
            type="button"
            aria-label="زيادة الكمية"
            onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
            className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-sand"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="space-y-3 pt-1">
        <Button size="lg" className="w-full" disabled={!ready} onClick={addToCart}>
          {added ? (
            <>
              <Check className="h-5 w-5" /> تمت الإضافة إلى السلة
            </>
          ) : (
            <>
              <ShoppingBag className="h-5 w-5" /> أضف إلى السلة
            </>
          )}
        </Button>
        {whatsappNumber ? (
          <Button size="lg" variant="whatsapp" className="w-full" disabled={!ready} onClick={orderNow}>
            اطلب الآن عبر واتساب
          </Button>
        ) : null}
        {missing ? <p className="text-sm text-mute">{missing}</p> : null}
        {!whatsappNumber ? <p className="text-sm text-mute">الطلب عبر واتساب غير مفعّل حالياً.</p> : null}
      </div>
    </div>
  );
}
