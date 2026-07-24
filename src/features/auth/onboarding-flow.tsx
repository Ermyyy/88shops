"use client";

import { useActionState } from "react";
import { ArrowRight, UserRound } from "lucide-react";
import { completeOnboardingAction, skipOnboardingAction } from "@/lib/auth-actions";
import type { OnboardingActionState } from "@/lib/auth-types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

type OnboardingFlowProps = {
  callbackUrl: string;
  defaultAvatar?: string | null;
  defaultUsername?: string | null;
  defaultCity?: string | null;
  defaultBio?: string | null;
};

export function OnboardingFlow({
  callbackUrl,
  defaultAvatar,
  defaultUsername,
  defaultCity,
  defaultBio,
}: OnboardingFlowProps) {
  const [state, formAction, pending] = useActionState<OnboardingActionState, FormData>(
    completeOnboardingAction,
    {},
  );

  return (
    <main className="flex min-h-[calc(100svh-4rem)] items-center justify-center px-4 py-6 sm:px-6">
      <section className="w-full max-w-[30rem] rounded-[8px] border border-black/10 bg-white p-5 shadow-sm shadow-black/5 sm:p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[8px] bg-lime text-black">
            <UserRound aria-hidden className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-black">Настрой профиль</h1>
            <p className="mt-2 text-sm leading-6 text-black/58">
              Осталось выбрать ник и добавить пару деталей.
            </p>
          </div>
        </div>

        <form action={formAction} className="mt-6 grid gap-4">
          <input type="hidden" name="callbackUrl" value={callbackUrl} />

          <label>
            <span className="mb-2 block text-xs font-semibold text-black/45">
              Ник
            </span>
            <Input
              name="username"
              autoComplete="username"
              defaultValue={defaultUsername ?? ""}
              placeholder="your.nickname"
              required
            />
          </label>

          <label>
            <span className="mb-2 block text-xs font-semibold text-black/45">
              Город
            </span>
            <Input name="city" defaultValue={defaultCity ?? ""} placeholder="Москва" />
          </label>

          <label>
            <span className="mb-2 block text-xs font-semibold text-black/45">
              Аватар
            </span>
            <Input name="avatar" defaultValue={defaultAvatar ?? ""} placeholder="https://..." />
          </label>

          <label>
            <span className="mb-2 block text-xs font-semibold text-black/45">
              Короткое описание
            </span>
            <textarea
              name="bio"
              rows={3}
              defaultValue={defaultBio ?? ""}
              className="w-full resize-none rounded-[8px] border border-black/10 bg-white px-4 py-3 text-sm text-black outline-none transition placeholder:text-black/38 focus:border-black/40"
              placeholder="Что ищешь или продаешь на 88Shops"
            />
          </label>

          <label>
            <span className="mb-2 block text-xs font-semibold text-black/45">
              Интерес
            </span>
            <Select name="intent" defaultValue="BOTH">
              <option value="BUY">Покупать</option>
              <option value="SELL">Продавать</option>
              <option value="BOTH">И то и другое</option>
            </Select>
          </label>

          {state.error ? (
            <p className="rounded-[8px] border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {state.error}
            </p>
          ) : null}

          <div className="grid gap-2 pt-1">
            <Button type="submit" size="lg" disabled={pending}>
              Продолжить
              <ArrowRight aria-hidden className="h-5 w-5" />
            </Button>
            <button
              type="submit"
              formAction={skipOnboardingAction}
              className="min-h-10 rounded-[8px] px-4 text-sm font-semibold text-black/55 transition hover:bg-black/[0.04] hover:text-black"
            >
              Заполнить позже
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
