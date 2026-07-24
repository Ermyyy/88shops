import type { Metadata } from "next";
import { MessageCircle, Search } from "lucide-react";
import { LinkButton } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Сообщения",
  description: "Сообщения 88Shops.",
};

export default function MessagesPage() {
  return (
    <div className="page-shell py-6">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-black">Сообщения</h1>
          <p className="mt-1 text-sm text-black/55">
            Здесь будут диалоги с продавцами и покупателями.
          </p>
        </div>
        <LinkButton href="/catalog" variant="secondary" size="sm">
          В каталог
        </LinkButton>
      </div>

      <section className="grid min-h-[32rem] overflow-hidden rounded-[8px] border border-black/10 bg-white lg:grid-cols-[20rem_1fr]">
        <aside className="border-b border-black/10 p-4 lg:border-b-0 lg:border-r">
          <label className="flex min-h-10 items-center gap-2 rounded-[8px] border border-black/10 bg-[#f6f6f4] px-3">
            <Search aria-hidden className="h-4 w-4 text-black/45" />
            <span className="sr-only">Поиск диалогов</span>
            <input
              disabled
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-black/35"
              placeholder="Поиск диалогов"
            />
          </label>
          <div className="mt-4 rounded-[8px] border border-dashed border-black/12 p-4 text-sm leading-6 text-black/55">
            Диалоги появятся здесь, когда будет подключен backend сообщений.
          </div>
        </aside>

        <div className="flex flex-col items-center justify-center p-8 text-center">
          <MessageCircle aria-hidden className="h-10 w-10 text-black/35" />
          <h2 className="mt-4 text-xl font-bold text-black">Сообщения готовятся</h2>
          <p className="mt-2 max-w-md text-sm leading-6 text-black/55">
            Мы не показываем тестовые переписки. После подключения чатов здесь
            будет карточка товара, история диалога и поле сообщения.
          </p>
        </div>
      </section>
    </div>
  );
}
