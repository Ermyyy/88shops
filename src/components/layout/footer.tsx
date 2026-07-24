import Link from "next/link";

const columns = [
  {
    title: "Пользователям",
    links: [
      { href: "/catalog", label: "Каталог" },
      { href: "/favorites", label: "Избранное" },
      { href: "/messages", label: "Сообщения" },
      { href: "/auth", label: "Аккаунт" },
    ],
  },
  {
    title: "Продавцам",
    links: [
      { href: "/sell", label: "Разместить объявление" },
      { href: "/shops", label: "Магазины" },
      { href: "/premium", label: "Продвижение" },
      { href: "/profile/alina.archive", label: "Пример профиля" },
    ],
  },
  {
    title: "Безопасность",
    links: [
      { href: "/legit-check", label: "Legit Check" },
      { href: "/deals", label: "Сделки" },
      { href: "/about", label: "О сервисе" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-black/10 bg-white">
      <div className="page-shell grid gap-8 py-8 md:grid-cols-[1.2fr_2fr]">
        <div>
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-[8px] bg-lime text-sm font-black text-black">
              88
            </span>
            <span className="text-lg font-semibold text-black">88Shops</span>
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-6 text-black/60">
            Светлая витрина объявлений для одежды, обуви, аксессуаров и локальных
            магазинов.
          </p>
          <p className="mt-6 text-xs text-black/45">
            Одежда, кроссовки и магазины в одном месте
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-3">
          {columns.map((column) => (
            <div key={column.title}>
              <h2 className="text-sm font-semibold text-black">{column.title}</h2>
              <ul className="mt-3 space-y-2">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-black/55 transition hover:text-black"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}
