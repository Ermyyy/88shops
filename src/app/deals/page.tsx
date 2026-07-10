import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, ShieldAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Price } from "@/components/ui/price";
import { StatusBadge } from "@/components/ui/status-badge";
import { DEAL_METHOD_LABELS } from "@/lib/constants";
import { deals, getProductById, getUserById } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Сделки",
  description: "Демо-интерфейс сделок 88Shops без реальных платежей и escrow.",
};

export default function DealsPage() {
  return (
    <div className="page-shell py-10">
      <div className="mb-8">
        <Badge variant="warning">Demo only</Badge>
        <h1 className="mt-5 font-serif text-5xl text-cream md:text-7xl">
          Сделки без финансовой логики
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-cream/58">
          Здесь показан будущий интерфейс safe deal. Клиент не управляет
          финансовыми статусами, платежи не подключены.
        </p>
      </div>

      <div className="mb-6 rounded-[8px] border border-amber-300/25 bg-amber-300/10 p-5 text-sm leading-6 text-amber-50/75">
        <div className="flex items-start gap-3">
          <ShieldAlert aria-hidden className="mt-1 h-5 w-5 shrink-0 text-amber-200" />
          <p>
            Это демонстрационный интерфейс. Сервис не принимает, не хранит, не
            резервирует и не переводит деньги.
          </p>
        </div>
      </div>

      <div className="grid gap-4">
        {deals.map((deal) => {
          const product = getProductById(deal.productId);
          const buyer = getUserById(deal.buyerId);
          const seller = getUserById(deal.sellerId);

          return (
            <Link
              key={deal.id}
              href={`/deals/${deal.id}`}
              className="grid gap-4 rounded-[8px] border border-white/10 bg-white/[0.045] p-5 transition hover:border-lime/35 md:grid-cols-[1fr_auto]"
            >
              <div>
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <StatusBadge status={deal.status} />
                  <Badge>{DEAL_METHOD_LABELS[deal.method]}</Badge>
                </div>
                <h2 className="text-xl font-semibold text-cream">
                  {product?.title ?? "Товар удален"}
                </h2>
                <p className="mt-2 text-sm text-cream/52">
                  Покупатель: {buyer?.displayName ?? "Покупатель"} · Продавец:{" "}
                  {seller?.displayName ?? "Продавец"} · {formatDate(deal.createdAt)}
                </p>
              </div>
              <div className="flex items-center justify-between gap-6 md:justify-end">
                <Price value={deal.amountKopecks} className="text-xl" />
                <ArrowUpRight aria-hidden className="h-5 w-5 text-lime" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
