"use client";

import { useEffect } from "react";
import { RotateCcw } from "lucide-react";
import { Button, LinkButton } from "@/components/ui/button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[app]", error.name, error.digest);
  }, [error]);

  return (
    <div className="page-shell flex min-h-[70vh] items-center justify-center py-10">
      <section className="max-w-xl rounded-[8px] border border-black/10 bg-white p-6 text-center">
        <h1 className="text-2xl font-semibold text-black">
          Не получилось загрузить страницу
        </h1>
        <p className="mt-3 text-sm leading-6 text-black/58">
          Попробуй еще раз или вернись в каталог.
        </p>
        <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
          <Button type="button" onClick={reset}>
            <RotateCcw aria-hidden className="h-4 w-4" />
            Попробовать снова
          </Button>
          <LinkButton href="/catalog" variant="secondary">
            В каталог
          </LinkButton>
        </div>
      </section>
    </div>
  );
}
