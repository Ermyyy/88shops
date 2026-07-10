"use client";

import { RotateCcw } from "lucide-react";
import { Button, LinkButton } from "@/components/ui/button";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="page-shell flex min-h-[70vh] items-center justify-center py-10">
      <section className="max-w-xl rounded-[8px] border border-white/10 bg-white/[0.045] p-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-lime">
          Ошибка
        </p>
        <h1 className="mt-4 font-serif text-5xl text-cream">Что-то пошло не так</h1>
        <p className="mt-4 text-sm leading-6 text-cream/58">
          Мы не показываем stack trace пользователю. Попробуйте перезагрузить
          интерфейс или вернуться на главную.
        </p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Button type="button" onClick={reset}>
            <RotateCcw aria-hidden className="h-4 w-4" />
            Повторить
          </Button>
          <LinkButton href="/" variant="secondary">
            На главную
          </LinkButton>
        </div>
      </section>
    </div>
  );
}
