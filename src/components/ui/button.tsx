import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "whatsapp";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary: "bg-ink text-white hover:bg-ink-soft border border-ink",
  secondary: "bg-white text-ink border border-line hover:border-ink",
  outline: "bg-transparent text-ink border border-ink/25 hover:border-ink hover:bg-ink hover:text-white",
  ghost: "bg-transparent text-ink border border-transparent hover:bg-ink/5",
  whatsapp: "bg-[#128c4a] text-white border border-[#128c4a] hover:bg-[#0e7a40]",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-[15px]",
  lg: "h-13 px-8 text-base",
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40";

export function buttonClasses(variant: Variant = "primary", size: Size = "md", className?: string) {
  return cn(base, variants[variant], sizes[size], className);
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export function Button({ variant = "primary", size = "md", className, type = "button", ...props }: ButtonProps) {
  return <button type={type} className={buttonClasses(variant, size, className)} {...props} />;
}

interface LinkButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  variant?: Variant;
  size?: Size;
  external?: boolean;
}

export function LinkButton({ href, variant = "primary", size = "md", external, className, ...props }: LinkButtonProps) {
  const cls = buttonClasses(variant, size, className);
  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cls} {...props} />
  ) : (
    <Link href={href} className={cls} {...props} />
  );
}
