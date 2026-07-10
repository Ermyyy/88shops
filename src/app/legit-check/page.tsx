import type { Metadata } from "next";
import { LegitCheckForm } from "@/components/product/legit-check-form";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Проверка вещи",
  description:
    "Будущая услуга проверки вещей в 88Shops.",
};

export default function LegitCheckPage() {
  return (
    <div className="page-shell py-10">
      <div className="mb-8">
        <Badge variant="warning">Готовим запуск</Badge>
        <h1 className="mt-5 font-serif text-5xl text-cream md:text-7xl">
          Проверка вещи
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-cream/58">
          Загрузи фотографии и получи мнение эксперта.
        </p>
      </div>
      <LegitCheckForm />
    </div>
  );
}
