import type { Metadata } from "next";
import { LegitCheckForm } from "@/components/product/legit-check-form";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Проверка вещи",
  description: "Будущая услуга проверки вещей в 88Shops.",
};

export default function LegitCheckPage() {
  return (
    <div className="page-shell py-6 md:py-8">
      <div className="mb-5">
        <Badge variant="warning">Готовим запуск</Badge>
        <h1 className="mt-3 text-2xl font-semibold text-black md:text-3xl">
          Проверка вещи
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-black/58">
          Загрузи фото и детали товара. Отправка заявки появится после запуска
          сервиса проверки.
        </p>
      </div>
      <LegitCheckForm />
    </div>
  );
}
