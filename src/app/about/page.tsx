import type { Metadata } from "next";
import { ArrowUpRight, BadgeCheck, MessageCircle, ShieldCheck, Tags } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "О нас",
  description:
    "88Shops помогает покупать и продавать одежду, кроссовки и аксессуары.",
};

const blocks = [
  {
    title: "Не обычная доска",
    text: "Объявления, магазины и профили собраны вокруг брендов, размеров, состояния и репутации.",
    icon: Tags,
  },
  {
    title: "Original / Replica",
    text: "Маркировка видна сразу, чтобы быстрее понять, что именно находится в карточке.",
    icon: BadgeCheck,
  },
  {
    title: "Магазины и продавцы",
    text: "У каждого профиля есть товары, отзывы и стиль витрины.",
    icon: ArrowUpRight,
  },
  {
    title: "Способ сделки",
    text: "Можно встретиться лично, договориться напрямую или дождаться безопасной сделки.",
    icon: ShieldCheck,
  },
  {
    title: "Связь",
    text: "Сообщения и другие сценарии помечены честным статусом до подключения.",
    icon: MessageCircle,
  },
];

export default function AboutPage() {
  return (
    <div className="page-shell py-6 md:py-8">
      <section className="rounded-[8px] border border-black/10 bg-white p-4 md:p-5">
        <Badge variant="lime">Fashion resale marketplace</Badge>
        <div className="mt-3 grid gap-3 lg:grid-cols-[1fr_24rem] lg:items-end">
          <h1 className="text-2xl font-semibold text-black md:text-3xl">
            88Shops делает ресейл понятнее
          </h1>
          <p className="text-sm leading-6 text-black/62">
            Одежда, кроссовки и аксессуары от частных продавцов и магазинов в
            одном месте.
          </p>
        </div>
      </section>

      <section className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {blocks.map((block) => {
          const Icon = block.icon;

          return (
            <article
              key={block.title}
              className="rounded-[8px] border border-black/10 bg-white p-4"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-[8px] bg-lime/20 text-black">
                <Icon aria-hidden className="h-5 w-5" />
              </span>
              <h2 className="mt-4 text-base font-semibold text-black">{block.title}</h2>
              <p className="mt-2 text-sm leading-6 text-black/58">{block.text}</p>
            </article>
          );
        })}
      </section>

      <section className="mt-6 rounded-[8px] border border-black/10 bg-white p-4">
        <p className="text-sm font-semibold text-black">Что дальше</p>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-black/60">
          Безопасная сделка, проверка вещей и Premium появятся после подключения
          соответствующих сервисов. Пока интерфейс не выдает эти сценарии за
          полностью работающие.
        </p>
      </section>
    </div>
  );
}
