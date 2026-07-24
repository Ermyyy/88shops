import { z } from "zod";
import {
  BRANDS,
  CATEGORIES,
  CITIES,
  CLOTHING_SIZES,
  SHOE_SIZES,
} from "@/lib/constants";

const imageFileSchema = z
  .custom<File>((file) => file instanceof File, "Добавьте файл")
  .refine((file) => file.size <= 6 * 1024 * 1024, "Файл должен быть до 6 МБ")
  .refine(
    (file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type),
    "Поддерживаются JPEG, PNG или WebP",
  );

export const sellFormSchema = z
  .object({
    title: z.string().min(5, "Название должно быть длиннее 5 символов"),
    brand: z.enum(BRANDS),
    category: z.enum(CATEGORIES),
    clothingSize: z.string().optional(),
    shoeSize: z.string().optional(),
    price: z.coerce.number().min(1_000, "Укажите цену от 1 000 ₽"),
    authenticityType: z.enum(["ORIGINAL", "REPLICA"]),
    condition: z.enum([
      "NEW_WITH_TAGS",
      "NEW_WITHOUT_TAGS",
      "EXCELLENT",
      "GOOD",
      "FAIR",
    ]),
    description: z.string().min(40, "Опишите состояние и детали вещи"),
    city: z.enum(CITIES),
    dealMethods: z.array(z.enum(["PERSONAL_MEETING", "DIRECT", "SAFE_DEAL"])).min(1),
    photos: z.array(imageFileSchema).max(6).optional().default([]),
  })
  .refine((value) => value.clothingSize || value.shoeSize, {
    message: "Укажите размер одежды или обуви",
    path: ["clothingSize"],
  });

export const onboardingProfileSchema = z.object({
  username: z
    .string()
    .trim()
    .toLowerCase()
    .min(3, "Минимум 3 символа")
    .max(24, "Максимум 24 символа")
    .regex(/^[a-z0-9_.]+$/, "Только латиница, цифры, _ и ."),
  city: z.string().trim().max(80, "Слишком длинный город").optional(),
  avatar: z.string().trim().url("Проверь ссылку на аватар").or(z.literal("")).optional(),
  bio: z.string().trim().max(220, "Коротко, до 220 символов").optional(),
  intent: z.enum(["BUY", "SELL", "BOTH"]),
});

export const onboardingInterestsSchema = z.object({
  brands: z.array(z.enum(BRANDS)).min(1, "Выберите бренды"),
  clothingSize: z.enum(CLOTHING_SIZES),
  shoeSize: z.enum(SHOE_SIZES),
  city: z.enum(CITIES),
  dealMethods: z.array(z.enum(["PERSONAL_MEETING", "DIRECT", "SAFE_DEAL"])).min(1),
});

export const legitCheckSchema = z.object({
  images: z.array(imageFileSchema).min(1).max(8),
  brand: z.enum(BRANDS),
  model: z.string().min(2, "Укажите модель"),
  comment: z.string().max(600).optional(),
});

export type SellFormValues = z.infer<typeof sellFormSchema>;
export type OnboardingProfileValues = z.infer<typeof onboardingProfileSchema>;
export type OnboardingInterestsValues = z.infer<typeof onboardingInterestsSchema>;
export type LegitCheckValues = z.infer<typeof legitCheckSchema>;
