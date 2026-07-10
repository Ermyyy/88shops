"use client";

import { useActionState, useState, type ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { ArrowRight, Eye, EyeOff, LockKeyhole, Send, Sparkles } from "lucide-react";
import {
  completeOnboardingAction,
  loginAction,
  registerAction,
  skipOnboardingAction,
} from "@/lib/auth-actions";
import type { AuthActionState, OnboardingActionState } from "@/lib/auth-types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  BRANDS,
  CITIES,
  CLOTHING_SIZES,
  DEAL_METHOD_LABELS,
  SHOE_SIZES,
} from "@/lib/constants";
import { cn } from "@/lib/utils";

type Mode = "register" | "login";

type AuthFlowProps = {
  callbackUrl: string;
  showOnboarding?: boolean;
};

const interestOptions = ["одежда", "кроссовки", "аксессуары"] as const;

export function AuthFlow({ callbackUrl, showOnboarding = false }: AuthFlowProps) {
  const [mode, setMode] = useState<Mode>("register");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [registerState, registerFormAction] = useActionState<AuthActionState, FormData>(
    registerAction,
    {},
  );
  const [loginState, loginFormAction] = useActionState<AuthActionState, FormData>(
    loginAction,
    {},
  );

  if (showOnboarding) {
    return <OnboardingFlow callbackUrl={callbackUrl} />;
  }

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
              FASHION RESALE MARKETPLACE
            </p>
            <h1 className="mt-5 max-w-2xl font-serif text-7xl leading-none text-cream">
              Покупай и продавай без лишнего шума.
            </h1>
            <p className="mt-6 max-w-lg text-base leading-7 text-cream/62">
              Одежда, кроссовки и магазины в одном месте. Один аккаунт для
              покупок, продаж и своего каталога.
            </p>
          </div>
        </div>
      </section>

      <section className="flex items-center justify-center px-4 py-10 sm:px-6 lg:px-12">
        <div className="w-full max-w-xl rounded-[8px] border border-white/10 bg-white/[0.045] p-5 sm:p-7">
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
                {item === "register" ? "Создать аккаунт" : "Войти"}
              </button>
            ))}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Button type="button" variant="secondary" disabled>
              <Send aria-hidden className="h-4 w-4" />
              Telegram скоро
            </Button>
            <Button type="button" variant="secondary" disabled>
              <Sparkles aria-hidden className="h-4 w-4" />
              Google скоро
            </Button>
          </div>

          {mode === "register" ? (
            <form action={registerFormAction} className="mt-6 grid gap-4">
              <input type="hidden" name="callbackUrl" value={callbackUrl} />
              <div>
                <h1 className="text-3xl font-semibold text-cream">Создать аккаунт</h1>
                <p className="mt-2 text-sm text-cream/56">Займёт меньше минуты.</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Имя">
                  <Input name="firstName" autoComplete="given-name" required />
                </Field>
                <Field label="Фамилия">
                  <Input name="lastName" autoComplete="family-name" required />
                </Field>
              </div>
              <Field
                label="Ник"
                helper="Так тебя увидят покупатели и продавцы."
              >
                <Input name="username" autoComplete="username" required />
              </Field>
              <Field label="Email">
                <Input name="email" type="email" autoComplete="email" required />
              </Field>
              <Field label="Пароль" helper="Минимум 8 символов.">
                <PasswordInput
                  name="password"
                  visible={passwordVisible}
                  onToggle={() => setPasswordVisible((value) => !value)}
                />
              </Field>
              <Field label="Повторите пароль">
                <Input
                  name="confirmPassword"
                  type={passwordVisible ? "text" : "password"}
                  autoComplete="new-password"
                  required
                />
              </Field>
              <Field label="Что планируешь делать?">
                <Select name="intent" defaultValue="BOTH">
                  <option value="BUY">Покупать</option>
                  <option value="SELL">Продавать</option>
                  <option value="BOTH">И то и другое</option>
                </Select>
              </Field>
              <label className="flex items-start gap-3 text-sm leading-6 text-cream/62">
                <input name="accepted" type="checkbox" className="mt-1 h-4 w-4 accent-lime" required />
                <span>Я принимаю правила сервиса и политику конфиденциальности</span>
              </label>
              {registerState.error ? <FormError>{registerState.error}</FormError> : null}
              <SubmitButton label="Создать аккаунт" />
              <p className="text-center text-sm text-cream/52">
                Уже есть аккаунт?{" "}
                <button
                  type="button"
                  className="font-semibold text-lime"
                  onClick={() => setMode("login")}
                >
                  Войти
                </button>
              </p>
            </form>
          ) : (
            <form action={loginFormAction} className="mt-6 grid gap-4">
              <input type="hidden" name="callbackUrl" value={callbackUrl} />
              <div>
                <h1 className="text-3xl font-semibold text-cream">Войти</h1>
                <p className="mt-2 text-sm text-cream/56">
                  Вернись к сохранённым вещам и своим объявлениям.
                </p>
              </div>
              <Field label="Email или ник">
                <Input name="identifier" autoComplete="username" required />
              </Field>
              <Field label="Пароль">
                <PasswordInput
                  name="password"
                  visible={passwordVisible}
                  onToggle={() => setPasswordVisible((value) => !value)}
                />
              </Field>
              <button
                type="button"
                disabled
                className="min-h-11 justify-self-start rounded-[8px] px-0 text-sm font-semibold text-cream/40"
              >
                Забыли пароль? Скоро
              </button>
              {loginState.error ? <FormError>{loginState.error}</FormError> : null}
              <SubmitButton label="Войти" />
              <p className="text-center text-sm text-cream/52">
                Нет аккаунта?{" "}
                <button
                  type="button"
                  className="font-semibold text-lime"
                  onClick={() => setMode("register")}
                >
                  Зарегистрироваться
                </button>
              </p>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}

function OnboardingFlow({ callbackUrl }: { callbackUrl: string }) {
  const [step, setStep] = useState<1 | 2>(1);
  const [state, formAction] = useActionState<OnboardingActionState, FormData>(
    completeOnboardingAction,
    {},
  );

  return (
    <div className="page-shell flex min-h-[calc(100vh-4rem)] items-center justify-center py-10">
      <div className="w-full max-w-3xl rounded-[8px] border border-white/10 bg-white/[0.045] p-5 sm:p-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-lime">
              {step === 1 ? "Профиль" : "Каталог"}
            </p>
            <h1 className="mt-3 text-3xl font-semibold text-cream">
              {step === 1 ? "Сделай профиль своим" : "Настроим каталог"}
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-cream/56">
              {step === 1
                ? "Добавь аватар, город и пару слов о себе. Так другим проще понять, с кем они общаются."
                : "Выбери бренды и размеры — так искать вещи будет быстрее."}
            </p>
          </div>
          <span className="rounded-[8px] border border-white/10 px-3 py-2 text-sm font-semibold text-cream/58">
            {step}/2
          </span>
        </div>

        <form action={formAction} className="grid gap-5">
          <input type="hidden" name="callbackUrl" value={callbackUrl} />
          <div className={cn("grid gap-4", step !== 1 && "hidden")}>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Аватар">
                <Input name="avatar" placeholder="Ссылка на фото" />
              </Field>
              <Field label="Обложка">
                <Input name="cover" placeholder="Ссылка на изображение" />
              </Field>
            </div>
            <Field label="Город">
              <Select name="city" defaultValue="Москва">
                {CITIES.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Короткое описание">
              <textarea
                name="bio"
                rows={4}
                className="w-full rounded-[8px] border border-white/10 bg-white/[0.055] px-4 py-3 text-sm text-cream outline-none transition placeholder:text-cream/38 focus:border-lime/70"
                placeholder="Что продаёшь, что ищешь, где удобно встретиться."
              />
            </Field>
            <CheckboxGroup title="Интересы" name="categories" values={interestOptions} />
            <Field label="Тип интересов">
              <Select name="authenticityPreference" defaultValue="BOTH">
                <option value="ORIGINAL">Original</option>
                <option value="REPLICA">Replica</option>
                <option value="BOTH">Всё</option>
              </Select>
            </Field>
          </div>

          <div className={cn("grid gap-4", step !== 2 && "hidden")}>
            <CheckboxGroup title="Любимые бренды" name="brands" values={BRANDS} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Размер одежды">
                <Select name="clothingSize" defaultValue="M">
                  {CLOTHING_SIZES.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Размер обуви">
                <Select name="shoeSize" defaultValue="42">
                  {SHOE_SIZES.map((size) => (
                    <option key={size} value={size}>
                      EU {size}
                    </option>
                  ))}
                </Select>
              </Field>
            </div>
            <Field label="Город">
              <Select name="dealCity" defaultValue="Москва">
                {CITIES.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </Select>
            </Field>
            <CheckboxGroup
              title="Способы сделки"
              name="dealMethods"
              values={Object.keys(DEAL_METHOD_LABELS)}
              labels={{
                PERSONAL_MEETING: "личная встреча",
                DIRECT: "напрямую",
                SAFE_DEAL: "безопасная сделка",
              }}
            />
          </div>

          {state.error ? <FormError>{state.error}</FormError> : null}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {step === 1 ? (
              <>
                <Button type="button" onClick={() => setStep(2)}>
                  Продолжить
                  <ArrowRight aria-hidden className="h-4 w-4" />
                </Button>
                <button
                  type="submit"
                  formAction={skipOnboardingAction}
                  className="min-h-11 rounded-[8px] px-4 text-sm font-semibold text-cream/55 transition hover:text-lime"
                >
                  Заполню позже
                </button>
              </>
            ) : (
              <>
                <Button type="button" variant="secondary" onClick={() => setStep(1)}>
                  Назад
                </Button>
                <SubmitButton label="Открыть 88Shops" />
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

function PasswordInput({
  name,
  visible,
  onToggle,
}: {
  name: string;
  visible: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="relative">
      <Input
        name={name}
        type={visible ? "text" : "password"}
        autoComplete={name === "password" ? "new-password" : "current-password"}
        required
      />
      <button
        type="button"
        onClick={onToggle}
        className="absolute right-2 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-[8px] text-cream/55 transition hover:text-lime"
        aria-label={visible ? "Скрыть пароль" : "Показать пароль"}
      >
        {visible ? <EyeOff aria-hidden className="h-4 w-4" /> : <Eye aria-hidden className="h-4 w-4" />}
      </button>
    </div>
  );
}

function CheckboxGroup({
  title,
  name,
  values,
  labels,
}: {
  title: string;
  name: string;
  values: readonly string[];
  labels?: Partial<Record<string, string>>;
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
            <input name={name} type="checkbox" value={value} className="h-4 w-4 accent-lime" />
            <span>{labels?.[value] ?? value}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

function Field({
  label,
  helper,
  children,
}: {
  label: string;
  helper?: string;
  children: ReactNode;
}) {
  return (
    <label>
      <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-cream/42">
        {label}
      </span>
      {children}
      {helper ? <span className="mt-2 block text-xs text-cream/42">{helper}</span> : null}
    </label>
  );
}

function FormError({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-[8px] border border-red-300/25 bg-red-400/10 p-3 text-sm text-red-100">
      {children}
    </div>
  );
}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" size="lg" className="w-full" disabled={pending}>
      <LockKeyhole aria-hidden className="h-4 w-4" />
      {pending ? "Секунду..." : label}
    </Button>
  );
}
