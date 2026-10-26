import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ title, description, icon, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-3xl border border-dashed border-line bg-white px-6 py-16 text-center",
        className,
      )}
    >
      {icon ? (
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-sand text-ink">{icon}</div>
      ) : null}
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="mt-2 max-w-md text-[15px] leading-relaxed text-mute">{description}</p>
      {action ? <div className="mt-7">{action}</div> : null}
    </div>
  );
}
