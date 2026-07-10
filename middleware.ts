import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/auth-constants";

const PUBLIC_PREFIXES = ["/auth", "/catalog", "/product", "/shops", "/about"];

function isPublicPath(pathname: string) {
  return PUBLIC_PREFIXES.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

function isSafeCallback(pathname: string) {
  return pathname.startsWith("/") && !pathname.startsWith("//");
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

  const session = request.cookies.get(SESSION_COOKIE)?.value;

  if (!session) {
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
