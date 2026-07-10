import type { Metadata } from "next";
import { LegitCheckForm } from "@/components/product/legit-check-form";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Legit Check",
  description:
    "UI-заглушка будущей услуги Legit Check в 88Shops без AI и обещаний точности.",
};

export default function LegitCheckPage() {
  return (
    <div className="page-shell py-10">
      <div className="mb-8">
        <Badge variant="warning">Coming later</Badge>
        <h1 className="mt-5 font-serif text-5xl text-cream md:text-7xl">
          Legit Check без магии
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-cream/58">
          Будущая услуга проверки оригинальности. Сейчас это только интерфейс,
          который не создает реальный запрос, не использует AI и не обещает
          точный результат.
        </p>
      </div>
      <LegitCheckForm />
    </div>
  );
}
