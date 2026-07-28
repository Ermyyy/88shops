import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { MessageComposer } from "@/components/messages/message-composer";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Price } from "@/components/ui/price";
import { SafeImage } from "@/components/ui/safe-image";
import { getConversationPageData, getCurrentUserId } from "@/lib/messages";
import { cn, formatDate } from "@/lib/utils";

type ConversationPageProps = {
  params: Promise<{ conversationId: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: ConversationPageProps): Promise<Metadata> {
  const { conversationId } = await params;
  return { title: `Диалог ${conversationId.slice(0, 6)}` };
}

export default async function ConversationPage({ params }: ConversationPageProps) {
  const { conversationId } = await params;
  const userId = await getCurrentUserId();

  if (!userId) {
    redirect(`/auth?callbackUrl=${encodeURIComponent(`/messages/${conversationId}`)}`);
  }

  const data = await getConversationPageData(conversationId, userId);

  if (!data) {
    notFound();
  }

  return (
    <div className="page-shell py-4 md:py-6">
      <div className="overflow-hidden rounded-[8px] border border-black/10 bg-white">
        <header className="flex items-center gap-3 border-b border-black/10 p-3">
          <Link
            href="/messages"
            className="grid h-10 w-10 place-items-center rounded-[10px] border border-black/10 text-black/60 transition hover:bg-black/[0.04]"
            aria-label="К списку сообщений"
          >
            <ArrowLeft aria-hidden className="h-4 w-4" />
          </Link>
          <Avatar name={data.companion.name} />
          <div className="min-w-0">
            <h1 className="truncate text-base font-semibold text-black">{data.companion.name}</h1>
            <p className="truncate text-xs text-black/45">@{data.companion.username}</p>
          </div>
        </header>

        <Link
          href={`/product/${data.product.id}`}
          className="grid gap-3 border-b border-black/10 bg-[#f6f6f4] p-3 transition hover:bg-black/[0.04] sm:grid-cols-[4rem_1fr_auto]"
        >
          <div className="aspect-[4/5] overflow-hidden rounded-[8px] bg-black/[0.04]">
            <SafeImage alt={data.product.imageAlt} />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-black/40">Объявление</p>
            <p className="mt-1 truncate text-sm font-semibold text-black">{data.product.title}</p>
          </div>
          <Price value={data.product.priceKopecks} className="self-center text-base" />
        </Link>

        <div className="flex max-h-[60vh] min-h-[22rem] flex-col gap-2 overflow-y-auto bg-[#fafafa] p-3">
          {data.messages.length > 0 ? (
            data.messages.map((message) => (
              <article
                key={message.id}
                className={cn(
                  "max-w-[85%] rounded-[12px] px-3 py-2 text-sm shadow-sm",
                  message.own
                    ? "ml-auto bg-lime text-black"
                    : "mr-auto border border-black/10 bg-white text-black",
                )}
              >
                <p className="whitespace-pre-wrap break-words">{message.text}</p>
                <div
                  className={cn(
                    "mt-1 flex items-center justify-end gap-2 text-[11px]",
                    message.own ? "text-black/55" : "text-black/40",
                  )}
                >
                  <time>{formatDate(message.createdAt)}</time>
                  {message.own && message.readAt ? <Badge variant="neutral">Прочитано</Badge> : null}
                </div>
              </article>
            ))
          ) : (
            <div className="m-auto max-w-sm text-center text-sm leading-6 text-black/50">
              Напиши первое сообщение по этому товару.
            </div>
          )}
        </div>

        <MessageComposer conversationId={data.id} />
      </div>
    </div>
  );
}
