import type { Metadata } from "next";
import { ShopsDirectory } from "@/components/shops/shops-directory";
import { shops } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "Магазины",
  description:
    "Demo-каталог магазинов 88Shops с рейтингом, продажами и mock-сортировками.",
};

export default function ShopsPage() {
  return (
    <div className="page-shell py-10">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-lime">
          88Shops
        </p>
        <h1 className="mt-3 font-serif text-5xl text-cream md:text-7xl">
          Магазины с характером
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-cream/58">
          Рейтинг и продажи здесь являются mock-данными для MVP. Реальное
          ранжирование магазинов позже должно считаться на сервере.
        </p>
      </div>
      <ShopsDirectory shops={shops} />
    </div>
  );
}
