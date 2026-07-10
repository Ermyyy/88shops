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
    photos: z.array(imageFileSchema).min(1, "Добавьте минимум одно фото").max(6),
  })
  .refine((value) => value.clothingSize || value.shoeSize, {
    message: "Укажите размер одежды или обуви",
    path: ["clothingSize"],
  });

export const authFormSchema = z.object({
  firstName: z.string().min(2, "Введите имя"),
  lastName: z.string().min(2, "Введите фамилию"),
  username: z
    .string()
    .min(3, "Минимум 3 символа")
    .regex(/^[a-zA-Z0-9_]+$/, "Только латиница, цифры и _"),
  email: z.string().email("Проверь email"),
  password: z.string().min(8, "Пароль должен содержать минимум 8 символов"),
  confirmPassword: z.string().min(8, "Повторите пароль"),
  intent: z.enum(["BUY", "SELL", "BOTH"]),
  accepted: z.boolean().refine(Boolean, "Нужно принять правила сервиса"),
}).refine((value) => value.password === value.confirmPassword, {
  message: "Пароли не совпадают",
  path: ["confirmPassword"],
});

export const loginFormSchema = z.object({
  identifier: z.string().min(1, "Введите email или ник"),
  password: z.string().min(1, "Введите пароль"),
});

export const onboardingProfileSchema = z.object({
  avatar: z.string().optional(),
  cover: z.string().optional(),
  city: z.enum(CITIES),
  bio: z.string().max(220, "Коротко, до 220 символов").optional(),
  categories: z.array(z.enum(["одежда", "кроссовки", "аксессуары"])).min(1, "Выберите интересы"),
  authenticityPreference: z.enum(["ORIGINAL", "REPLICA", "BOTH"]),
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
export type AuthFormValues = z.infer<typeof authFormSchema>;
export type LoginFormValues = z.infer<typeof loginFormSchema>;
export type OnboardingProfileValues = z.infer<typeof onboardingProfileSchema>;
export type OnboardingInterestsValues = z.infer<typeof onboardingInterestsSchema>;
export type LegitCheckValues = z.infer<typeof legitCheckSchema>;
