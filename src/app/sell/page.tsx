import type { Metadata } from "next";
import { SellForm } from "@/components/product/sell-form";

export const metadata: Metadata = {
  title: "Разместить объявление",
  description: "Форма создания объявления 88Shops.",
};

export default function SellPage() {
  return (
    <div className="page-shell py-6 md:py-8">
      <div className="mb-5">
        <p className="text-sm text-black/55">Продажа</p>
        <h1 className="text-2xl font-semibold text-black md:text-3xl">
          Разместить объявление
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-black/58">
          Добавь понятные фото, цену, город и честное описание состояния.
        </p>
      </div>
      <SellForm />
    </div>
  );
}
