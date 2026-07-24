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
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-base font-bold text-cream">Фильтры</h2>
        <Button type="button" variant="ghost" size="sm" onClick={onReset}>
          <RotateCcw aria-hidden className="h-4 w-4" />
          Сброс
        </Button>
      </div>

      <Field label="Поиск">
        <Input
          value={filters.query}
          onChange={(event) => update("query", event.target.value)}
          placeholder="Бренд, модель, город"
        />
      </Field>

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

      <div className="grid grid-cols-2 gap-2">
        <Field label="Цена от">
          <Input
            type="number"
            inputMode="numeric"
            value={filters.priceFrom}
            onChange={(event) => update("priceFrom", event.target.value)}
            placeholder="0"
          />
        </Field>
        <Field label="Цена до">
          <Input
            type="number"
            inputMode="numeric"
            value={filters.priceTo}
            onChange={(event) => update("priceTo", event.target.value)}
            placeholder="100000"
          />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-2">
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

      <Field label="Состояние">
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
      </Field>

      <FilterSelect
        label="Город"
        value={filters.city}
        onChange={(value) => update("city", value)}
        options={CITIES}
      />

      <Field label="Тип">
        <Select
          value={filters.authenticityType}
          onChange={(event) => update("authenticityType", event.target.value)}
        >
          <option value="">Любой</option>
          {Object.entries(AUTHENTICITY_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
      </Field>

      <Field label="Сделка">
        <Select
          value={filters.dealMethod}
          onChange={(event) => update("dealMethod", event.target.value)}
        >
          <option value="">Любой способ</option>
          {Object.entries(DEAL_METHOD_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
      </Field>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-black/65">{label}</span>
      {children}
    </label>
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
    <Field label={label}>
      <Select value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="">Любой</option>
        {options.map((option) => (
          <option key={option} value={option} className={capitalize ? "capitalize" : undefined}>
            {option}
          </option>
        ))}
      </Select>
    </Field>
  );
}
