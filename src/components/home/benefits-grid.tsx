import { BadgeCheck, Handshake, MessageCircle, ShieldCheck, Tags } from "lucide-react";

const benefits = [
  {
    title: "Проверенные продавцы",
    description: "Магазины и пользователи с репутацией, отзывами и историей сделок.",
    icon: BadgeCheck,
  },
  {
    title: "Original / Replica",
    description: "Маркировка вынесена в карточки, чтобы не прятать важный контекст.",
    icon: Tags,
  },
  {
    title: "Личная встреча",
    description: "Осмотр вещи и передача вживую остаются базовым сценарием MVP.",
    icon: Handshake,
  },
  {
    title: "Безопасная сделка позже",
    description: "UI готов, но реальные платежи и escrow пока не подключены.",
    icon: ShieldCheck,
  },
  {
    title: "Быстрый контакт",
    description: "Сейчас это placeholder, дальше подключается серверная авторизация и чат.",
    icon: MessageCircle,
  },
];

export function BenefitsGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      {benefits.map((benefit) => {
        const Icon = benefit.icon;

        return (
          <article
            key={benefit.title}
            className="rounded-[8px] border border-white/10 bg-white/[0.045] p-5"
          >
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-[8px] bg-lime/12 text-lime">
              <Icon aria-hidden className="h-5 w-5" />
            </span>
            <h3 className="mt-5 text-lg font-semibold text-cream">{benefit.title}</h3>
            <p className="mt-3 text-sm leading-6 text-cream/55">{benefit.description}</p>
          </article>
        );
      })}
    </div>
  );
}
