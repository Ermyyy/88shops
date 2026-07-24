"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Script from "next/script";
import { signIn } from "next-auth/react";
import { Send, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";

type AuthFlowProps = {
  /**
   * Куда перейти после успешной авторизации.
   *
   * Например:
   * /catalog
   * /profile
   * /sell
   */
  callbackUrl?: string;

  /**
   * Ошибка, которая могла прийти из URL или server component.
   */
  initialError?: string;

  /**
   * Username Telegram-бота без символа @.
   *
   * Например:
   * shops88_bot
   */
  telegramBotUsername?: string;
};

/**
 * Данные, которые официальный Telegram Login Widget
 * передаёт после успешного подтверждения пользователя.
 */
type TelegramLoginUser = {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
};

/**
 * Дополняем стандартный тип Window объектами Telegram.
 */
type TelegramWindow = Window & {
  Telegram?: {
    WebApp?: {
      /**
       * Подписанные данные пользователя,
       * когда сайт открыт внутри Telegram Mini App.
       */
      initData?: string;

      /**
       * Сообщает Telegram, что Mini App загрузилось.
       */
      ready?: () => void;

      /**
       * Разворачивает Mini App по высоте.
       */
      expand?: () => void;
    };
  };

  /**
   * Эту функцию вызывает официальный Telegram Login Widget.
   */
  onTelegramAuth?: (user: TelegramLoginUser) => void;
};

export function AuthFlow({
  callbackUrl = "/catalog",
  initialError = "",
  telegramBotUsername,
}: AuthFlowProps) {
  /**
   * Сообщение об ошибке или временное уведомление.
   */
  const [error, setError] = useState(initialError);

  /**
   * Показывает, выполняется ли сейчас Telegram-вход.
   */
  const [pendingTelegram, setPendingTelegram] = useState(false);

  /**
   * Нужно ли показать официальный Telegram Login Widget.
   *
   * Он используется в обычном браузере.
   * Внутри Telegram Mini App виджет не нужен.
   */
  const [showTelegramWidget, setShowTelegramWidget] = useState(false);

  /**
   * Отправляет данные Telegram непосредственно
   * в Auth.js Credentials provider с id="telegram".
   */
  const submitTelegram = useCallback(async (credentials: {
    initData?: string;
    loginData?: string;
  }) => {
    setPendingTelegram(true);
    setError("");

    try {
      /**
       * Auth.js найдёт этот provider:
       *
       * Credentials({
       *   id: "telegram",
       *   async authorize(credentials) { ... }
       * })
       *
       * И передаст туда initData или loginData.
       */
      const result = await signIn("telegram", {
        ...credentials,

        /**
         * Не даём Auth.js сразу перезагружать страницу.
         * Сначала сами проверим результат.
         */
        redirect: false,

        /**
         * Адрес перехода после успешного входа.
         *
         * В Auth.js v5 используется redirectTo.
         */
        redirectTo: callbackUrl,
      });

      /**
       * Если Auth.js вернул ошибку,
       * значит authorize() вернул null
       * либо произошла серверная ошибка.
       */
      if (!result || result.error) {
        setError(
          "Не получилось войти через Telegram. Проверь настройки бота и попробуй ещё раз.",
        );

        return;
      }

      /**
       * При успешном входе Auth.js создаёт JWT-сессию
       * и возвращает URL для перехода.
       */
      window.location.assign(result.url ?? callbackUrl);
    } catch (authError) {
      console.error("[telegram-auth]", authError);

      setError(
        "Сервер авторизации временно недоступен. Попробуй ещё раз.",
      );
    } finally {
      setPendingTelegram(false);
    }
  }, [callbackUrl]);

  /**
   * Подключаем поведение Telegram после загрузки страницы.
   */
  useEffect(() => {
    const telegramWindow = window as TelegramWindow;

    /**
     * Эти команды сработают только если сайт открыт
     * как Telegram Mini App.
     *
     * В обычном браузере ошибок не будет
     * благодаря optional chaining.
     */
    telegramWindow.Telegram?.WebApp?.ready?.();
    telegramWindow.Telegram?.WebApp?.expand?.();

    /**
     * Официальный Telegram Login Widget вызывает эту функцию:
     *
     * window.onTelegramAuth(user)
     */
    telegramWindow.onTelegramAuth = (user) => {
      /**
       * credentials provider принимает строковые значения,
       * поэтому превращаем объект пользователя в JSON.
       */
      void submitTelegram({
        loginData: JSON.stringify(user),
      });
    };

    /**
     * Удаляем глобальный callback,
     * когда компонент исчезает со страницы.
     */
    return () => {
      delete telegramWindow.onTelegramAuth;
    };
  }, [submitTelegram]);

  /**
   * Нажатие на основную Telegram-кнопку.
   */
  function handleTelegramLogin() {
    const telegramWindow = window as TelegramWindow;

    /**
     * Если сайт открыт внутри Telegram,
     * здесь будет подписанная строка initData.
     */
    const initData = telegramWindow.Telegram?.WebApp?.initData;

    setError("");

    /**
     * Сценарий 1:
     * приложение открыто внутри Telegram Mini App.
     */
    if (initData) {
      void submitTelegram({
        initData,
      });

      return;
    }

    /**
     * Сценарий 2:
     * сайт открыт в Chrome, Safari или другом браузере.
     *
     * Показываем официальный Telegram Login Widget.
     */
    if (telegramBotUsername) {
      setShowTelegramWidget(true);

      return;
    }

    /**
     * До этого места код дойдёт,
     * если переменная username не загрузилась.
     */
    setError(
      "Не найден NEXT_PUBLIC_TELEGRAM_BOT_USERNAME. Перезапусти сервер после изменения .env.local.",
    );
  }

  return (
    <main className="flex min-h-[calc(100svh-4rem)] items-center justify-center px-4 py-6 sm:px-6">
      <section className="w-full max-w-[26rem] rounded-[8px] border border-black/10 bg-white p-5 shadow-sm shadow-black/5 sm:p-6">
        {/* Логотип и заголовок */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-black"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-lime text-sm font-black text-black">
              88
            </span>

            <span className="text-xl font-semibold">
              88Shops
            </span>
          </Link>

          <h1 className="mt-5 text-2xl font-semibold text-black">
            Войти в 88Shops
          </h1>

          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-black/60">
            Один аккаунт для покупок, продаж, избранного и своего
            магазина.
          </p>
        </div>

        {/* Способы авторизации */}
        <div className="mt-6 grid gap-3">
          <Button
            type="button"
            size="lg"
            className="w-full"
            onClick={handleTelegramLogin}
            disabled={pendingTelegram}
          >
            <Send
              aria-hidden="true"
              className="h-5 w-5"
            />

            {pendingTelegram
              ? "Входим через Telegram..."
              : "Продолжить с Telegram"}
          </Button>

          {/*
           * Этот виджет показывается только:
           *
           * 1. в обычном браузере;
           * 2. после нажатия кнопки Telegram;
           * 3. если username бота существует.
           */}
          {showTelegramWidget && telegramBotUsername ? (
            <div className="flex min-h-16 items-center justify-center rounded-[8px] border border-black/10 bg-black/[0.025] px-3 py-3">
              <Script
                id="telegram-login-widget"
                src="https://telegram.org/js/telegram-widget.js?22"
                strategy="afterInteractive"

                /**
                 * Username бота без символа @.
                 */
                data-telegram-login={telegramBotUsername}

                /**
                 * Настройки внешнего вида виджета.
                 */
                data-size="large"
                data-radius="8"

                /**
                 * После успешного подтверждения Telegram вызовет:
                 *
                 * window.onTelegramAuth(user)
                 */
                data-onauth="window.onTelegramAuth(user)"

                /**
                 * Даёт боту возможность в дальнейшем
                 * отправлять пользователю сообщения.
                 *
                 * Для одной только авторизации можно удалить,
                 * но для 88Shops это может пригодиться.
                 */
                data-request-access="write"
              />
            </div>
          ) : null}

        </div>

        {/* Ошибка или информационное сообщение */}
        {error ? (
          <p
            role="alert"
            className="mt-4 rounded-[8px] border border-red-200 bg-red-50 p-3 text-sm leading-6 text-red-700"
          >
            {error}
          </p>
        ) : null}

        {/* Позже сделай правила и политику отдельными ссылками */}
        <p className="mt-5 text-center text-xs leading-5 text-black/45">
          Продолжая, ты принимаешь правила сервиса и политику
          конфиденциальности.
        </p>

        {/* Возврат в каталог без авторизации */}
        <div className="mt-5 flex justify-center">
          <Link
            href="/catalog"
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-[8px] px-3 text-sm font-semibold text-black/60 transition hover:bg-black/[0.04] hover:text-black"
          >
            <ShieldCheck
              aria-hidden="true"
              className="h-4 w-4"
            />

            Вернуться в каталог
          </Link>
        </div>
      </section>
    </main>
  );
}
