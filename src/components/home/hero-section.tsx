import { ArrowRight, Search, Sparkles } from "lucide-react";
import { LinkButton } from "@/components/ui/button";
import { SafeImage } from "@/components/ui/safe-image";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-white/10">
      <div className="absolute inset-0 wet-fabric" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-night to-transparent" />
      <div className="page-shell relative grid min-h-[calc(100vh-4rem)] items-center gap-10 py-16 lg:grid-cols-[1.08fr_0.92fr]">
        <div className="max-w-4xl">
          <p className="mb-5 inline-flex items-center gap-2 rounded-[8px] border border-lime/25 bg-lime/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-lime">
            <Sparkles aria-hidden className="h-3.5 w-3.5" />
            Оригинальные вещи без шума
          </p>
          <h1 className="font-serif text-7xl leading-[0.85] text-cream sm:text-8xl lg:text-[9.5rem]">
            88SHOPS
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-cream/66">
            Премиальный fashion resale marketplace: одежда, обувь, аксессуары,
            магазины с репутацией и честная маркировка Original / Replica.
          </p>
          <form
            action="/catalog"
            className="mt-9 flex max-w-2xl flex-col gap-3 rounded-[8px] border border-white/12 bg-black/36 p-2 backdrop-blur sm:flex-row"
          >
            <label className="flex min-h-12 flex-1 items-center gap-3 px-3">
              <Search aria-hidden className="h-5 w-5 text-lime" />
              <span className="sr-only">Поиск</span>
              <input
                name="q"
                placeholder="Stone Island, Rick Owens, сумка Gucci..."
                className="w-full bg-transparent text-sm text-cream outline-none placeholder:text-cream/38"
              />
            </label>
            <button
              type="submit"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[8px] bg-lime px-5 text-sm font-bold text-black transition hover:bg-lime/90"
            >
              Найти
              <ArrowRight aria-hidden className="h-4 w-4" />
            </button>
          </form>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <LinkButton href="/catalog" size="lg">
              Открыть каталог
            </LinkButton>
            <LinkButton href="/sell" variant="secondary" size="lg">
              Выложить объявление
            </LinkButton>
          </div>
        </div>

        <div className="relative min-h-[28rem] lg:min-h-[38rem]">
          <div className="absolute inset-0 rounded-[8px] border border-white/10 bg-black/30 backdrop-blur-sm" />
          <div className="absolute left-8 top-8 h-48 w-40 overflow-hidden rounded-[8px] border border-white/10 shadow-2xl">
            <SafeImage
              src="https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=600&q=82"
              alt="Техническая куртка"
              fill
              sizes="220px"
              className="object-cover"
            />
          </div>
          <div className="absolute right-6 top-24 h-64 w-48 overflow-hidden rounded-[8px] border border-white/10 shadow-2xl">
            <SafeImage
              src="https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=600&q=82"
              alt="Fashion силуэт"
              fill
              sizes="260px"
              className="object-cover"
            />
          </div>
          <div className="absolute bottom-12 left-14 h-60 w-48 overflow-hidden rounded-[8px] border border-white/10 shadow-2xl">
            <SafeImage
              src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=82"
              alt="Кроссовки"
              fill
              sizes="260px"
              className="object-cover"
            />
          </div>
          <div className="absolute bottom-6 right-10 max-w-xs rounded-[8px] border border-white/12 bg-black/55 p-5 backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-lime">
              Fashion-first
            </p>
            <p className="mt-3 text-sm leading-6 text-cream/68">
              Не доска объявлений, а витрина для ресейла с профилями,
              магазинами и прозрачными способами сделки.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
