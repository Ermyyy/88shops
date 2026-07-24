import { LinkButton } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="page-shell flex min-h-[70vh] items-center justify-center py-10">
      <section className="max-w-xl rounded-[8px] border border-black/10 bg-white p-6 text-center">
        <p className="text-sm font-semibold text-black/45">404</p>
        <h1 className="mt-2 text-2xl font-semibold text-black">
          Страница не найдена
        </h1>
        <p className="mt-3 text-sm leading-6 text-black/58">
          Возможно, товар, магазин или профиль отсутствует в данных.
        </p>
        <LinkButton href="/catalog" className="mt-5">
          В каталог
        </LinkButton>
      </section>
    </div>
  );
}
