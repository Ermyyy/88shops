"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Phone, Send, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type AuthFlowProps = {
  callbackUrl?: string;
  initialError?: string;
};

export function AuthFlow({ callbackUrl = "/catalog", initialError = "" }: AuthFlowProps) {
  const [error, setError] = useState(initialError);
  const [pendingTelegram, setPendingTelegram] = useState(false);
  const [phoneOpen, setPhoneOpen] = useState(false);

  async function handleTelegramLogin() {
    setPendingTelegram(true);
    setError("");

    try {
      await signIn("telegram", {
        redirectTo: callbackUrl,
      });
    } catch (authError) {
      console.error("[telegram-oidc-auth]", authError);
      setError("Вход через Telegram временно недоступен. Попробуй ещё раз.");
      setPendingTelegram(false);
    }
  }

  return (
    <main className="flex min-h-[calc(100svh-4rem)] items-center justify-center px-4 py-6 sm:px-6">
      <section className="w-full max-w-[26rem] rounded-[8px] border border-black/10 bg-white p-5 shadow-sm shadow-black/5 sm:p-6">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-black">
            <span className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-lime text-sm font-black text-black">
              88
            </span>
            <span className="text-xl font-semibold">88Shops</span>
          </Link>

          <h1 className="mt-5 text-2xl font-semibold text-black">Войти в 88Shops</h1>

          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-black/60">
            Один аккаунт для покупок, продаж и избранного.
          </p>
        </div>

        <div className="mt-6 grid gap-3">
          <Button
            type="button"
            size="lg"
            className="w-full"
            onClick={handleTelegramLogin}
            disabled={pendingTelegram}
          >
            <Send aria-hidden="true" className="h-5 w-5" />
            {pendingTelegram ? "Открываем Telegram..." : "Продолжить с Telegram"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="lg"
            className="w-full"
            onClick={() => setPhoneOpen((value) => !value)}
          >
            <Phone aria-hidden="true" className="h-5 w-5" />
            Войти по номеру
          </Button>
        </div>

        {phoneOpen ? (
          <div className="mt-4 rounded-[8px] border border-black/10 bg-[#f6f6f4] p-3">
            <label className="grid gap-2 text-sm font-semibold text-black/60">
              Телефон
              <Input inputMode="tel" placeholder="+7 999 123-45-67" disabled />
            </label>
            <p className="mt-3 text-sm leading-6 text-black/55">
              Вход по номеру скоро появится. SMS пока не отправляем.
            </p>
          </div>
        ) : null}

        {error ? (
          <p
            role="alert"
            className="mt-4 rounded-[8px] border border-red-200 bg-red-50 p-3 text-sm leading-6 text-red-700"
          >
            {error}
          </p>
        ) : null}

        <p className="mt-5 text-center text-xs leading-5 text-black/45">
          Продолжая, ты принимаешь правила сервиса и политику конфиденциальности.
        </p>

        <div className="mt-5 flex justify-center">
          <Link
            href="/catalog"
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-[8px] px-3 text-sm font-semibold text-black/60 transition hover:bg-black/[0.04] hover:text-black"
          >
            <ShieldCheck aria-hidden="true" className="h-4 w-4" />В каталог
          </Link>
        </div>
      </section>
    </main>
  );
}
