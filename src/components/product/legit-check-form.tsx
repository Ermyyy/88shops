"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ShieldQuestion, Trash2, UploadCloud } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useMemo } from "react";
import { useDropzone } from "react-dropzone";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { BRANDS } from "@/lib/constants";
import { legitCheckSchema, type LegitCheckValues } from "@/lib/validations";

const EMPTY_FILES: File[] = [];

export function LegitCheckForm() {
  const {
    register,
    setValue,
    control,
    formState: { errors },
  } = useForm<LegitCheckValues>({
    resolver: zodResolver(legitCheckSchema),
    defaultValues: {
      images: [],
      brand: "Stone Island",
      model: "",
      comment: "",
    },
  });

  const watchedImages = useWatch({ control, name: "images" });
  const images = watchedImages ?? EMPTY_FILES;
  const previews = useMemo(
    () =>
      images.map((file) => ({
        name: file.name,
        url: URL.createObjectURL(file),
      })),
    [images],
  );

  useEffect(() => {
    return () => previews.forEach((preview) => URL.revokeObjectURL(preview.url));
  }, [previews]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    maxFiles: 8,
    maxSize: 6 * 1024 * 1024,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
    },
    onDrop: (acceptedFiles) =>
      setValue("images", [...images, ...acceptedFiles].slice(0, 8), {
        shouldValidate: true,
        shouldDirty: true,
      }),
    onDropRejected: () => toast("Фото не подходит: нужен JPEG, PNG или WebP до 6 МБ."),
  });

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="grid gap-6 lg:grid-cols-[1fr_22rem]"
    >
      <section className="rounded-[8px] border border-white/10 bg-white/[0.045] p-5">
        <h2 className="mb-5 text-2xl font-semibold text-cream">Материалы</h2>
        <div
          {...getRootProps()}
          className="flex min-h-56 cursor-pointer flex-col items-center justify-center rounded-[8px] border border-dashed border-white/18 bg-black/24 p-6 text-center transition hover:border-lime/50"
        >
          <input {...getInputProps()} />
          <UploadCloud aria-hidden className="h-10 w-10 text-lime" />
          <p className="mt-4 font-semibold text-cream">
            {isDragActive ? "Отпустите изображения" : "Добавьте фото вещи и деталей"}
          </p>
          <p className="mt-2 max-w-md text-sm leading-6 text-cream/50">
            Бирки, швы, фурнитура, подошва, коробка. Первые фото помогут быстрее разобраться в вещи.
          </p>
        </div>
        {errors.images ? (
          <p className="mt-3 text-sm text-red-200">{errors.images.message}</p>
        ) : null}
        {previews.length > 0 ? (
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {previews.map((preview) => (
              <div
                key={preview.url}
                className="relative aspect-square overflow-hidden rounded-[8px] border border-white/10"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={preview.url} alt={preview.name} className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() =>
                    setValue(
                      "images",
                      images.filter((file) => file.name !== preview.name),
                      { shouldValidate: true },
                    )
                  }
                  className="absolute right-2 top-2 grid h-9 w-9 place-items-center rounded-[8px] bg-black/70 text-cream hover:text-lime"
                  aria-label="Удалить фото"
                >
                  <Trash2 aria-hidden className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        ) : null}
      </section>

      <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-[8px] border border-white/10 bg-white/[0.045] p-5">
          <ShieldQuestion aria-hidden className="h-7 w-7 text-lime" />
          <h2 className="mt-4 text-2xl font-semibold text-cream">Готовим запуск</h2>
          <p className="mt-3 text-sm leading-6 text-cream/58">
            Проверка вещи появится позже. Пока можно подготовить фото, бренд, модель и комментарий.
          </p>
        </div>
        <Field label="Бренд" error={errors.brand?.message}>
          <Select {...register("brand")}>
            {BRANDS.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Модель" error={errors.model?.message}>
          <Input {...register("model")} placeholder="Например, Maya, Dunk Low..." />
        </Field>
        <Field label="Комментарий" error={errors.comment?.message}>
          <textarea
            {...register("comment")}
            rows={5}
            className="w-full rounded-[8px] border border-white/10 bg-white/[0.055] px-4 py-3 text-sm text-cream outline-none focus:border-lime/70"
            placeholder="Что смущает, какие документы есть, где покупали..."
          />
        </Field>
        <Button type="button" size="lg" className="w-full" disabled>
          Отправка скоро
        </Button>
      </aside>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-cream/42">
        {label}
      </span>
      {children}
      {error ? <span className="mt-2 block text-sm text-red-200">{error}</span> : null}
    </label>
  );
}
