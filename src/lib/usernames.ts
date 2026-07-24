import "server-only";

import { randomUUID } from "node:crypto";
import { getPrisma } from "@/lib/prisma";

const RESERVED_USERNAMES = new Set([
  "admin",
  "api",
  "auth",
  "catalog",
  "deals",
  "favorites",
  "help",
  "logout",
  "onboarding",
  "profile",
  "root",
  "sell",
  "shops",
  "support",
  "telegram",
]);

export function normalizeUsername(value: string) {
  return value.trim().toLowerCase();
}

export function isValidUsername(value: string) {
  return /^[a-z0-9_.]{3,24}$/.test(value) && !RESERVED_USERNAMES.has(value);
}

export function makeDisplayName({
  name,
  firstName,
  lastName,
  username,
}: {
  name?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  username?: string | null;
}) {
  const fullName = [firstName, lastName].filter(Boolean).join(" ").trim();
  return name?.trim() || fullName || username || "88Shops user";
}

export function splitName(name?: string | null) {
  const parts = name?.trim().split(/\s+/).filter(Boolean) ?? [];
  return {
    firstName: parts[0] ?? null,
    lastName: parts.slice(1).join(" ") || null,
  };
}

export async function makeUniqueUsername(base: string) {
  const normalized = normalizeUsername(base)
    .replace(/[^a-z0-9_.]/g, ".")
    .replace(/[_.]{2,}/g, ".")
    .replace(/^[_.]+|[_.]+$/g, "")
    .slice(0, 18);
  const safeBase = isValidUsername(normalized) ? normalized : `user.${Date.now().toString(36)}`;
  const db = getPrisma();

  for (let attempt = 0; attempt < 12; attempt += 1) {
    const suffix = attempt === 0 ? "" : `.${Math.random().toString(36).slice(2, 6)}`;
    const username = `${safeBase}${suffix}`.slice(0, 24);
    const existing = await db.user.findUnique({
      where: { username },
      select: { id: true },
    });

    if (!existing && isValidUsername(username)) {
      return username;
    }
  }

  return `user.${randomUUID().slice(0, 8)}`;
}
