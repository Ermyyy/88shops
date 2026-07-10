"use client";

import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  AUTHENTICITY_LABELS,
  BRANDS,
  CATEGORIES,
  CITIES,
  CLOTHING_SIZES,
  CONDITION_LABELS,
  DEAL_METHOD_LABELS,
  SHOE_SIZES,
} from "@/lib/constants";
import type { CatalogFilters } from "@/types";

type FilterPanelProps = {
  filters: CatalogFilters;
  onChange: (filters: CatalogFilters) => void;
  onReset: () => void;
};

export const emptyFilters: CatalogFilters = {
  query: "",
  brand: "",
  category: "",
  priceFrom: "",
  priceTo: "",
  clothingSize: "",
  shoeSize: "",
  condition: "",
  city: "",
  authenticityType: "",
  dealMethod: "",
};

export function FilterPanel({ filters, onChange, onReset }: FilterPanelProps) {
  const update = (key: keyof CatalogFilters, value: string) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-cream">Фильтры</h2>
        <Button type="button" variant="ghost" size="sm" onClick={onReset}>
          <RotateCcw aria-hidden className="h-4 w-4" />
          Сброс
        </Button>
      </div>

      <label className="block space-y-2">
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-cream/42">
          Поиск
        </span>
        <Input
          value={filters.query}
          onChange={(event) => update("query", event.target.value)}
          placeholder="Бренд, модель, город..."
        />
      </label>

      <div className="grid gap-4">
        <FilterSelect
          label="Бренд"
          value={filters.brand}
          onChange={(value) => update("brand", value)}
          options={BRANDS}
        />
        <FilterSelect
          label="Категория"
          value={filters.category}
          onChange={(value) => update("category", value)}
          options={CATEGORIES}
          capitalize
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <label className="block space-y-2">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-cream/42">
            Цена от
          </span>
          <Input
            type="number"
            inputMode="numeric"
            value={filters.priceFrom}
            onChange={(event) => update("priceFrom", event.target.value)}
            placeholder="0"
          />
        </label>
        <label className="block space-y-2">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-cream/42">
            Цена до
          </span>
          <Input
            type="number"
            inputMode="numeric"
            value={filters.priceTo}
            onChange={(event) => update("priceTo", event.target.value)}
            placeholder="100000"
          />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <FilterSelect
          label="Одежда"
          value={filters.clothingSize}
          onChange={(value) => update("clothingSize", value)}
          options={CLOTHING_SIZES}
        />
        <FilterSelect
          label="Обувь"
          value={filters.shoeSize}
          onChange={(value) => update("shoeSize", value)}
          options={SHOE_SIZES}
        />
      </div>

      <label className="block space-y-2">
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-cream/42">
          Состояние
        </span>
        <Select
          value={filters.condition}
          onChange={(event) => update("condition", event.target.value)}
        >
          <option value="">Любое</option>
          {Object.entries(CONDITION_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
      </label>

      <FilterSelect
        label="Город"
        value={filters.city}
        onChange={(value) => update("city", value)}
        options={CITIES}
      />

      <label className="block space-y-2">
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-cream/42">
          Маркировка
        </span>
        <Select
          value={filters.authenticityType}
          onChange={(event) => update("authenticityType", event.target.value)}
        >
          <option value="">Любая</option>
          {Object.entries(AUTHENTICITY_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
      </label>

      <label className="block space-y-2">
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-cream/42">
          Способ сделки
        </span>
        <Select
          value={filters.dealMethod}
          onChange={(event) => update("dealMethod", event.target.value)}
        >
          <option value="">Любой</option>
          {Object.entries(DEAL_METHOD_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
      </label>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
  capitalize = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly string[];
  capitalize?: boolean;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-xs font-semibold uppercase tracking-[0.16em] text-cream/42">
        {label}
      </span>
      <Select value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="">Любой</option>
        {options.map((option) => (
          <option key={option} value={option} className={capitalize ? "capitalize" : undefined}>
            {option}
          </option>
        ))}
      </Select>
    </label>
  );
}
