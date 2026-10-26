"use client";

import { ChevronLeft, ChevronRight, ImageIcon } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function ProductGallery({ images, productName }: { images: string[]; productName: string }) {
  const [active, setActive] = useState(0);
  const count = images.length;
  const go = (d: number) => setActive((i) => (i + d + count) % count);

  return (
    <div className="flex flex-col-reverse gap-4 md:flex-row md:items-start">
      {count > 1 ? (
        <div className="no-scrollbar flex gap-3 overflow-x-auto md:max-h-[34rem] md:w-20 md:flex-col md:overflow-y-auto md:overflow-x-visible">
          {images.map((src, i) => (
            <button
              key={`${src}-${i}`}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`عرض الصورة ${i + 1}`}
              aria-current={active === i}
              className={cn(
                "h-20 w-16 shrink-0 overflow-hidden rounded-xl border-2 bg-sand transition-colors md:h-24 md:w-20",
                active === i ? "border-ink" : "border-transparent opacity-70 hover:opacity-100",
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      ) : null}

      <div className="relative aspect-[4/5] w-full min-w-0 flex-1 overflow-hidden rounded-3xl bg-sand">
        {count > 0 ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={images[active]} alt={productName} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-mute/60">
            <ImageIcon className="h-12 w-12" strokeWidth={1.25} />
            <span className="text-sm font-medium">الصورة قريباً</span>
          </div>
        )}
        {count > 1 ? (
          <>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="الصورة التالية"
              className="absolute end-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-soft hover:bg-white"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="الصورة السابقة"
              className="absolute start-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-soft hover:bg-white"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
}
