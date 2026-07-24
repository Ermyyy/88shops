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
        "flex min-h-64 flex-col items-center justify-center rounded-[12px] border border-dashed border-black/12 bg-white p-8 text-center",
        className,
      )}
    >
      <SearchX aria-hidden className="mb-4 h-9 w-9 text-black/45" />
      <h2 className="text-xl font-semibold text-cream">{title}</h2>
      <p className="mt-2 max-w-md text-sm leading-6 text-black/55">{description}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
