import type { Metadata } from "next";
import { SellForm } from "@/components/product/sell-form";

export const metadata: Metadata = {
  title: "Выложить вещь",
  description:
    "Форма создания объявления 88Shops.",
};

export default function SellPage() {
  return (
    <div className="page-shell py-10">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-lime">
          Продажа
        </p>
        <h1 className="mt-3 font-serif text-5xl text-cream md:text-7xl">
          Выложить вещь
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-cream/58">
          Добавь хорошие фото и честно опиши состояние.
        </p>
      </div>
      <SellForm />
    </div>
  );
}
