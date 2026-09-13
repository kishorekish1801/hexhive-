"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";

export default function Navbar() {
  const { cartCount } = useCart();

  const {
    language,
    toggleLanguage,
    t,
  } = useLanguage();

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  const [darkMode, setDarkMode] =
    useState(false);

  // =====================================================
  // LOAD SAVED THEME
  // =====================================================

  useEffect(() => {
    const savedTheme =
      localStorage.getItem(
        "rdnordform-theme"
      );

    if (savedTheme === "dark") {
      document.documentElement.classList.add(
        "dark"
      );

      setDarkMode(true);
    } else {
      document.documentElement.classList.remove(
        "dark"
      );

      setDarkMode(false);
    }
  }, []);

  // =====================================================
  // TOGGLE THEME
  // =====================================================

  const toggleTheme = () => {
    const html =
      document.documentElement;

    const isCurrentlyDark =
      html.classList.contains("dark");

    if (isCurrentlyDark) {
      html.classList.remove("dark");

      localStorage.setItem(
        "rdnordform-theme",
        "light"
      );

      setDarkMode(false);
    } else {
      html.classList.add("dark");

      localStorage.setItem(
        "rdnordform-theme",
        "dark"
      );

      setDarkMode(true);
    }
  };

  // =====================================================
  // CLOSE MOBILE MENU
  // =====================================================

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav
      className="sticky top-0 z-[100] border-b transition-colors"
      style={{
        backgroundColor:
          "var(--background)",
        color:
          "var(--foreground)",
        borderColor:
          "var(--border)",
      }}
    >
      {/* Main Navbar */}
      <div className="flex items-center justify-between px-5 py-5 sm:px-8">

        {/* Logo */}
        <Link
          href="/"
          onClick={closeMobileMenu}
          className="text-xl font-bold tracking-tight sm:text-2xl"
        >
          RD nordform AB
        </Link>

        {/* =====================================================
            DESKTOP NAVIGATION
        ===================================================== */}

        <div className="hidden items-center gap-6 md:flex">

          <Link
            href="/"
            className="transition-opacity hover:opacity-60"
          >
            {t("home")}
          </Link>

          <Link
            href="/products"
            className="transition-opacity hover:opacity-60"
          >
            {t("shop")}
          </Link>

          <Link
            href="/custom-print"
            className="transition-opacity hover:opacity-60"
          >
            {t("customPrint")}
          </Link>

          <Link
            href="/about"
            className="transition-opacity hover:opacity-60"
          >
            {t("about")}
          </Link>

          {/* Language */}
          <button
            type="button"
            onClick={toggleLanguage}
            className="flex h-10 items-center gap-2 rounded-full border px-3 text-sm font-semibold transition hover:scale-105"
            style={{
              backgroundColor:
                "var(--surface-secondary)",
              borderColor:
                "var(--border)",
            }}
            title={
              language === "en"
                ? "Byt till svenska"
                : "Switch to English"
            }
          >
            <span className="text-xl">
              {language === "en"
                ? "🇬🇧"
                : "🇸🇪"}
            </span>

            <span>
              {language === "en"
                ? "English"
                : "Svenska"}
            </span>
          </button>

          {/* Theme */}
          <button
            type="button"
            onClick={toggleTheme}
            className="flex h-10 w-10 items-center justify-center rounded-full border text-lg transition hover:scale-105"
            style={{
              backgroundColor:
                "var(--surface-secondary)",
              borderColor:
                "var(--border)",
            }}
            aria-label={
              language === "en"
                ? "Toggle dark mode"
                : "Växla mörkt läge"
            }
          >
            {darkMode
              ? "☀️"
              : "🌙"}
          </button>

          {/* Cart */}
          <Link
            href="/cart"
            className="font-semibold transition-opacity hover:opacity-60"
          >
            🛒 {t("cart")} ({cartCount})
          </Link>

        </div>

        {/* =====================================================
            MOBILE CONTROLS
        ===================================================== */}

        <div className="flex items-center gap-2 md:hidden">

          {/* Mobile Language */}
          <button
            type="button"
            onClick={toggleLanguage}
            className="flex h-10 items-center gap-1 rounded-full border px-3 text-sm font-semibold transition hover:scale-105"
            style={{
              backgroundColor:
                "var(--surface-secondary)",
              borderColor:
                "var(--border)",
            }}
          >
            <span className="text-lg">
              {language === "en"
                ? "🇬🇧"
                : "🇸🇪"}
            </span>

            <span className="hidden sm:inline">
              {language === "en"
                ? "EN"
                : "SV"}
            </span>
          </button>

          {/* Mobile Theme */}
          <button
            type="button"
            onClick={toggleTheme}
            className="flex h-10 w-10 items-center justify-center rounded-full border text-lg transition hover:scale-105"
            style={{
              backgroundColor:
                "var(--surface-secondary)",
              borderColor:
                "var(--border)",
            }}
            aria-label={
              language === "en"
                ? "Toggle dark mode"
                : "Växla mörkt läge"
            }
          >
            {darkMode
              ? "☀️"
              : "🌙"}
          </button>

          {/* Mobile Cart */}
          <Link
            href="/cart"
            className="flex h-10 items-center justify-center rounded-full border px-3 text-sm font-semibold"
            style={{
              backgroundColor:
                "var(--surface-secondary)",
              borderColor:
                "var(--border)",
            }}
          >
            🛒 {cartCount}
          </Link>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() =>
              setMobileMenuOpen(
                !mobileMenuOpen
              )
            }
            className="flex h-10 w-10 items-center justify-center rounded-full border text-xl transition hover:scale-105"
            style={{
              backgroundColor:
                "var(--surface-secondary)",
              borderColor:
                "var(--border)",
            }}
            aria-label={
              language === "en"
                ? "Toggle navigation menu"
                : "Öppna navigeringsmeny"
            }
            aria-expanded={
              mobileMenuOpen
            }
          >
            {mobileMenuOpen
              ? "×"
              : "☰"}
          </button>

        </div>
      </div>

      {/* =====================================================
          MOBILE MENU
      ===================================================== */}

      {mobileMenuOpen && (
        <div
          className="border-t px-5 py-5 md:hidden"
          style={{
            backgroundColor:
              "var(--surface)",
            borderColor:
              "var(--border)",
          }}
        >
          <div className="flex flex-col gap-1">

            <Link
              href="/"
              onClick={
                closeMobileMenu
              }
              className="rounded-lg px-4 py-3 font-medium transition hover:opacity-60"
            >
              {t("home")}
            </Link>

            <Link
              href="/products"
              onClick={
                closeMobileMenu
              }
              className="rounded-lg px-4 py-3 font-medium transition hover:opacity-60"
            >
              {t("shop")}
            </Link>

            <Link
              href="/custom-print"
              onClick={
                closeMobileMenu
              }
              className="rounded-lg px-4 py-3 font-medium transition hover:opacity-60"
            >
              {t("customPrint")}
            </Link>

            <Link
              href="/about"
              onClick={
                closeMobileMenu
              }
              className="rounded-lg px-4 py-3 font-medium transition hover:opacity-60"
            >
              {t("about")}
            </Link>

            {/* Mobile Language */}
            <button
              type="button"
              onClick={() => {
                toggleLanguage();
                closeMobileMenu();
              }}
              className="rounded-lg px-4 py-3 text-left font-medium transition hover:opacity-60"
            >
              {language === "en"
                ? "🇸🇪 Svenska"
                : "🇬🇧 English"}
            </button>

            {/* Mobile Cart */}
            <Link
              href="/cart"
              onClick={
                closeMobileMenu
              }
              className="rounded-lg px-4 py-3 font-semibold transition hover:opacity-60"
            >
              🛒{" "}
              {t("shoppingCart")} (
              {cartCount})
            </Link>

          </div>
        </div>
      )}
    </nav>
  );
}