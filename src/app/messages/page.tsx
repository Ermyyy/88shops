import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { EmptyState } from "@/components/ui/empty-state";
import { LinkButton } from "@/components/ui/button";
import { SafeImage } from "@/components/ui/safe-image";
import { getConversationList, getCurrentUserId } from "@/lib/messages";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Сообщения",
  description: "Диалоги с продавцами и покупателями 88Shops.",
};

export const dynamic = "force-dynamic";

export default async function MessagesPage() {
  const userId = await getCurrentUserId();

  if (!userId) {
    redirect("/auth?callbackUrl=%2Fmessages");
  }

  const conversations = await getConversationList(userId);

  return (
    <div className="page-shell py-6">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-black">Сообщения</h1>
          <p className="mt-1 text-sm text-black/55">Пиши продавцам и договаривайся о покупке.</p>
        </div>
        <LinkButton href="/catalog" variant="secondary" size="sm">
          В каталог
        </LinkButton>
      </div>

      {conversations.length > 0 ? (
        <section className="overflow-hidden rounded-[8px] border border-black/10 bg-white">
          {conversations.map((conversation) => (
            <Link
              key={conversation.id}
              href={`/messages/${conversation.id}`}
              className="grid gap-3 border-b border-black/8 p-3 transition last:border-b-0 hover:bg-black/[0.03] sm:grid-cols-[4.5rem_1fr_auto]"
            >
              <div className="aspect-[4/5] overflow-hidden rounded-[8px] bg-black/[0.04]">
                <SafeImage alt={conversation.productImageAlt} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="truncate font-semibold text-black">{conversation.companionName}</p>
                  {conversation.unreadCount > 0 ? (
                    <span className="grid h-5 min-w-5 place-items-center rounded-full bg-lime px-1 text-[11px] font-bold text-black">
                      {conversation.unreadCount}
                    </span>
                  ) : null}
                </div>
                <p className="mt-1 truncate text-sm font-medium text-black/70">
                  {conversation.productTitle}
                </p>
                <p className="mt-1 line-clamp-2 text-sm text-black/50">{conversation.lastMessageText}</p>
              </div>
              <time className="text-xs text-black/40 sm:text-right">
                {formatDate(conversation.lastMessageAt)}
              </time>
            </Link>
          ))}
        </section>
      ) : (
        <EmptyState
          title="Диалогов пока нет"
          description="Открой товар и нажми «Написать продавцу»."
          action={<LinkButton href="/catalog">Перейти в каталог</LinkButton>}
        />
      )}
    </div>
  );
}
