import type { DealMethod, ProductCondition } from "@/types";

export const SITE_NAME = "88Shops";
export const SITE_DESCRIPTION =
  "Премиальный fashion resale marketplace для одежды, обуви и аксессуаров.";

export const ACCENT = "#D9FF43";

export const BRANDS = [
  "Stone Island",
  "CP Company",
  "Nike",
  "Louis Vuitton",
  "Gucci",
  "Rick Owens",
  "Supreme",
  "Moncler",
  "Balenciaga",
  "The North Face",
] as const;

export const CATEGORIES = [
  "куртки",
  "худи",
  "футболки",
  "брюки",
  "кроссовки",
  "сумки",
  "аксессуары",
] as const;

export const CITIES = [
  "Москва",
  "Санкт-Петербург",
  "Казань",
  "Екатеринбург",
  "Новосибирск",
  "Сочи",
] as const;

export const CLOTHING_SIZES = ["XS", "S", "M", "L", "XL", "XXL"] as const;

export const SHOE_SIZES = ["39", "40", "41", "42", "43", "44", "45"] as const;

export const CONDITION_LABELS: Record<ProductCondition, string> = {
  NEW_WITH_TAGS: "Новая с бирками",
  NEW_WITHOUT_TAGS: "Новая без бирок",
  EXCELLENT: "Отличное",
  GOOD: "Хорошее",
  FAIR: "С заметным износом",
};

export const DEAL_METHOD_LABELS: Record<DealMethod, string> = {
  PERSONAL_MEETING: "Личная встреча",
  DIRECT: "Прямая сделка",
  SAFE_DEAL: "Безопасная сделка",
};

export const DEAL_METHOD_DESCRIPTIONS: Record<DealMethod, string> = {
  PERSONAL_MEETING: "Осмотр и передача вещи лично, комиссия 0%.",
  DIRECT: "Вы договариваетесь напрямую с продавцом, комиссия 0%.",
  SAFE_DEAL:
    "Будущая защищенная опция 88Shops с комиссией 5%. Реальные платежи пока не подключены.",
};

export const AUTHENTICITY_LABELS = {
  ORIGINAL: "Original",
  REPLICA: "Replica",
} as const;

export const DEAL_STATUSES = [
  "PENDING",
  "AWAITING_PAYMENT",
  "PAID",
  "SHIPPED",
  "DELIVERED",
  "CONFIRMED",
  "DISPUTED",
  "CANCELLED",
  "COMPLETED",
] as const;
