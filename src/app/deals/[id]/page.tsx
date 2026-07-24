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
import { getDealPageData } from "@/lib/market-data";
import { formatDate } from "@/lib/utils";
import type { DealStatus } from "@/types";

type DealPageProps = {
  params: Promise<{ id: string }>;
};

export const dynamic = "force-dynamic";

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

export async function generateMetadata({ params }: DealPageProps): Promise<Metadata> {
  const { id } = await params;
  const data = await getDealPageData(id);
  const deal = data?.deal;

  return {
    title: deal ? `Сделка ${deal.id}` : "Сделка не найдена",
    description: "Страница сделки 88Shops.",
  };
}

export default async function DealPage({ params }: DealPageProps) {
  const { id } = await params;
  const data = await getDealPageData(id);

  if (!data) {
    notFound();
  }

  const { deal, product, buyerName, sellerName } = data;
  const currentIndex = DEAL_STATUSES.indexOf(deal.status);

  return (
    <div className="page-shell py-6 md:py-8">
      <Link
        href="/deals"
        className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-black/55 transition hover:text-black"
      >
        <ArrowLeft aria-hidden className="h-4 w-4" />
        Все сделки
      </Link>

      <div className="grid gap-5 lg:grid-cols-[1fr_23rem]">
        <section className="space-y-4">
          <div className="rounded-[8px] border border-black/10 bg-white p-4">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <StatusBadge status={deal.status} />
              <Badge>{DEAL_METHOD_LABELS[deal.method]}</Badge>
              {deal.method === "SAFE_DEAL" ? <Badge variant="warning">Скоро</Badge> : null}
            </div>
            <h1 className="text-2xl font-semibold text-black md:text-3xl">
              Сделка {deal.id}
            </h1>
            <p className="mt-2 text-sm leading-6 text-black/58">
              Создана {formatDate(deal.createdAt)}. Оплата и доставка через
              безопасную сделку пока не подключены.
            </p>
          </div>

          <div className="rounded-[8px] border border-amber-300/45 bg-amber-50 p-4 text-sm leading-6 text-black/65">
            <div className="flex items-start gap-3">
              <ShieldAlert aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
              <p>
                Оплата через безопасную сделку появится после подключения сервиса.
              </p>
            </div>
          </div>

          <div className="rounded-[8px] border border-black/10 bg-white p-4">
            <h2 className="mb-4 text-lg font-semibold text-black">Статус</h2>
            <div className="grid gap-2">
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

          <div className="grid gap-3 md:grid-cols-2">
            <Participant title="Покупатель" name={buyerName} />
            <Participant title="Продавец" name={sellerName} />
          </div>
        </section>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-[8px] border border-black/10 bg-white p-4">
            <div className="relative mb-4 aspect-[4/5] overflow-hidden rounded-[8px] bg-[#eeeeee]">
              <SafeImage
                alt={product?.title ?? "Товар"}
                fill
                sizes="380px"
                className="object-cover"
              />
            </div>
            <h2 className="text-lg font-semibold text-black">
              {product?.title ?? "Товар удален"}
            </h2>
            <dl className="mt-4 space-y-3 text-sm">
              <Row label="Цена" value={<Price value={deal.amountKopecks} />} />
              <Row label="Способ" value={DEAL_METHOD_LABELS[deal.method]} />
              <Row label="Статус" value={<StatusBadge status={deal.status} />} />
            </dl>
          </div>

          <div className="rounded-[8px] border border-black/10 bg-white p-4">
            <h2 className="font-semibold text-black">Действия</h2>
            <p className="mt-2 text-sm leading-6 text-black/55">
              Кнопки оплаты выключены до подключения безопасной сделки.
            </p>
            <div className="mt-4 grid gap-2">
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
    <div className="flex items-center gap-3 rounded-[8px] border border-black/10 bg-[#f6f6f4] p-3">
      <span
        className={`h-3 w-3 rounded-full ${active ? "bg-lime" : "bg-black/12"}`}
        aria-hidden
      />
      <span className="flex-1 text-sm font-semibold text-black/70">
        {statusLabels[status]}
      </span>
      {current ? <StatusBadge status={status} /> : null}
    </div>
  );
}

function Participant({
  title,
  name,
}: {
  title: string;
  name?: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-[8px] border border-black/10 bg-white p-4">
      <Avatar name={name ?? title} />
      <div>
        <p className="text-xs font-semibold text-black/42">{title}</p>
        <p className="mt-1 font-semibold text-black">{name ?? "Участник"}</p>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 border-t border-black/10 pt-3">
      <dt className="text-black/45">{label}</dt>
      <dd className="text-right font-semibold text-black">{value}</dd>
    </div>
  );
}
