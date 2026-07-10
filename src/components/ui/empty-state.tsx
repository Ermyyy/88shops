import type { ReactNode } from "react";
import { SearchX } from "lucide-react";
import { cn } from "@/lib/utils";

type EmptyStateProps = {
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
};

export function EmptyState({ title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex min-h-72 flex-col items-center justify-center rounded-[8px] border border-dashed border-white/15 bg-white/[0.035] p-8 text-center",
        className,
      )}
    >
      <SearchX aria-hidden className="mb-5 h-10 w-10 text-lime" />
      <h2 className="text-2xl font-semibold text-cream">{title}</h2>
      <p className="mt-3 max-w-md text-sm leading-6 text-cream/58">{description}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
