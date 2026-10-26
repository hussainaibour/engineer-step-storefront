"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function HeaderSearch({ className, id = "header-search" }: { className?: string; id?: string }) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  return (
    <form
      role="search"
      className={cn("relative w-full", className)}
      onSubmit={(e) => {
        e.preventDefault();
        const q = query.trim();
        router.push(q ? `/shop?q=${encodeURIComponent(q)}` : "/shop");
      }}
    >
      <label htmlFor={id} className="sr-only">
        ابحث عن منتج
      </label>
      <input
        id={id}
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="ابحث بالاسم أو الموديل"
        className="h-11 w-full rounded-full border border-line bg-white ps-11 pe-4 text-sm placeholder:text-mute/70 focus:border-ink focus:outline-none"
      />
      <button
        type="submit"
        aria-label="بحث"
        className="absolute inset-y-0 start-0 flex w-11 items-center justify-center text-mute hover:text-ink"
      >
        <Search className="h-4 w-4" />
      </button>
    </form>
  );
}
