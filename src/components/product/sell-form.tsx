"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus, Trash2, UploadCloud } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useForm, useWatch, type Resolver } from "react-hook-form";
import { toast } from "sonner";
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
import { sellFormSchema, type SellFormValues } from "@/lib/validations";

const defaultValues: SellFormValues = {
  title: "",
  brand: "Stone Island",
  category: "куртки",
  clothingSize: "",
  shoeSize: "",
  price: 0,
  authenticityType: "ORIGINAL",
  condition: "EXCELLENT",
  description: "",
  city: "Москва",
  dealMethods: ["PERSONAL_MEETING"],
  photos: [],
};

const EMPTY_FILES: File[] = [];

export function SellForm() {
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
    reset,
  } = useForm<SellFormValues>({
    resolver: zodResolver(sellFormSchema) as Resolver<SellFormValues>,
    defaultValues,
    mode: "onBlur",
  });

  const watchedPhotos = useWatch({ control, name: "photos" });
  const photos = watchedPhotos ?? EMPTY_FILES;
  const previews = useMemo(
    () =>
      photos.map((file) => ({
        name: file.name,
        url: URL.createObjectURL(file),
      })),
    [photos],
  );

  useEffect(() => {
    return () => {
      previews.forEach((preview) => URL.revokeObjectURL(preview.url));
    };
  }, [previews]);

  const onDrop = (acceptedFiles: File[]) => {
    const nextFiles = [...photos, ...acceptedFiles].slice(0, 6);
    setValue("photos", nextFiles, { shouldDirty: true, shouldValidate: true });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 6,
    maxSize: 6 * 1024 * 1024,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
    },
    onDropRejected: () =>
      toast("Фото не прошло проверку: нужен JPEG, PNG или WebP до 6 МБ."),
  });

  const removePhoto = (name: string) => {
    setValue(
      "photos",
      photos.filter((file) => file.name !== name),
      { shouldDirty: true, shouldValidate: true },
    );
  };

  const onSubmit = async () => {
    setSubmitting(true);
    await new Promise((resolve) => window.setTimeout(resolve, 500));
    toast("Demo: объявление прошло локальную валидацию. В базу оно не сохранено.");
    reset(defaultValues);
    setSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 lg:grid-cols-[1fr_24rem]">
      <section className="space-y-6">
        <div className="rounded-[8px] border border-white/10 bg-white/[0.045] p-5">
          <h2 className="mb-5 text-2xl font-semibold text-cream">Фотографии</h2>
          <div
            {...getRootProps()}
            className="flex min-h-56 cursor-pointer flex-col items-center justify-center rounded-[8px] border border-dashed border-white/18 bg-black/24 p-6 text-center transition hover:border-lime/50"
          >
            <input {...getInputProps()} />
            <UploadCloud aria-hidden className="h-10 w-10 text-lime" />
            <p className="mt-4 font-semibold text-cream">
              {isDragActive ? "Отпустите файлы здесь" : "Перетащите фото или выберите файлы"}
            </p>
            <p className="mt-2 max-w-md text-sm leading-6 text-cream/50">
              До 6 изображений, JPEG/PNG/WebP, максимум 6 МБ каждое. Загрузка в
              облако в MVP не выполняется.
            </p>
          </div>
          {errors.photos ? (
            <p className="mt-3 text-sm text-red-200">{errors.photos.message}</p>
          ) : null}
          {previews.length > 0 ? (
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {previews.map((preview) => (
                <div
                  key={preview.url}
                  className="group relative aspect-square overflow-hidden rounded-[8px] border border-white/10 bg-graphite"
                >
                  {/* Local object URLs are intentionally rendered with img, not uploaded. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={preview.url} alt={preview.name} className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removePhoto(preview.name)}
                    className="absolute right-2 top-2 inline-flex h-9 w-9 items-center justify-center rounded-[8px] bg-black/70 text-cream transition hover:text-lime"
                    aria-label="Удалить фото"
                  >
                    <Trash2 aria-hidden className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <div className="rounded-[8px] border border-white/10 bg-white/[0.045] p-5">
          <h2 className="mb-5 text-2xl font-semibold text-cream">Описание</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Название" error={errors.title?.message} className="sm:col-span-2">
              <Input {...register("title")} placeholder="Например, Stone Island Nylon Jacket" />
            </Field>
            <Field label="Бренд" error={errors.brand?.message}>
              <Select {...register("brand")}>
                {BRANDS.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Категория" error={errors.category?.message}>
              <Select {...register("category")}>
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Размер одежды" error={errors.clothingSize?.message}>
              <Select {...register("clothingSize")}>
                <option value="">Не указано</option>
                {CLOTHING_SIZES.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Размер обуви" error={errors.shoeSize?.message}>
              <Select {...register("shoeSize")}>
                <option value="">Не указано</option>
                {SHOE_SIZES.map((size) => (
                  <option key={size} value={size}>
                    EU {size}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Цена, ₽" error={errors.price?.message}>
              <Input type="number" inputMode="numeric" {...register("price")} />
            </Field>
            <Field label="Город" error={errors.city?.message}>
              <Select {...register("city")}>
                {CITIES.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Original / Replica" error={errors.authenticityType?.message}>
              <Select {...register("authenticityType")}>
                {Object.entries(AUTHENTICITY_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Состояние" error={errors.condition?.message}>
              <Select {...register("condition")}>
                {Object.entries(CONDITION_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Описание" error={errors.description?.message} className="sm:col-span-2">
              <textarea
                {...register("description")}
                rows={7}
                placeholder="Состояние, посадка, комплект, нюансы, где удобно встретиться..."
                className="w-full rounded-[8px] border border-white/10 bg-white/[0.055] px-4 py-3 text-sm text-cream outline-none transition placeholder:text-cream/38 focus:border-lime/70"
              />
            </Field>
          </div>
        </div>
      </section>

      <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-[8px] border border-white/10 bg-white/[0.045] p-5">
          <h2 className="mb-4 text-2xl font-semibold text-cream">Способы сделки</h2>
          <div className="space-y-3">
            {Object.entries(DEAL_METHOD_LABELS).map(([value, label]) => (
              <label
                key={value}
                className="flex min-h-12 items-center gap-3 rounded-[8px] border border-white/10 bg-black/20 px-3 text-sm text-cream/70"
              >
                <input
                  type="checkbox"
                  value={value}
                  {...register("dealMethods")}
                  className="h-4 w-4 accent-lime"
                />
                <span>{label}</span>
              </label>
            ))}
          </div>
          {errors.dealMethods ? (
            <p className="mt-3 text-sm text-red-200">{errors.dealMethods.message}</p>
          ) : null}
        </div>

        <div className="rounded-[8px] border border-lime/20 bg-lime/10 p-5">
          <ImagePlus aria-hidden className="h-6 w-6 text-lime" />
          <h2 className="mt-4 font-semibold text-cream">Demo workflow</h2>
          <p className="mt-2 text-sm leading-6 text-cream/58">
            Форма проверяет данные на клиенте, но production-версия должна
            повторно валидировать их на сервере, проверять права и загружать
            изображения через безопасный storage.
          </p>
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={submitting}>
          {submitting ? "Проверяем..." : "Опубликовать demo"}
        </Button>
      </aside>
    </form>
  );
}

function Field({
  label,
  error,
  children,
  className,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={className}>
      <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-cream/42">
        {label}
      </span>
      {children}
      {error ? <span className="mt-2 block text-sm text-red-200">{error}</span> : null}
    </label>
  );
}
