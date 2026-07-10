import Link from "next/link";

const columns = [
  {
    title: "Маркетплейс",
    links: [
      { href: "/catalog", label: "Каталог" },
      { href: "/shops", label: "Магазины" },
      { href: "/sell", label: "Продать вещь" },
      { href: "/favorites", label: "Избранное" },
    ],
  },
  {
    title: "Продукт",
    links: [
      { href: "/premium", label: "Premium" },
      { href: "/legit-check", label: "Legit Check" },
      { href: "/deals", label: "Сделки" },
      { href: "/auth", label: "Аккаунт" },
    ],
  },
  {
    title: "88Shops",
    links: [
      { href: "/about", label: "О нас" },
      { href: "/profile/alina.archive", label: "Demo профиль" },
      { href: "/shops/asphalt-archive", label: "Demo магазин" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_2fr] lg:px-8">
        <div>
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-[8px] bg-lime text-sm font-black text-black">
              88
            </span>
            <span className="text-lg font-semibold text-cream">88Shops</span>
          </Link>
          <p className="mt-5 max-w-sm text-sm leading-6 text-cream/52">
            Fashion marketplace нового поколения: покупай, продавай и развивай
            свой магазин без шума.
          </p>
          <p className="mt-8 text-xs uppercase tracking-[0.2em] text-cream/36">
            Demo MVP · реальные платежи не подключены
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-3">
          {columns.map((column) => (
            <div key={column.title}>
              <h2 className="text-sm font-semibold text-cream">{column.title}</h2>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-cream/48 transition hover:text-lime"
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
