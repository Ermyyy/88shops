import type { Metadata } from "next";
import { BarChart3, Brush, Megaphone, Percent, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "88Shops Premium",
  description: "Будущие premium-возможности 88Shops.",
};

const features = [
  {
    title: "Продвижение",
    description: "Больше заметности для объявлений и витрин магазинов.",
    icon: Megaphone,
  },
  {
    title: "Аналитика",
    description: "Просмотры, сохранения и интерес к товарам в одном месте.",
    icon: BarChart3,
  },
  {
    title: "Оформление",
    description: "Расширенные рамки, обложки и визуальные детали профиля.",
    icon: Brush,
  },
  {
    title: "Приоритет",
    description: "Отдельные сценарии для активных продавцов и магазинов.",
    icon: Sparkles,
  },
  {
    title: "Бонусы",
    description: "Дополнительные возможности после запуска безопасной сделки.",
    icon: Percent,
  },
];

const plans = ["Profile", "Shop", "Studio"];

export default function PremiumPage() {
  return (
    <div className="page-shell py-6 md:py-8">
      <section className="mb-6 rounded-[8px] border border-black/10 bg-white p-4 md:p-5">
        <Badge variant="warning">Скоро</Badge>
        <div className="mt-3 grid gap-3 lg:grid-cols-[1fr_24rem] lg:items-end">
          <h1 className="text-2xl font-semibold text-black md:text-3xl">
            88Shops Premium
          </h1>
          <p className="text-sm leading-6 text-black/62">
            Больше возможностей для тех, кто часто продает, но без обещания
            включенных функций до их запуска.
          </p>
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {features.map((feature) => {
          const Icon = feature.icon;

          return (
            <article
              key={feature.title}
              className="rounded-[8px] border border-black/10 bg-white p-4"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-[8px] bg-lime/20 text-black">
                <Icon aria-hidden className="h-5 w-5" />
              </span>
              <h2 className="mt-4 text-base font-semibold text-black">{feature.title}</h2>
              <p className="mt-2 text-sm leading-6 text-black/55">
                {feature.description}
              </p>
            </article>
          );
        })}
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-3">
        {plans.map((plan) => (
          <article
            key={plan}
            className="rounded-[8px] border border-black/10 bg-white p-4"
          >
            <p className="text-xs font-semibold text-black/45">Скоро</p>
            <h2 className="mt-3 text-xl font-semibold text-black">{plan}</h2>
            <p className="mt-2 text-sm leading-6 text-black/58">
              Откроем после подключения подписок.
            </p>
            <button
              type="button"
              disabled
              className="mt-4 inline-flex min-h-10 w-full items-center justify-center rounded-[8px] border border-black/10 px-4 text-sm font-semibold text-black/45"
            >
              Скоро
            </button>
          </article>
        ))}
      </section>
    </div>
  );
}
