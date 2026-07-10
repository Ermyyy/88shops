import type { Metadata } from "next";
import { FavoritesClient } from "@/features/favorites/favorites-client";
import { products } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "Избранное",
  description: "Сохранённые вещи в 88Shops.",
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
          Всё, к чему хочется вернуться позже.
        </p>
      </div>
      <FavoritesClient products={products} />
    </div>
  );
}
