import { ArrowRight, Store } from "lucide-react";
import { LinkButton } from "@/components/ui/button";

export function SellerCta() {
  return (
    <section className="page-shell py-16">
      <div className="grid gap-8 rounded-[8px] border border-white/10 bg-lime p-8 text-black md:grid-cols-[1fr_auto] md:items-center lg:p-10">
        <div>
          <p className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.22em]">
            <Store aria-hidden className="h-4 w-4" />
            Для продавцов
          </p>
          <h2 className="mt-5 font-serif text-5xl leading-none md:text-6xl">
            Собери магазин вокруг своего вкуса.
          </h2>
          <p className="mt-5 max-w-2xl text-sm leading-6 text-black/70 md:text-base">
            В MVP объявление не сохраняется в базу: форма показывает будущий
            workflow, валидацию и безопасную подготовку загрузки.
          </p>
        </div>
        <LinkButton
          href="/sell"
          variant="dark"
          size="lg"
          className="border-black/20 bg-black text-cream hover:bg-black/85"
        >
          Выложить объявление
          <ArrowRight aria-hidden className="h-4 w-4" />
        </LinkButton>
      </div>
    </section>
  );
}
