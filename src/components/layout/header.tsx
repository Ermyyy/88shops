"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  Grid2X2,
  Heart,
  Home,
  ListPlus,
  Menu,
  MessageCircle,
  Search,
  Store,
  UserRound,
  X,
} from "lucide-react";
import { LogoutButton } from "@/components/auth/logout-button";
import { LinkButton } from "@/components/ui/button";
import { Drawer } from "@/components/ui/drawer";
import { useFavoritesStore } from "@/store/favorites-store";
import { useUiStore } from "@/store/ui-store";
import { cn } from "@/lib/utils";

export type HeaderUser = {
  username: string;
  displayName: string;
};

type HeaderProps = {
  user: HeaderUser | null;
};

const secondaryLinks = [
  { href: "/shops", label: "Магазины", icon: Store },
  { href: "/premium", label: "Premium", icon: Bell },
  { href: "/legit-check", label: "Legit Check", icon: Search },
  { href: "/about", label: "О сервисе", icon: Grid2X2 },
];

export function Header({ user }: HeaderProps) {
  const pathname = usePathname();
  const favoriteCount = useFavoritesStore((state) => state.favoriteIds.length);
  const mobileMenuOpen = useUiStore((state) => state.mobileMenuOpen);
  const setMobileMenuOpen = useUiStore((state) => state.setMobileMenuOpen);
  const isAuthenticated = Boolean(user);
  const profileHref = user ? `/profile/${user.username}` : "/auth";
  const sellHref = isAuthenticated ? "/sell" : "/auth?callbackUrl=%2Fsell";
  const favoritesHref = isAuthenticated ? "/favorites" : "/auth?callbackUrl=%2Ffavorites";
  const messagesHref = isAuthenticated ? "/messages" : "/auth?callbackUrl=%2Fmessages";
  const authSurface = pathname === "/auth" || pathname.startsWith("/auth/") || pathname === "/onboarding";

  if (authSurface) {
    return (
      <header className="sticky top-0 z-50 border-b border-black/10 bg-white">
        <div className="mx-auto flex min-h-14 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Logo />
          <Link
            href="/catalog"
            className="inline-flex min-h-10 items-center justify-center rounded-[10px] border border-black/10 px-4 text-sm font-semibold text-black/70 transition hover:bg-black/[0.04]"
          >
            В каталог
          </Link>
        </div>
      </header>
    );
  }

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-black/10 bg-white">
        <div className="mx-auto flex min-h-16 w-full max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
          <Logo />

          <Link
            href="/catalog"
            className={cn(
              "hidden min-h-10 items-center gap-2 rounded-[10px] border border-black/10 px-4 text-sm font-semibold text-cream transition hover:bg-black/[0.04] lg:inline-flex",
              pathname.startsWith("/catalog") && "border-black/25 bg-black/[0.04]",
            )}
          >
            <Grid2X2 aria-hidden className="h-4 w-4" />
            Каталог
          </Link>

          <form action="/catalog" className="hidden min-w-0 flex-1 items-center gap-2 md:flex">
            <label className="flex min-h-10 min-w-0 flex-1 items-center gap-2 rounded-[10px] border border-black/12 bg-[#f6f6f4] px-3 focus-within:border-black/30">
              <Search aria-hidden className="h-4 w-4 shrink-0 text-black/45" />
              <span className="sr-only">Поиск по объявлениям</span>
              <input
                name="q"
                className="min-w-0 flex-1 bg-transparent text-sm text-cream outline-none placeholder:text-black/35"
                placeholder="Поиск по объявлениям"
              />
            </label>
            <button
              type="submit"
              className="inline-flex min-h-10 items-center justify-center rounded-[10px] bg-lime px-5 text-sm font-bold text-black transition hover:bg-[#bdea28]"
            >
              Найти
            </button>
          </form>

          <nav className="ml-auto hidden items-center gap-1 lg:flex" aria-label="Быстрые действия">
            <HeaderIconLink href={favoritesHref} label="Избранное" active={pathname.startsWith("/favorites")}>
              <Heart aria-hidden className="h-5 w-5" />
              {favoriteCount > 0 ? <Counter value={favoriteCount} /> : null}
            </HeaderIconLink>
            <HeaderIconLink href={messagesHref} label="Сообщения" active={pathname.startsWith("/messages")}>
              <MessageCircle aria-hidden className="h-5 w-5" />
            </HeaderIconLink>
            <HeaderIconLink href={profileHref} label="Профиль" active={pathname.startsWith("/profile")}>
              <UserRound aria-hidden className="h-5 w-5" />
            </HeaderIconLink>
            <LinkButton href={sellHref} size="sm" className="ml-1">
              <ListPlus aria-hidden className="h-4 w-4" />
              Разместить
            </LinkButton>
            {isAuthenticated ? <LogoutButton className="ml-1" /> : null}
          </nav>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-[10px] border border-black/10 text-cream lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Закрыть меню" : "Открыть меню"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
          >
            {mobileMenuOpen ? <X aria-hidden className="h-5 w-5" /> : <Menu aria-hidden className="h-5 w-5" />}
          </button>
        </div>

        <div className="border-t border-black/8 px-4 py-2 md:hidden">
          <form action="/catalog" className="mx-auto flex max-w-7xl gap-2">
            <label className="flex min-h-10 min-w-0 flex-1 items-center gap-2 rounded-[10px] border border-black/12 bg-[#f6f6f4] px-3">
              <Search aria-hidden className="h-4 w-4 shrink-0 text-black/45" />
              <span className="sr-only">Поиск</span>
              <input
                name="q"
                className="min-w-0 flex-1 bg-transparent text-sm text-cream outline-none placeholder:text-black/35"
                placeholder="Найти вещь"
              />
            </label>
            <button type="submit" className="min-h-10 rounded-[10px] bg-lime px-4 text-sm font-bold text-black">
              Найти
            </button>
          </form>
        </div>

        <Drawer
          open={mobileMenuOpen}
          title="Меню 88Shops"
          onClose={() => setMobileMenuOpen(false)}
        >
          <div id="mobile-navigation" className="grid gap-2">
            {secondaryLinks.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex min-h-12 items-center gap-3 rounded-[10px] border border-black/10 bg-white px-4 text-sm font-semibold text-cream transition hover:bg-black/[0.04]",
                    pathname === item.href && "border-lime bg-lime/35",
                  )}
                >
                  <Icon aria-hidden className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
            {isAuthenticated ? (
              <LogoutButton className="pt-2" />
            ) : (
              <LinkButton href="/auth" variant="secondary" className="mt-2" onClick={() => setMobileMenuOpen(false)}>
                Войти
              </LinkButton>
            )}
          </div>
        </Drawer>
      </header>

      <MobileBottomNav
        pathname={pathname}
        sellHref={sellHref}
        profileHref={profileHref}
        favoritesHref={favoritesHref}
      />
    </>
  );
}

function Logo() {
  return (
    <Link href="/" className="inline-flex shrink-0 items-center gap-2">
      <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-lime text-sm font-black text-black">
        88
      </span>
      <span className="hidden text-lg font-bold tracking-tight text-cream sm:inline">88Shops</span>
    </Link>
  );
}

function HeaderIconLink({
  href,
  label,
  active,
  children,
}: {
  href: string;
  label: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "relative inline-flex h-10 min-w-10 items-center justify-center rounded-[10px] px-2 text-black/65 transition hover:bg-black/[0.04] hover:text-cream",
        active && "bg-black/[0.05] text-cream",
      )}
      aria-label={label}
      title={label}
    >
      {children}
    </Link>
  );
}

function Counter({ value }: { value: number }) {
  return (
    <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-lime px-1 text-[10px] font-bold text-black">
      {value}
    </span>
  );
}

function MobileBottomNav({
  pathname,
  sellHref,
  profileHref,
  favoritesHref,
}: {
  pathname: string;
  sellHref: string;
  profileHref: string;
  favoritesHref: string;
}) {
  const items = [
    { href: "/", label: "Главная", icon: Home, active: pathname === "/" },
    { href: "/catalog", label: "Каталог", icon: Search, active: pathname.startsWith("/catalog") },
    { href: sellHref, label: "Разместить", icon: ListPlus, active: pathname.startsWith("/sell"), primary: true },
    { href: favoritesHref, label: "Избранное", icon: Heart, active: pathname.startsWith("/favorites") },
    { href: profileHref, label: "Профиль", icon: UserRound, active: pathname.startsWith("/profile") },
  ];

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-black/10 bg-white pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_24px_rgba(0,0,0,0.06)] md:hidden"
      aria-label="Нижняя навигация"
    >
      <div className="grid min-h-16 grid-cols-5">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={`${item.href}-${item.label}`}
              href={item.href}
              className={cn(
                "flex min-h-14 flex-col items-center justify-center gap-1 text-[11px] font-semibold text-black/55",
                item.active && "text-cream",
                item.primary && "text-black",
              )}
            >
              <span
                className={cn(
                  "grid h-7 w-7 place-items-center rounded-[10px]",
                  item.primary && "bg-lime",
                  item.active && !item.primary && "bg-black/[0.06]",
                )}
              >
                <Icon aria-hidden className="h-4 w-4" />
              </span>
              <span className="max-w-full truncate px-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
