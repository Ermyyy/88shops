import type { DealStatus } from "@/types";
import { Badge } from "@/components/ui/badge";

const labels: Record<DealStatus, string> = {
  PENDING: "Ожидает",
  AWAITING_PAYMENT: "Ожидает оплаты",
  PAID: "Оплачено",
  SHIPPED: "Отправлено",
  DELIVERED: "Доставлено",
  CONFIRMED: "Подтверждено",
  DISPUTED: "Спор",
  CANCELLED: "Отменено",
  COMPLETED: "Завершено",
};

export function StatusBadge({ status }: { status: DealStatus }) {
  const variant =
    status === "DISPUTED" || status === "CANCELLED"
      ? "danger"
      : status === "COMPLETED" || status === "CONFIRMED"
        ? "lime"
        : "warning";

  return <Badge variant={variant}>{labels[status]}</Badge>;
}
