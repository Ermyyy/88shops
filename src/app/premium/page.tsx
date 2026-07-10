import type { Metadata } from "next";
import { BarChart3, Brush, Megaphone, Percent, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Premium",
  description: "Будущие premium-возможности 88Shops без подключения оплаты.",
};

const features = [
  {
    title: "Продвижение",
    description: "Будущие инструменты поднятия объявлений и витрин магазинов.",
    icon: Megaphone,
  },
  {
    title: "Аналитика",
    description: "Показы, избранное и конверсия после появления серверных событий.",
    icon: BarChart3,
  },
  {
    title: "Кастомизация",
    description: "Расширенные рамки, обложки и визуальные детали профиля.",
    icon: Brush,
  },
  {
    title: "Приоритет",
    description: "Будущий priority support и быстрые проверки спорных кейсов.",
    icon: Sparkles,
  },
  {
    title: "Комиссия",
    description: "Потенциально сниженная комиссия, если safe deal будет запущена.",
    icon: Percent,
  },
];

export default function PremiumPage() {
  return (
    <div className="page-shell py-10">
      <section className="grid min-h-[60vh] items-end gap-8 pb-12 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <Badge variant="warning">UI-only</Badge>
          <h1 className="mt-6 font-serif text-6xl leading-none text-cream md:text-8xl">
            Premium без преждевременных обещаний.
          </h1>
        </div>
        <p className="text-lg leading-8 text-cream/62">
          Этот раздел показывает будущие направления монетизации. Реальные
          подписки, цены, платежи и финансовые преимущества в MVP не подключены.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {features.map((feature) => {
          const Icon = feature.icon;

          return (
            <article
              key={feature.title}
              className="rounded-[8px] border border-white/10 bg-white/[0.045] p-5"
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-[8px] bg-lime/12 text-lime">
                <Icon aria-hidden className="h-5 w-5" />
              </span>
              <h2 className="mt-5 text-xl font-semibold text-cream">{feature.title}</h2>
              <p className="mt-3 text-sm leading-6 text-cream/55">
                {feature.description}
              </p>
            </article>
          );
        })}
      </section>

      <section className="mt-10 grid gap-5 lg:grid-cols-3">
        {["Profile", "Shop", "Studio"].map((plan) => (
          <article
            key={plan}
            className="rounded-[8px] border border-white/10 bg-white/[0.04] p-6"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-lime">
              Demo plan
            </p>
            <h2 className="mt-4 text-3xl font-semibold text-cream">{plan}</h2>
            <p className="mt-4 text-sm leading-6 text-cream/58">
              Цена будет объявлена позже. Текущий MVP не принимает оплату и не
              создает подписку.
            </p>
            <button
              type="button"
              disabled
              className="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-[8px] border border-white/10 px-4 text-sm font-semibold text-cream/45"
            >
              Пока недоступно
            </button>
          </article>
        ))}
      </section>
    </div>
  );
}
