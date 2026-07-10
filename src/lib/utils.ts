import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Product } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(priceKopecks: number) {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(priceKopecks / 100);
}

export function formatDate(date: string) {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

export function getProductSize(product: Product) {
  if (product.shoeSize) {
    return `EU ${product.shoeSize}`;
  }

  return product.clothingSize ?? "One size";
}

export function getSafeDealCommission(amountKopecks: number) {
  return Math.round(amountKopecks * 0.05);
}

export function normalizeSearch(value: string) {
  return value.trim().toLowerCase();
}
