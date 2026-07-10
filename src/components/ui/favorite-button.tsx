"use client";

import { Heart } from "lucide-react";
import { toast } from "sonner";
import { useFavoritesStore } from "@/store/favorites-store";
import { cn } from "@/lib/utils";

type FavoriteButtonProps = {
  productId: string;
  label?: string;
  className?: string;
  isAuthenticated?: boolean;
};

export function FavoriteButton({
  productId,
  label,
  className,
  isAuthenticated = true,
}: FavoriteButtonProps) {
  const isFavorite = useFavoritesStore((state) => state.isFavorite(productId));
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);
  const active = isFavorite;

  return (
    <button
      type="button"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();

        if (!isAuthenticated) {
          const callbackUrl = `${window.location.pathname}${window.location.search}`;
          window.location.href = `/auth?callbackUrl=${encodeURIComponent(callbackUrl)}`;
          return;
        }

        toggleFavorite(productId);
        toast(active ? "Удалено из избранного" : "Добавлено в избранное");
      }}
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-[8px] border border-white/10 bg-black/45 px-3 text-sm font-semibold text-cream transition hover:border-lime/45 hover:text-lime",
        active && "border-lime/45 text-lime",
        className,
      )}
      aria-pressed={active}
      aria-label={active ? "Удалить из избранного" : "Добавить в избранное"}
    >
      <Heart aria-hidden className={cn("h-4 w-4", active && "fill-lime")} />
      {label ? <span>{label}</span> : null}
    </button>
  );
}
