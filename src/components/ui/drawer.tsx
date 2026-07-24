"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type DrawerProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  side?: "left" | "right";
};

export function Drawer({ open, title, onClose, children, side = "right" }: DrawerProps) {
  useEffect(() => {
    if (!open) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose, open]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[120]">
      <button
        type="button"
        aria-label="Закрыть меню"
        className="absolute inset-0 bg-black/35"
        onClick={onClose}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
        className={cn(
          "absolute top-0 flex h-full w-full max-w-sm flex-col overflow-y-auto border-black/10 bg-white p-5 shadow-2xl",
          side === "right" ? "right-0 border-l" : "left-0 border-r",
        )}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 id="drawer-title" className="text-lg font-semibold text-cream">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-[10px] border border-black/10 text-black/65 transition hover:border-black/20 hover:bg-black/[0.04]"
            aria-label="Закрыть меню"
          >
            <X aria-hidden className="h-5 w-5" />
          </button>
        </div>
        {children}
      </aside>
    </div>
  );
}
