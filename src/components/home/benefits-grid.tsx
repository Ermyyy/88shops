import { BadgeCheck, Handshake, Tags, UserRoundCheck } from "lucide-react";

const benefits = [
  {
    title: "Один профиль для всего",
    description: "Покупай, продавай и развивай свой магазин.",
    icon: UserRoundCheck,
  },
  {
    title: "Original и Replica отдельно",
    description: "Ты всегда понимаешь, что именно смотришь.",
    icon: Tags,
  },
  {
    title: "Выбирай способ сделки",
    description: "Встречайся лично или договаривайся напрямую.",
    icon: Handshake,
  },
  {
    title: "Репутация имеет значение",
    description: "Отзывы и история профиля помогают принимать решение.",
    icon: BadgeCheck,
  },
];

export function BenefitsGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {benefits.map((benefit) => {
        const Icon = benefit.icon;

        return (
          <article
            key={benefit.title}
            className="rounded-[8px] border border-black/10 bg-white p-5"
          >
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-[8px] bg-lime/12 text-black">
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
