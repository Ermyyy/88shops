import type { Metadata } from "next";
import { FavoritesClient } from "@/features/favorites/favorites-client";
import { products } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "Избранное",
  description: "Сохраненные объявления в 88Shops.",
};

export default function FavoritesPage() {
  return (
    <div className="page-shell py-6 md:py-8">
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-black/55">Избранное</p>
          <h1 className="text-2xl font-semibold text-black md:text-3xl">
            Сохраненные объявления
          </h1>
        </div>
      </div>
      <FavoritesClient products={products} />
    </div>
  );
}
