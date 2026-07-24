"use client";

import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type ModalDialogProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
};

export function ModalDialog({
  open,
  title,
  onClose,
  children,
  className,
}: ModalDialogProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-sm">
      <section
        className={cn(
          "w-full max-w-xl rounded-[8px] border border-black/10 bg-white p-5 shadow-2xl",
          className,
        )}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-cream">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-[8px] border border-black/10 text-cream/70 transition hover:text-black"
            aria-label="Закрыть"
          >
            <X aria-hidden className="h-5 w-5" />
          </button>
        </div>
        {children}
      </section>
    </div>
  );
}
