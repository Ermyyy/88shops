"use client";

import { Heart } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { toggleFavoriteAction } from "@/lib/favorite-actions";
import { cn } from "@/lib/utils";
import { useFavoritesStore } from "@/store/favorites-store";

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
  const storedFavorite = useFavoritesStore((state) => state.isFavorite(productId));
  const toggleStoredFavorite = useFavoritesStore((state) => state.toggleFavorite);
  const [active, setActive] = useState(storedFavorite);
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();

        if (!isAuthenticated) {
          const callbackUrl = `${window.location.pathname}${window.location.search}`;
          window.location.assign(`/auth?callbackUrl=${encodeURIComponent(callbackUrl)}`);
          return;
        }

        startTransition(async () => {
          const result = await toggleFavoriteAction(productId);

          if (!result.ok || typeof result.active !== "boolean") {
            const callbackUrl = `${window.location.pathname}${window.location.search}`;
            window.location.assign(`/auth?callbackUrl=${encodeURIComponent(callbackUrl)}`);
            return;
          }

          setActive(result.active);
          toggleStoredFavorite(productId);
          toast(result.active ? "Добавлено в избранное" : "Удалено из избранного");
        });
      }}
      className={cn(
        "inline-flex min-h-10 items-center justify-center gap-2 rounded-[10px] border border-black/10 bg-white/95 px-3 text-sm font-semibold text-cream shadow-sm transition hover:border-black/20 hover:bg-white disabled:cursor-wait disabled:opacity-70",
        active && "border-lime bg-lime/80 text-black",
        className,
      )}
      aria-pressed={active}
      aria-label={active ? "Удалить из избранного" : "Добавить в избранное"}
    >
      <Heart aria-hidden className={cn("h-4 w-4", active && "fill-black")} />
      {label ? <span>{label}</span> : null}
    </button>
  );
}
