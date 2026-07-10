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
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
        className={cn(
          "absolute top-0 flex h-full w-full max-w-sm flex-col overflow-y-auto border-white/10 bg-night p-5 shadow-2xl",
          side === "right" ? "right-0 border-l" : "left-0 border-r",
        )}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 id="drawer-title" className="text-lg font-semibold text-cream">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 w-11 items-center justify-center rounded-[8px] border border-white/10 text-cream/70 transition hover:border-lime/50 hover:text-lime"
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
