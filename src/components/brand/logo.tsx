"use client";

import Link from "next/link";
import { useState } from "react";
import { BRAND_NAME, LOGO_PATH } from "@/lib/brand";
import { cn } from "@/lib/utils";

export function Monogram({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-xl bg-ink text-[13px] font-extrabold tracking-tight text-white",
        className,
      )}
    >
      ES
    </span>
  );
}

export function Logo({ className, light, href = "/" }: { className?: string; light?: boolean; href?: string }) {
  const [failed, setFailed] = useState(!LOGO_PATH);
  return (
    <Link href={href} aria-label={`${BRAND_NAME} - الصفحة الرئيسية`} className={cn("inline-flex items-center gap-3", className)}>
      {!failed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={LOGO_PATH}
          alt={BRAND_NAME}
          height={64}
          className={cn("h-16 w-auto max-w-none rounded-xl object-contain", light && "bg-white")}
          onError={() => setFailed(true)}
        />
      ) : (
        <>
          <Monogram className={light ? "bg-white text-ink" : undefined} />
          <span dir="ltr" className={cn("text-[17px] font-extrabold tracking-[0.14em] uppercase", light ? "text-white" : "text-ink")}>
            {BRAND_NAME}
          </span>
        </>
      )}
    </Link>
  );
}
