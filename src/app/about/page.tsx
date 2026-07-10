import type { Metadata } from "next";
import { ArrowUpRight, BadgeCheck, MessageCircle, ShieldCheck, Tags } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "О нас",
  description:
    "Что такое 88Shops и почему это fashion-first resale marketplace, а не обычная доска объявлений.",
};

const blocks = [
  {
    title: "Не универсальная доска",
    text: "88Shops проектируется вокруг одежды, обуви, аксессуаров, размеров, состояния, брендов и репутации продавцов.",
    icon: Tags,
  },
  {
    title: "Original / Replica без тумана",
    text: "Маркировка должна быть понятной до открытия карточки. Это снижает шум и помогает покупателю быстрее принять решение.",
    icon: BadgeCheck,
  },
  {
    title: "Магазины и репутация",
    text: "Профили напоминают смесь fashion-витрины, Steam-профиля и ресейл-магазина: обложка, отзывы, товары, продажи.",
    icon: ArrowUpRight,
  },
  {
    title: "Личная встреча сначала",
    text: "Базовый сценарий MVP — договориться, посмотреть вещь и передать ее лично. Реальная безопасная сделка появится позже.",
    icon: ShieldCheck,
  },
  {
    title: "Telegram-native в будущем",
    text: "Интерфейс держится компактным и адаптивным, чтобы позже его было проще перенести в Telegram Mini App.",
    icon: MessageCircle,
  },
];

export default function AboutPage() {
  return (
    <div>
      <section className="border-b border-white/10">
        <div className="page-shell grid min-h-[70vh] items-end gap-10 py-16 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <Badge variant="lime">Fashion marketplace нового поколения</Badge>
            <h1 className="mt-8 font-serif text-6xl leading-none text-cream md:text-8xl">
              88Shops делает ресейл тише, точнее и визуальнее.
            </h1>
          </div>
          <p className="max-w-xl text-lg leading-8 text-cream/62">
            Это frontend-first MVP площадки для fashion-ресейла: каталог,
            магазины, профили, избранное, формы и демо-сделки. Сложные функции
            показаны как безопасные заглушки, а не как готовые production-сервисы.
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
              Безопасная сделка, легитчек и Mini App требуют серверной основы.
            </h2>
            <div className="space-y-4 text-sm leading-7 text-cream/60">
              <p>
                Реальные платежи, escrow, выплаты, Telegram Login, Google OAuth,
                облачная загрузка изображений, email и чаты не подключены в этом
                MVP. Для них нужны серверные сессии, проверенные webhook,
                rate limiting, хранение файлов и строгая модерация.
              </p>
              <p>
                Онлайн-легитчек тоже пока не обещает точность и не использует AI:
                это только интерфейс будущей услуги, чтобы заранее увидеть место
                функции в продукте.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
