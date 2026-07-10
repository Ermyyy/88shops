"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type TabItem = {
  id: string;
  label: string;
  content: ReactNode;
};

export function Tabs({ items, className }: { items: TabItem[]; className?: string }) {
  const [activeId, setActiveId] = useState(items[0]?.id);
  const active = items.find((item) => item.id === activeId) ?? items[0];

  return (
    <div className={className}>
      <div className="flex gap-2 overflow-x-auto border-b border-white/10 pb-2">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setActiveId(item.id)}
            className={cn(
              "min-h-11 whitespace-nowrap rounded-[8px] px-4 text-sm font-semibold text-cream/58 transition hover:bg-white/[0.06] hover:text-cream",
              item.id === active?.id && "bg-lime text-black hover:bg-lime hover:text-black",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="pt-6">{active?.content}</div>
    </div>
  );
}
