import type { Metadata } from "next";
import { FavoritesClient } from "@/features/favorites/favorites-client";
import { products } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "Избранное",
  description: "Локальное избранное 88Shops на Zustand persist, только ID товаров.",
};

export default function FavoritesPage() {
  return (
    <div className="page-shell py-10">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-lime">
          Избранное
        </p>
        <h1 className="mt-3 font-serif text-5xl text-cream md:text-7xl">
          Сохраненные вещи
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-cream/58">
          Локальная подборка для MVP. Она не создает аккаунт, не синхронизируется
          с сервером и не хранит ничего кроме идентификаторов.
        </p>
      </div>
      <FavoritesClient products={products} />
    </div>
  );
}
