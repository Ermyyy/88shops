import "server-only";

import { createHash, createHmac, timingSafeEqual } from "node:crypto";

const TELEGRAM_AUTH_MAX_AGE_SECONDS = 24 * 60 * 60;

export type VerifiedTelegramUser = {
  id: string;
  username?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  avatarUrl?: string | null;
};

type TelegramInitDataUser = {
  id: number | string;
  username?: string;
  first_name?: string;
  last_name?: string;
  photo_url?: string;
};

export function verifyTelegramMiniAppInitData(initData: string, botToken: string) {
  const params = new URLSearchParams(initData);
  const hash = params.get("hash");
  const authDate = params.get("auth_date");
  const rawUser = params.get("user");

  if (!hash || !authDate || !rawUser) {
    return null;
  }

  if (isExpiredAuthDate(authDate)) {
    return null;
  }

  params.delete("hash");
  const dataCheckString = [...params.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");

  const secret = createHmac("sha256", "WebAppData").update(botToken).digest();
  const calculatedHash = createHmac("sha256", secret).update(dataCheckString).digest("hex");

  if (!safeEqualHex(hash, calculatedHash)) {
    return null;
  }

  try {
    const user = JSON.parse(rawUser) as TelegramInitDataUser;

    if (!user.id) {
      return null;
    }

    return {
      id: String(user.id),
      username: user.username ?? null,
      firstName: user.first_name ?? null,
      lastName: user.last_name ?? null,
      avatarUrl: user.photo_url ?? null,
    } satisfies VerifiedTelegramUser;
  } catch {
    return null;
  }
}

export function verifyTelegramLoginWidgetData(
  data: Record<string, string | undefined>,
  botToken: string,
) {
  const { hash, auth_date: authDate, id } = data;

  if (!hash || !authDate || !id) {
    return null;
  }

  if (isExpiredAuthDate(authDate)) {
    return null;
  }

  const dataCheckString = Object.entries(data)
    .filter(([key, value]) => key !== "hash" && value !== undefined && value !== "")
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");
  const secret = createHash("sha256").update(botToken).digest();
  const calculatedHash = createHmac("sha256", secret).update(dataCheckString).digest("hex");

  if (!safeEqualHex(hash, calculatedHash)) {
    return null;
  }

  return {
    id,
    username: data.username ?? null,
    firstName: data.first_name ?? null,
    lastName: data.last_name ?? null,
    avatarUrl: data.photo_url ?? null,
  } satisfies VerifiedTelegramUser;
}

function isExpiredAuthDate(value: string) {
  const authDate = Number(value);
  const now = Math.floor(Date.now() / 1000);
  return !Number.isFinite(authDate) || authDate <= 0 || now - authDate > TELEGRAM_AUTH_MAX_AGE_SECONDS;
}

function safeEqualHex(left: string, right: string) {
  const leftBuffer = Buffer.from(left, "hex");
  const rightBuffer = Buffer.from(right, "hex");

  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}
