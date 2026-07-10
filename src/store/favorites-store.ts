"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type FavoritesState = {
  favoriteIds: string[];
  toggleFavorite: (productId: string) => void;
  removeFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
};

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favoriteIds: [],
      toggleFavorite: (productId) =>
        set((state) => ({
          favoriteIds: state.favoriteIds.includes(productId)
            ? state.favoriteIds.filter((id) => id !== productId)
            : [...state.favoriteIds, productId],
        })),
      removeFavorite: (productId) =>
        set((state) => ({
          favoriteIds: state.favoriteIds.filter((id) => id !== productId),
        })),
      isFavorite: (productId) => get().favoriteIds.includes(productId),
    }),
    {
      name: "88shops:favorites",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ favoriteIds: state.favoriteIds }),
    },
  ),
);
