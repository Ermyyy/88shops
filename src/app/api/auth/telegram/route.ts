import { NextRequest, NextResponse } from "next/server";
import { signIn } from "@/auth";
import { getSafeCallbackUrl } from "@/lib/auth";

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 12;

type Attempt = {
  count: number;
  resetAt: number;
};

const attempts = new Map<string, Attempt>();

export async function POST(request: NextRequest) {
  const rateKey = getRateKey(request);

  if (!checkRateLimit(rateKey)) {
    return NextResponse.json(
      { error: "Не получилось войти через Telegram. Попробуй ещё раз." },
      { status: 429 },
    );
  }

  try {
    const body = (await request.json()) as {
      initData?: unknown;
      loginData?: unknown;
      callbackUrl?: unknown;
    };
    const callbackUrl = getSafeCallbackUrl(
      typeof body.callbackUrl === "string" ? body.callbackUrl : null,
    );
    const redirectUrl = await signIn("telegram", {
      initData: typeof body.initData === "string" ? body.initData : "",
      loginData: typeof body.loginData === "string" ? body.loginData : "",
      redirect: false,
      redirectTo: `/auth?callbackUrl=${encodeURIComponent(callbackUrl)}`,
    });

    return NextResponse.json({ redirectUrl });
  } catch (error) {
    console.error("[auth] telegram sign-in failed", error instanceof Error ? error.name : "unknown");
    return NextResponse.json(
      { error: "Не получилось войти через Telegram. Попробуй ещё раз." },
      { status: 401 },
    );
  }
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const callbackUrl = getSafeCallbackUrl(params.get("callbackUrl"));
  const loginData = JSON.stringify(Object.fromEntries(params.entries()));

  try {
    const redirectUrl = await signIn("telegram", {
      loginData,
      redirect: false,
      redirectTo: `/auth?callbackUrl=${encodeURIComponent(callbackUrl)}`,
    });

    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error("[auth] telegram widget callback failed", error instanceof Error ? error.name : "unknown");
    const url = request.nextUrl.clone();
    url.pathname = "/auth";
    url.search = `?error=AccessDenied&callbackUrl=${encodeURIComponent(callbackUrl)}`;
    return NextResponse.redirect(url);
  }
}

function checkRateLimit(key: string) {
  const now = Date.now();
  const current = attempts.get(key);

  if (!current || current.resetAt <= now) {
    attempts.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (current.count >= RATE_LIMIT_MAX) {
    return false;
  }

  current.count += 1;
  return true;
}

function getRateKey(request: NextRequest) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown"
  );
}
