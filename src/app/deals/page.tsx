import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, ShieldAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Price } from "@/components/ui/price";
import { StatusBadge } from "@/components/ui/status-badge";
import { DEAL_METHOD_LABELS } from "@/lib/constants";
import { getDeals } from "@/lib/market-data";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Сделки",
  description: "Раздел сделок 88Shops.",
};

export const dynamic = "force-dynamic";

export default async function DealsPage() {
  const deals = await getDeals();

  return (
    <div className="page-shell py-6 md:py-8">
      <div className="mb-5">
        <Badge variant="warning">Скоро</Badge>
        <h1 className="mt-3 text-2xl font-semibold text-black md:text-3xl">
          Сделки
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-black/58">
          Защищенную оплату и доставку подключим отдельно. Сейчас раздел показывает
          будущую структуру сделок без имитации работающей оплаты.
        </p>
      </div>

      <div className="mb-4 rounded-[8px] border border-amber-300/45 bg-amber-50 p-4 text-sm leading-6 text-black/65">
        <div className="flex items-start gap-3">
          <ShieldAlert aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
          <p>Безопасная сделка появится после подключения оплаты и доставки.</p>
        </div>
      </div>

      <div className="grid gap-3">
        {deals.map(({ deal, productTitle, buyerName, sellerName }) => {
          return (
            <Link
              key={deal.id}
              href={`/deals/${deal.id}`}
              className="grid gap-3 rounded-[8px] border border-black/10 bg-white p-4 transition hover:border-black/20 md:grid-cols-[1fr_auto]"
            >
              <div>
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <StatusBadge status={deal.status} />
                  <Badge>{DEAL_METHOD_LABELS[deal.method]}</Badge>
                </div>
                <h2 className="text-base font-semibold text-black">
                  {productTitle}
                </h2>
                <p className="mt-1 text-sm text-black/55">
                  Покупатель: {buyerName} · Продавец: {sellerName} · {formatDate(deal.createdAt)}
                </p>
              </div>
              <div className="flex items-center justify-between gap-6 md:justify-end">
                <Price value={deal.amountKopecks} className="text-xl" />
                <ArrowUpRight aria-hidden className="h-5 w-5 text-black/45" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
