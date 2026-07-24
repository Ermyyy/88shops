import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PREFIXES = ["/auth", "/catalog", "/product", "/shops", "/about"];
const AUTH_COOKIE_NAMES = [
  "authjs.session-token",
  "__Secure-authjs.session-token",
  "next-auth.session-token",
  "__Secure-next-auth.session-token",
];

function isPublicPath(pathname: string) {
  return PUBLIC_PREFIXES.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

function isSafeCallback(pathname: string) {
  return pathname.startsWith("/") && !pathname.startsWith("//");
}

function hasAuthSessionCookie(request: NextRequest) {
  return request.cookies
    .getAll()
    .some((cookie) =>
      AUTH_COOKIE_NAMES.some((name) => cookie.name === name || cookie.name.startsWith(`${name}.`)),
    );
}

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".") ||
    isPublicPath(pathname)
  ) {
    return NextResponse.next();
  }

  if (!hasAuthSessionCookie(request)) {
    const callback = isSafeCallback(`${pathname}${search}`) ? `${pathname}${search}` : "/";
    const url = request.nextUrl.clone();
    url.pathname = "/auth";
    url.search = `?callbackUrl=${encodeURIComponent(callback)}`;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
