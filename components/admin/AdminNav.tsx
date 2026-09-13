
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

type AdminTheme = "light" | "dark";

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  const [theme, setTheme] = useState<AdminTheme>("light");

  const links = [
    {
      name: "Dashboard",
      href: "/admin",
    },
    {
      name: "Products",
      href: "/admin/products",
    },
    {
      name: "Orders",
      href: "/admin/orders",
    },
    {
      name: "Quotes",
      href: "/admin/quotes",
    },
  ];

  function applyTheme(newTheme: AdminTheme) {
    const root = document.documentElement;

    if (newTheme === "dark") {
      root.style.setProperty("--background", "#0a0a0a");
      root.style.setProperty("--foreground", "#f5f5f5");
      root.style.setProperty("--surface", "#171717");
      root.style.setProperty("--surface-secondary", "#262626");
      root.style.setProperty("--border", "#404040");
      root.style.setProperty("--muted", "#a3a3a3");
    } else {
      root.style.setProperty("--background", "#ffffff");
      root.style.setProperty("--foreground", "#171717");
      root.style.setProperty("--surface", "#ffffff");
      root.style.setProperty("--surface-secondary", "#f5f5f5");
      root.style.setProperty("--border", "#e5e5e5");
      root.style.setProperty("--muted", "#737373");
    }

    root.dataset.adminTheme = newTheme;
  }

  useEffect(() => {
    const savedTheme = localStorage.getItem(
      "admin_theme"
    ) as AdminTheme | null;

    const initialTheme =
      savedTheme === "dark" ? "dark" : "light";

    setTheme(initialTheme);
    applyTheme(initialTheme);

    return () => {
      const root = document.documentElement;

      delete root.dataset.adminTheme;

      root.style.removeProperty("--background");
      root.style.removeProperty("--foreground");
      root.style.removeProperty("--surface");
      root.style.removeProperty("--surface-secondary");
      root.style.removeProperty("--border");
      root.style.removeProperty("--muted");
    };
  }, []);

  function toggleTheme() {
    const newTheme =
      theme === "light" ? "dark" : "light";

    setTheme(newTheme);

    localStorage.setItem(
      "admin_theme",
      newTheme
    );

    applyTheme(newTheme);
  }

  function refreshPage() {
    window.location.reload();
  }

  function logout() {
    localStorage.removeItem("admin_token");
    router.push("/admin/login");
  }

  return (
    <nav
      className="sticky top-0 z-50 border-b backdrop-blur"
      style={{
        backgroundColor: "var(--surface)",
        borderColor: "var(--border)",
      }}
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-8">

        <div className="flex min-h-[72px] items-center justify-between gap-8">

          {/* LEFT SIDE */}
          <div className="flex min-w-0 items-center gap-8">

            {/* Logo */}
            <Link
              href="/admin"
              className="shrink-0 text-lg font-bold tracking-tight"
              style={{
                color: "var(--foreground)",
              }}
            >
              RD nordform AB
            </Link>

            {/* Navigation */}
            <div className="hidden items-center gap-1 md:flex">

              {links.map((link) => {
                const active =
                  pathname === link.href ||
                  (link.href !== "/admin" &&
                    pathname.startsWith(link.href));

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="rounded-lg px-4 py-2.5 text-sm font-medium transition-all"
                    style={{
                      backgroundColor: active
                        ? "var(--foreground)"
                        : "transparent",

                      color: active
                        ? "var(--background)"
                        : "var(--muted)",
                    }}
                  >
                    {link.name}
                  </Link>
                );
              })}

            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex shrink-0 items-center gap-2">

            {/* Refresh */}
            <button
              type="button"
              onClick={refreshPage}
              className="rounded-lg border px-3.5 py-2 text-sm font-medium transition-all hover:opacity-70"
              style={{
                borderColor: "var(--border)",
                color: "var(--foreground)",
                backgroundColor: "var(--surface)",
              }}
            >
              ↻ Refresh
            </button>

            {/* Theme */}
            <button
              type="button"
              onClick={toggleTheme}
              className="rounded-lg border px-3.5 py-2 text-sm font-medium transition-all hover:opacity-70"
              style={{
                borderColor: "var(--border)",
                color: "var(--foreground)",
                backgroundColor: "var(--surface)",
              }}
            >
              {theme === "light"
                ? "🌙 Dark"
                : "☀️ Light"}
            </button>

            {/* Website */}
            <Link
              href="/"
              className="hidden rounded-lg border px-3.5 py-2 text-sm font-medium transition-all hover:opacity-70 lg:block"
              style={{
                borderColor: "var(--border)",
                color: "var(--foreground)",
                backgroundColor: "var(--surface)",
              }}
            >
              View Website
            </Link>

            {/* Logout */}
            <button
              type="button"
              onClick={logout}
              className="rounded-lg px-4 py-2 text-sm font-semibold transition-all hover:opacity-80"
              style={{
                backgroundColor: "var(--foreground)",
                color: "var(--background)",
              }}
            >
              Logout
            </button>

          </div>
        </div>

        {/* MOBILE NAVIGATION */}
        <div className="flex gap-1 overflow-x-auto pb-3 md:hidden">

          {links.map((link) => {
            const active =
              pathname === link.href ||
              (link.href !== "/admin" &&
                pathname.startsWith(link.href));

            return (
              <Link
                key={link.href}
                href={link.href}
                className="shrink-0 rounded-lg px-3 py-2 text-sm font-medium"
                style={{
                  backgroundColor: active
                    ? "var(--foreground)"
                    : "transparent",

                  color: active
                    ? "var(--background)"
                    : "var(--muted)",
                }}
              >
                {link.name}
              </Link>
            );
          })}

        </div>

      </div>
    </nav>
  );
}

