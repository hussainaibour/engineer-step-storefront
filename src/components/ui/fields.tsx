import type { InputHTMLAttributes, LabelHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const field =
  "w-full rounded-xl border border-line bg-white px-4 text-[15px] text-ink placeholder:text-mute/70 transition-colors focus:border-ink focus:outline-none";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(field, "h-11", className)} {...props} />;
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(field, "min-h-28 resize-y py-3", className)} {...props} />;
}

export function Label({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cn("mb-2 block text-sm font-semibold text-ink", className)} {...props} />;
}
