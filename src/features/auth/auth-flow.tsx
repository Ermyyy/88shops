"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Mail, Send, Sparkles } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import { useForm, type UseFormRegisterReturn } from "react-hook-form";
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
  DEAL_METHOD_LABELS,
  SHOE_SIZES,
} from "@/lib/constants";
import {
  authFormSchema,
  onboardingInterestsSchema,
  onboardingProfileSchema,
  type AuthFormValues,
  type OnboardingInterestsValues,
  type OnboardingProfileValues,
} from "@/lib/validations";
import { cn } from "@/lib/utils";

type Step = "auth" | "profile" | "interests" | "success";
type Mode = "register" | "login";

export function AuthFlow() {
  const [step, setStep] = useState<Step>("auth");
  const [mode, setMode] = useState<Mode>("register");
  const [passwordVisible, setPasswordVisible] = useState(false);

  const authForm = useForm<AuthFormValues>({
    resolver: zodResolver(authFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
      intent: "BOTH",
      accepted: false,
    },
  });

  const profileForm = useForm<OnboardingProfileValues>({
    resolver: zodResolver(onboardingProfileSchema),
    defaultValues: {
      avatar: "",
      cover: "",
      city: "Москва",
      bio: "",
      categories: [],
      authenticityPreference: "BOTH",
    },
  });

  const interestsForm = useForm<OnboardingInterestsValues>({
    resolver: zodResolver(onboardingInterestsSchema),
    defaultValues: {
      brands: [],
      clothingSize: "M",
      shoeSize: "42",
      city: "Москва",
      dealMethods: ["PERSONAL_MEETING"],
    },
  });

  const handleProvider = (provider: "Telegram" | "Google") => {
    toast(`${provider} пока mocked. Реального OAuth/Login редиректа нет.`);
  };

  return (
    <div className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-[52%_48%]">
      <section className="relative hidden overflow-hidden border-r border-white/10 lg:block">
        <div className="absolute inset-0 wet-fabric" />
        <div className="absolute inset-0 bg-gradient-to-t from-night via-night/35 to-transparent" />
        <div className="relative flex h-full flex-col justify-between p-10">
          <div className="inline-flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-lime text-sm font-black text-black">
              88
            </span>
            <span className="text-xl font-semibold text-cream">88Shops</span>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-lime">
              Единый аккаунт
            </p>
            <h1 className="mt-5 max-w-2xl font-serif text-7xl leading-none text-cream">
              Покупай, продавай и развивай свой магазин.
            </h1>
            <div className="mt-10 grid gap-3">
              {["создание аккаунта", "оформление профиля", "настройка интересов"].map(
                (item, index) => (
                  <div
                    key={item}
                    className="flex items-center gap-4 rounded-[8px] border border-white/10 bg-black/25 p-4"
                  >
                    <span className="grid h-8 w-8 place-items-center rounded-[8px] bg-lime text-sm font-black text-black">
                      {index + 1}
                    </span>
                    <span className="text-sm font-semibold text-cream">{item}</span>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="flex items-center justify-center px-4 py-10 sm:px-6 lg:px-12">
        <div className="w-full max-w-xl rounded-[8px] border border-white/10 bg-white/[0.045] p-5 sm:p-7">
          {step === "auth" ? (
            <>
              <div className="mb-6 flex rounded-[8px] border border-white/10 bg-black/20 p-1">
                {(["register", "login"] as const).map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setMode(item)}
                    className={cn(
                      "min-h-11 flex-1 rounded-[7px] text-sm font-semibold text-cream/55 transition",
                      mode === item && "bg-lime text-black",
                    )}
                  >
                    {item === "register" ? "Регистрация" : "Вход"}
                  </button>
                ))}
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <Button type="button" variant="secondary" onClick={() => handleProvider("Telegram")}>
                  <Send aria-hidden className="h-4 w-4" />
                  Telegram
                </Button>
                <Button type="button" variant="secondary" onClick={() => handleProvider("Google")}>
                  <Sparkles aria-hidden className="h-4 w-4" />
                  Google
                </Button>
              </div>

              <form
                className="mt-6 grid gap-4"
                onSubmit={authForm.handleSubmit(() => {
                  toast(
                    mode === "register"
                      ? "Demo-регистрация прошла локальную проверку."
                      : "Demo-вход показан без создания серверной сессии.",
                  );
                  setStep(mode === "register" ? "profile" : "success");
                  authForm.setValue("password", "");
                })}
              >
                {mode === "register" ? (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Имя" error={authForm.formState.errors.firstName?.message}>
                      <Input {...authForm.register("firstName")} />
                    </Field>
                    <Field label="Фамилия" error={authForm.formState.errors.lastName?.message}>
                      <Input {...authForm.register("lastName")} />
                    </Field>
                    <Field label="Username" error={authForm.formState.errors.username?.message} className="sm:col-span-2">
                      <Input {...authForm.register("username")} placeholder="latin_username" />
                    </Field>
                  </div>
                ) : null}

                <Field label="Email" error={authForm.formState.errors.email?.message}>
                  <Input type="email" {...authForm.register("email")} />
                </Field>
                <Field label="Пароль" error={authForm.formState.errors.password?.message}>
                  <div className="relative">
                    <Input
                      type={passwordVisible ? "text" : "password"}
                      {...authForm.register("password")}
                    />
                    <button
                      type="button"
                      onClick={() => setPasswordVisible((value) => !value)}
                      className="absolute right-2 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-[8px] text-cream/55 transition hover:text-lime"
                      aria-label={passwordVisible ? "Скрыть пароль" : "Показать пароль"}
                    >
                      {passwordVisible ? (
                        <EyeOff aria-hidden className="h-4 w-4" />
                      ) : (
                        <Eye aria-hidden className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </Field>

                {mode === "register" ? (
                  <>
                    <Field label="Сценарий" error={authForm.formState.errors.intent?.message}>
                      <Select {...authForm.register("intent")}>
                        <option value="BUY">Покупать</option>
                        <option value="SELL">Продавать</option>
                        <option value="BOTH">Покупать и продавать</option>
                      </Select>
                    </Field>
                    <label className="flex items-start gap-3 text-sm leading-6 text-cream/62">
                      <input
                        type="checkbox"
                        {...authForm.register("accepted")}
                        className="mt-1 h-4 w-4 accent-lime"
                      />
                      <span>
                        Я понимаю, что это demo-MVP без production auth, реальных
                        платежей и email-отправки.
                      </span>
                    </label>
                    {authForm.formState.errors.accepted ? (
                      <p className="text-sm text-red-200">
                        {authForm.formState.errors.accepted.message}
                      </p>
                    ) : null}
                  </>
                ) : null}

                <Button type="submit" size="lg" className="w-full">
                  <Mail aria-hidden className="h-4 w-4" />
                  {mode === "register" ? "Продолжить" : "Войти demo"}
                </Button>
              </form>
            </>
          ) : null}

          {step === "profile" ? (
            <form
              className="grid gap-4"
              onSubmit={profileForm.handleSubmit(() => {
                toast("Профиль локально заполнен. Дальше интересы.");
                setStep("interests");
              })}
            >
              <StepTitle title="Оформление профиля" />
              <Field label="Аватар" error={profileForm.formState.errors.avatar?.message}>
                <Input {...profileForm.register("avatar")} placeholder="URL или будущая загрузка" />
              </Field>
              <Field label="Обложка" error={profileForm.formState.errors.cover?.message}>
                <Input {...profileForm.register("cover")} placeholder="URL или будущая загрузка" />
              </Field>
              <Field label="Город" error={profileForm.formState.errors.city?.message}>
                <Select {...profileForm.register("city")}>
                  {CITIES.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Bio" error={profileForm.formState.errors.bio?.message}>
                <textarea
                  {...profileForm.register("bio")}
                  rows={4}
                  className="w-full rounded-[8px] border border-white/10 bg-white/[0.055] px-4 py-3 text-sm text-cream outline-none focus:border-lime/70"
                />
              </Field>
              <CheckboxGroup
                title="Категории"
                values={CATEGORIES}
                register={profileForm.register("categories")}
              />
              {profileForm.formState.errors.categories ? (
                <p className="text-sm text-red-200">
                  {profileForm.formState.errors.categories.message}
                </p>
              ) : null}
              <Field label="Предпочтение" error={profileForm.formState.errors.authenticityPreference?.message}>
                <Select {...profileForm.register("authenticityPreference")}>
                  <option value="ORIGINAL">{AUTHENTICITY_LABELS.ORIGINAL}</option>
                  <option value="REPLICA">{AUTHENTICITY_LABELS.REPLICA}</option>
                  <option value="BOTH">Both</option>
                </Select>
              </Field>
              <Button type="submit" size="lg">Дальше</Button>
            </form>
          ) : null}

          {step === "interests" ? (
            <form
              className="grid gap-4"
              onSubmit={interestsForm.handleSubmit(() => {
                toast("Demo onboarding завершен. Реальный пользователь не создан.");
                setStep("success");
              })}
            >
              <StepTitle title="Интересы и размеры" />
              <CheckboxGroup
                title="Любимые бренды"
                values={BRANDS}
                register={interestsForm.register("brands")}
              />
              {interestsForm.formState.errors.brands ? (
                <p className="text-sm text-red-200">
                  {interestsForm.formState.errors.brands.message}
                </p>
              ) : null}
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Одежда" error={interestsForm.formState.errors.clothingSize?.message}>
                  <Select {...interestsForm.register("clothingSize")}>
                    {CLOTHING_SIZES.map((size) => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </Select>
                </Field>
                <Field label="Обувь" error={interestsForm.formState.errors.shoeSize?.message}>
                  <Select {...interestsForm.register("shoeSize")}>
                    {SHOE_SIZES.map((size) => (
                      <option key={size} value={size}>EU {size}</option>
                    ))}
                  </Select>
                </Field>
              </div>
              <Field label="Город" error={interestsForm.formState.errors.city?.message}>
                <Select {...interestsForm.register("city")}>
                  {CITIES.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </Select>
              </Field>
              <CheckboxGroup
                title="Способы сделки"
                values={Object.keys(DEAL_METHOD_LABELS)}
                labels={DEAL_METHOD_LABELS}
                register={interestsForm.register("dealMethods")}
              />
              <Button type="submit" size="lg">Завершить demo</Button>
            </form>
          ) : null}

          {step === "success" ? (
            <div className="py-10 text-center">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-lime text-black">
                <Sparkles aria-hidden className="h-7 w-7" />
              </div>
              <h2 className="mt-6 font-serif text-5xl text-cream">Готово</h2>
              <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-cream/58">
                Это demo success state. Серверная сессия, создание пользователя,
                Telegram Login, Google OAuth и email пока не реализованы.
              </p>
              <Button type="button" className="mt-7" onClick={() => setStep("auth")}>
                Вернуться к форме
              </Button>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}

function StepTitle({ title }: { title: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-lime">
        Onboarding
      </p>
      <h2 className="mt-3 text-3xl font-semibold text-cream">{title}</h2>
    </div>
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
  children: ReactNode;
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

function CheckboxGroup({
  title,
  values,
  labels,
  register,
}: {
  title: string;
  values: readonly string[];
  labels?: Partial<Record<string, string>>;
  register: UseFormRegisterReturn;
}) {
  return (
    <div>
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-cream/42">
        {title}
      </p>
      <div className="grid gap-2 sm:grid-cols-2">
        {values.map((value) => (
          <label
            key={value}
            className="flex min-h-11 items-center gap-3 rounded-[8px] border border-white/10 bg-black/18 px-3 text-sm text-cream/70"
          >
            <input type="checkbox" value={value} {...register} className="h-4 w-4 accent-lime" />
            <span>{labels?.[value] ?? value}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
