import { LinkButton } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="page-shell flex min-h-[70vh] items-center justify-center py-10">
      <section className="max-w-xl rounded-[8px] border border-white/10 bg-white/[0.045] p-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-lime">
          404
        </p>
        <h1 className="mt-4 font-serif text-5xl text-cream">Страница не найдена</h1>
        <p className="mt-4 text-sm leading-6 text-cream/58">
          Возможно, товар, магазин или профиль отсутствует в моковых данных.
        </p>
        <LinkButton href="/catalog" className="mt-7">
          В каталог
        </LinkButton>
      </section>
    </div>
  );
}
