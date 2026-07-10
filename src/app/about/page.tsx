import type { Metadata } from "next";
import { ArrowUpRight, BadgeCheck, MessageCircle, ShieldCheck, Tags } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "О нас",
  description:
    "88Shops помогает покупать и продавать одежду, кроссовки и аксессуары в fashion-first формате.",
};

const blocks = [
  {
    title: "Не обычная доска",
    text: "88Shops собирает вещи, магазины и профили вокруг брендов, размеров, состояния и репутации.",
    icon: Tags,
  },
  {
    title: "Original / Replica без тумана",
    text: "Маркировка видна сразу, чтобы быстрее понимать, что именно ты смотришь.",
    icon: BadgeCheck,
  },
  {
    title: "Магазины и продавцы",
    text: "У каждого профиля есть история, товары, отзывы и стиль, по которому его легко узнать.",
    icon: ArrowUpRight,
  },
  {
    title: "Способ сделки на выбор",
    text: "Можно встретиться лично, договориться напрямую или дождаться безопасной сделки.",
    icon: ShieldCheck,
  },
  {
    title: "Telegram и Google скоро",
    text: "Сейчас вход работает через email и пароль. Другие способы добавим позже.",
    icon: MessageCircle,
  },
];

export default function AboutPage() {
  return (
    <div>
      <section className="border-b border-white/10">
        <div className="page-shell grid min-h-[70vh] items-end gap-10 py-16 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <Badge variant="lime">Fashion resale marketplace</Badge>
            <h1 className="mt-8 font-serif text-6xl leading-none text-cream md:text-8xl">
              88Shops делает ресейл тише, точнее и визуальнее.
            </h1>
          </div>
          <p className="max-w-xl text-lg leading-8 text-cream/62">
            Одежда, кроссовки и аксессуары от частных продавцов и магазинов в одном месте.
            Смотри вещь, проверяй продавца и выбирай удобный способ договориться.
          </p>
        </div>
      </section>

      <section className="page-shell py-16">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {blocks.map((block) => {
            const Icon = block.icon;

            return (
              <article
                key={block.title}
                className="rounded-[8px] border border-white/10 bg-white/[0.045] p-6"
              >
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-[8px] bg-lime/12 text-lime">
                  <Icon aria-hidden className="h-5 w-5" />
                </span>
                <h2 className="mt-7 text-2xl font-semibold text-cream">{block.title}</h2>
                <p className="mt-4 text-sm leading-7 text-cream/58">{block.text}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="page-shell pb-16">
        <div className="rounded-[8px] border border-white/10 bg-white/[0.04] p-8 lg:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-lime">
            Что дальше
          </p>
          <div className="mt-6 grid gap-8 lg:grid-cols-2">
            <h2 className="font-serif text-5xl leading-none text-cream">
              Безопасная сделка, проверка вещи и Premium появятся после запуска.
            </h2>
            <div className="space-y-4 text-sm leading-7 text-cream/60">
              <p>
                Мы не показываем оплату как готовую функцию, пока она не подключена. Для таких
                сценариев в интерфейсе стоит честный статус “Скоро”.
              </p>
              <p>
                Главный сценарий сейчас простой: найти вещь, посмотреть профиль продавца и
                договориться удобным способом.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
