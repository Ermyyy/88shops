import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ShieldAlert } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Price } from "@/components/ui/price";
import { SafeImage } from "@/components/ui/safe-image";
import { StatusBadge } from "@/components/ui/status-badge";
import { DEAL_METHOD_LABELS, DEAL_STATUSES } from "@/lib/constants";
import { deals, getDealById, getProductById, getUserById } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";
import type { DealStatus } from "@/types";

type DealPageProps = {
  params: Promise<{ id: string }>;
};

const statusLabels: Record<DealStatus, string> = {
  PENDING: "Договориться",
  AWAITING_PAYMENT: "Подготовка",
  PAID: "Подтверждение",
  SHIPPED: "Доставка",
  DELIVERED: "Получение",
  CONFIRMED: "Проверка",
  DISPUTED: "Спор",
  CANCELLED: "Отмена",
  COMPLETED: "Готово",
};

export function generateStaticParams() {
  return deals.map((deal) => ({ id: deal.id }));
}

export async function generateMetadata({ params }: DealPageProps): Promise<Metadata> {
  const { id } = await params;
  const deal = getDealById(id);

  return {
    title: deal ? `Сделка ${deal.id}` : "Сделка не найдена",
    description: "Страница сделки 88Shops.",
  };
}

export default async function DealPage({ params }: DealPageProps) {
  const { id } = await params;
  const deal = getDealById(id);

  if (!deal) {
    notFound();
  }

  const product = getProductById(deal.productId);
  const buyer = getUserById(deal.buyerId);
  const seller = getUserById(deal.sellerId);
  const currentIndex = DEAL_STATUSES.indexOf(deal.status);

  return (
    <div className="page-shell py-10">
      <Link
        href="/deals"
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-cream/55 transition hover:text-lime"
      >
        <ArrowLeft aria-hidden className="h-4 w-4" />
        Все сделки
      </Link>

      <div className="grid gap-8 lg:grid-cols-[1fr_24rem]">
        <section className="space-y-6">
          <div className="rounded-[8px] border border-white/10 bg-white/[0.045] p-6">
            <div className="mb-5 flex flex-wrap items-center gap-2">
              <StatusBadge status={deal.status} />
              <Badge>{DEAL_METHOD_LABELS[deal.method]}</Badge>
              {deal.method === "SAFE_DEAL" ? <Badge variant="warning">Скоро</Badge> : null}
            </div>
            <h1 className="font-serif text-5xl text-cream md:text-7xl">
              Сделка {deal.id}
            </h1>
            <p className="mt-4 text-sm leading-6 text-cream/58">
              Создана {formatDate(deal.createdAt)}. Готовим защищённый сценарий оплаты и доставки.
            </p>
          </div>

          <div className="rounded-[8px] border border-amber-300/25 bg-amber-300/10 p-5 text-sm leading-6 text-amber-50/75">
            <div className="flex items-start gap-3">
              <ShieldAlert aria-hidden className="mt-1 h-5 w-5 shrink-0 text-amber-200" />
              <p>Оплата через безопасную сделку появится после подключения сервиса.</p>
            </div>
          </div>

          <div className="rounded-[8px] border border-white/10 bg-white/[0.045] p-6">
            <h2 className="mb-5 text-2xl font-semibold text-cream">Статус</h2>
            <div className="grid gap-3">
              {DEAL_STATUSES.map((status, index) => (
                <TimelineRow
                  key={status}
                  status={status}
                  active={index <= currentIndex}
                  current={status === deal.status}
                />
              ))}
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <Participant title="Покупатель" name={buyer?.displayName} avatar={buyer?.avatarUrl} />
            <Participant title="Продавец" name={seller?.displayName} avatar={seller?.avatarUrl} />
          </div>
        </section>

        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-[8px] border border-white/10 bg-white/[0.045] p-5">
            <div className="relative mb-4 aspect-[4/5] overflow-hidden rounded-[8px] bg-graphite">
              <SafeImage
                src={product?.images[0]?.url}
                alt={product?.title ?? "Товар"}
                fill
                sizes="380px"
                className="object-cover"
              />
            </div>
            <h2 className="text-xl font-semibold text-cream">
              {product?.title ?? "Товар удалён"}
            </h2>
            <dl className="mt-5 space-y-3 text-sm">
              <Row label="Цена" value={<Price value={deal.amountKopecks} />} />
              <Row label="Способ" value={DEAL_METHOD_LABELS[deal.method]} />
              <Row label="Статус" value={<StatusBadge status={deal.status} />} />
            </dl>
          </div>

          <div className="rounded-[8px] border border-white/10 bg-white/[0.045] p-5">
            <h2 className="font-semibold text-cream">Действия</h2>
            <p className="mt-2 text-sm leading-6 text-cream/55">
              Безопасная сделка скоро появится. Пока кнопки оплаты выключены.
            </p>
            <div className="mt-4 grid gap-3">
              <Button type="button" disabled>
                Оплата скоро
              </Button>
              <Button type="button" variant="secondary" disabled>
                Подтверждение скоро
              </Button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function TimelineRow({
  status,
  active,
  current,
}: {
  status: DealStatus;
  active: boolean;
  current: boolean;
}) {
  return (
    <div className="flex items-center gap-3 rounded-[8px] border border-white/10 bg-black/18 p-3">
      <span
        className={`h-3 w-3 rounded-full ${active ? "bg-lime" : "bg-white/18"}`}
        aria-hidden
      />
      <span className="flex-1 text-sm font-semibold text-cream/70">{statusLabels[status]}</span>
      {current ? <StatusBadge status={status} /> : null}
    </div>
  );
}

function Participant({
  title,
  name,
  avatar,
}: {
  title: string;
  name?: string;
  avatar?: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-[8px] border border-white/10 bg-white/[0.045] p-5">
      <Avatar src={avatar} name={name ?? title} />
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cream/38">
          {title}
        </p>
        <p className="mt-1 font-semibold text-cream">{name ?? "Участник"}</p>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 border-t border-white/10 pt-3">
      <dt className="text-cream/45">{label}</dt>
      <dd className="text-right font-semibold text-cream">{value}</dd>
    </div>
  );
}
