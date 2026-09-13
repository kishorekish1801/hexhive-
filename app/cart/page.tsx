"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import { useLanguage } from "@/context/LanguageContext";

export default function CartPage() {
  const { language } = useLanguage();

  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    selectedItems,
    setSelectedItems,
  } = useCart();

  const text =
    language === "en"
      ? {
          continueShopping: "Continue Shopping",
          shoppingCart: "Shopping Cart",
          reviewText:
            "Review your selected products before checkout.",

          emptyCart: "Your cart is empty",
          emptyDescription:
            "Add some products to your cart to get started.",
          browseProducts: "Browse Products",

          selectAll: "Select All",
          of: "of",

          noImage: "No Image",

          remove: "Remove",
          clearCart: "Clear Cart",

          orderSummary: "Order Summary",
          selectedProducts: "Selected Products",
          subtotal: "Subtotal",
          shipping: "Shipping",
          free: "Free",
          total: "Total",

          checkoutSelected: "Checkout Selected",
          selectProduct: "Select a Product",

          rights: "All rights reserved.",
        }
      : {
          continueShopping: "Fortsätt handla",
          shoppingCart: "Varukorg",
          reviewText:
            "Granska dina valda produkter innan du går vidare till kassan.",

          emptyCart: "Din varukorg är tom",
          emptyDescription:
            "Lägg till några produkter i varukorgen för att komma igång.",
          browseProducts: "Bläddra bland produkter",

          selectAll: "Välj alla",
          of: "av",

          noImage: "Ingen bild",

          remove: "Ta bort",
          clearCart: "Töm varukorgen",

          orderSummary: "Ordersammanfattning",
          selectedProducts: "Valda produkter",
          subtotal: "Delsumma",
          shipping: "Frakt",
          free: "Gratis",
          total: "Totalt",

          checkoutSelected: "Gå till kassan med valda",
          selectProduct: "Välj en produkt",

          rights: "Alla rättigheter förbehållna.",
        };

  function translateCategory(category: string) {
    if (language !== "sv") {
      return category;
    }

    const normalizedCategory =
      category.trim().toLowerCase();

    const categories: Record<string, string> = {
      "home decor": "Heminredning",
      "keychain": "Nyckelringar",
      "keychains": "Nyckelringar",
      "toy": "Leksaker",
      "toys": "Leksaker",
      "gift": "Presenter",
      "gifts": "Presenter",
      "miniature": "Miniatyrer",
      "miniatures": "Miniatyrer",
      "desk accessories": "Skrivbordstillbehör",
      "gaming": "Gaming",
      "anime": "Anime",
      "custom print": "Anpassad 3D-utskrift",
      "custom prints": "Anpassade 3D-utskrifter",
      "test": "Test",
    };

    return categories[normalizedCategory] || category;
  }

  const toggleItem = (slug: string) => {
    if (selectedItems.includes(slug)) {
      setSelectedItems(
        selectedItems.filter(
          (item) => item !== slug
        )
      );
    } else {
      setSelectedItems([
        ...selectedItems,
        slug,
      ]);
    }
  };

  const toggleSelectAll = () => {
    if (
      selectedItems.length === cart.length
    ) {
      setSelectedItems([]);
    } else {
      setSelectedItems(
        cart.map((item) => item.slug)
      );
    }
  };

  const selectedProducts = cart.filter(
    (item) =>
      selectedItems.includes(item.slug)
  );

  const selectedTotal =
    selectedProducts.reduce(
      (total, item) =>
        total +
        item.price * item.quantity,
      0
    );

  const allSelected =
    cart.length > 0 &&
    selectedItems.length === cart.length;

  return (
    <main
      className="min-h-screen"
      style={{
        backgroundColor:
          "var(--background)",
        color:
          "var(--foreground)",
      }}
    >
      <Navbar />

      {/* Header */}
      <section className="mx-auto max-w-7xl px-6 py-10 sm:px-8 sm:py-14">
        <Link
          href="/products"
          className="text-sm font-medium transition hover:opacity-70"
          style={{
            color: "var(--muted)",
          }}
        >
          ← {text.continueShopping}
        </Link>

        <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
          {text.shoppingCart}
        </h1>

        <p
          className="mt-3"
          style={{
            color:
              "var(--muted)",
          }}
        >
          {text.reviewText}
        </p>
      </section>

      {/* Empty Cart */}
      {cart.length === 0 ? (
        <section className="mx-auto max-w-7xl px-6 pb-20 sm:px-8">
          <div
            className="mx-auto max-w-xl rounded-3xl border p-10 text-center sm:p-14"
            style={{
              backgroundColor:
                "var(--surface)",
              borderColor:
                "var(--border)",
            }}
          >
            <div className="text-6xl">
              🛒
            </div>

            <h2 className="mt-6 text-2xl font-bold">
              {text.emptyCart}
            </h2>

            <p
              className="mt-3"
              style={{
                color:
                  "var(--muted)",
              }}
            >
              {text.emptyDescription}
            </p>

            <Link
              href="/products"
              className="mt-7 inline-block rounded-xl px-7 py-3.5 font-semibold transition hover:opacity-90"
              style={{
                backgroundColor:
                  "var(--foreground)",
                color:
                  "var(--background)",
              }}
            >
              {text.browseProducts}
            </Link>
          </div>
        </section>
      ) : (
        <section className="mx-auto grid max-w-7xl gap-8 px-6 pb-20 lg:grid-cols-3 sm:px-8">

          {/* Cart Items */}
          <div className="space-y-4 lg:col-span-2">

            {/* Select All */}
            <div
              className="flex items-center justify-between rounded-2xl border p-4 sm:p-5"
              style={{
                backgroundColor:
                  "var(--surface)",
                borderColor:
                  "var(--border)",
              }}
            >
              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleSelectAll}
                  className="h-5 w-5 cursor-pointer"
                />

                <span className="font-semibold">
                  {text.selectAll}
                </span>
              </label>

              <span
                className="text-sm"
                style={{
                  color:
                    "var(--muted)",
                }}
              >
                {selectedItems.length}{" "}
                {text.of} {cart.length}
              </span>
            </div>

            {/* Products */}
            {cart.map((item) => {
              const isSelected =
                selectedItems.includes(
                  item.slug
                );

              const displayName =
                language === "sv" &&
                item.nameSv
                  ? item.nameSv
                  : item.name;

              const displayCategory =
                translateCategory(
                  item.category
                );

              return (
                <div
                  key={item.slug}
                  className="flex flex-col gap-5 rounded-2xl border p-4 transition-all sm:flex-row sm:p-5"
                  style={{
                    backgroundColor:
                      "var(--surface)",
                    borderColor:
                      isSelected
                        ? "var(--foreground)"
                        : "var(--border)",
                  }}
                >
                  {/* Checkbox */}
                  <div className="flex items-start pt-1">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() =>
                        toggleItem(
                          item.slug
                        )
                      }
                      className="h-5 w-5 cursor-pointer"
                    />
                  </div>

                  {/* Product Image */}
                  <Link
                    href={`/products/${item.slug}`}
                    className="flex h-52 w-full shrink-0 items-center justify-center overflow-hidden rounded-xl sm:h-32 sm:w-32"
                    style={{
                      backgroundColor:
                        "var(--surface-secondary)",
                    }}
                  >
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={displayName}
                        className="h-full w-full object-contain p-2 transition-transform duration-300 hover:scale-105"
                      />
                    ) : (
                      <div className="text-center">
                        <div className="text-3xl">
                          🖨️
                        </div>

                        <span
                          className="mt-1 block text-xs"
                          style={{
                            color:
                              "var(--muted)",
                          }}
                        >
                          {text.noImage}
                        </span>
                      </div>
                    )}
                  </Link>

                  {/* Product Information */}
                  <div className="flex min-w-0 flex-1 flex-col justify-between">
                    <div>
                      <p
                        className="text-xs font-semibold uppercase tracking-wider"
                        style={{
                          color:
                            "var(--muted)",
                        }}
                      >
                        {displayCategory}
                      </p>

                      <Link
                        href={`/products/${item.slug}`}
                        className="mt-1 block truncate text-lg font-semibold transition hover:opacity-70"
                      >
                        {displayName}
                      </Link>

                      <p className="mt-2 font-semibold">
                        {item.price} kr
                      </p>
                    </div>

                    {/* Quantity + Remove */}
                    <div className="mt-5 flex items-center justify-between gap-4">

                      {/* Quantity */}
                      <div
                        className="flex items-center overflow-hidden rounded-lg border"
                        style={{
                          borderColor:
                            "var(--border)",
                        }}
                      >
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(
                              item.slug,
                              item.quantity - 1
                            )
                          }
                          className="flex h-9 w-9 items-center justify-center text-lg transition hover:opacity-60"
                        >
                          −
                        </button>

                        <span className="w-9 text-center text-sm font-semibold">
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(
                              item.slug,
                              item.quantity + 1
                            )
                          }
                          className="flex h-9 w-9 items-center justify-center text-lg transition hover:opacity-60"
                        >
                          +
                        </button>
                      </div>

                      {/* Item Total */}
                      <span className="hidden text-sm font-semibold sm:block">
                        {item.price *
                          item.quantity}{" "}
                        kr
                      </span>

                      {/* Remove */}
                      <button
                        type="button"
                        onClick={() =>
                          removeFromCart(
                            item.slug
                          )
                        }
                        className="text-sm font-medium text-red-600 transition hover:opacity-70"
                      >
                        {text.remove}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Clear Cart */}
            <div className="pt-2">
              <button
                type="button"
                onClick={clearCart}
                className="text-sm font-medium text-red-600 transition hover:opacity-70"
              >
                {text.clearCart}
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div
            className="h-fit rounded-2xl border p-6 lg:sticky lg:top-24"
            style={{
              backgroundColor:
                "var(--surface)",
              borderColor:
                "var(--border)",
            }}
          >
            <h2 className="text-xl font-bold">
              {text.orderSummary}
            </h2>

            {/* Selected Products */}
            <div
              className="mt-6 flex justify-between border-b pb-4"
              style={{
                borderColor:
                  "var(--border)",
              }}
            >
              <span
                className="text-sm"
                style={{
                  color:
                    "var(--muted)",
                }}
              >
                {text.selectedProducts}
              </span>

              <span className="font-semibold">
                {selectedItems.length}
              </span>
            </div>

            {/* Subtotal */}
            <div className="mt-4 flex justify-between">
              <span
                style={{
                  color:
                    "var(--muted)",
                }}
              >
                {text.subtotal}
              </span>

              <span className="font-semibold">
                {selectedTotal} kr
              </span>
            </div>

            {/* Shipping */}
            <div className="mt-4 flex justify-between">
              <span
                style={{
                  color:
                    "var(--muted)",
                }}
              >
                {text.shipping}
              </span>

              <span className="font-semibold">
                {text.free}
              </span>
            </div>

            {/* Total */}
            <div
              className="mt-6 flex justify-between border-t pt-6"
              style={{
                borderColor:
                  "var(--border)",
              }}
            >
              <span className="text-lg font-bold">
                {text.total}
              </span>

              <span className="text-2xl font-bold">
                {selectedTotal} kr
              </span>
            </div>

            {/* Checkout */}
            {selectedItems.length > 0 ? (
              <Link
                href="/checkout"
                className="mt-6 block w-full rounded-xl px-6 py-4 text-center font-semibold transition hover:opacity-90"
                style={{
                  backgroundColor:
                    "var(--foreground)",
                  color:
                    "var(--background)",
                }}
              >
                {text.checkoutSelected}
              </Link>
            ) : (
              <button
                type="button"
                disabled
                className="mt-6 w-full cursor-not-allowed rounded-xl px-6 py-4 font-semibold"
                style={{
                  backgroundColor:
                    "var(--surface-secondary)",
                  color:
                    "var(--muted)",
                }}
              >
                {text.selectProduct}
              </button>
            )}

            {/* Continue Shopping */}
            <Link
              href="/products"
              className="mt-4 block text-center text-sm font-medium transition hover:opacity-70"
              style={{
                color:
                  "var(--muted)",
              }}
            >
              {text.continueShopping}
            </Link>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer
        className="border-t px-6 py-10 text-center text-sm"
        style={{
          backgroundColor:
            "var(--surface)",
          borderColor:
            "var(--border)",
          color:
            "var(--muted)",
        }}
      >
        © 2026 RD nordform AB.{" "}
        {text.rights}
      </footer>
    </main>
  );
}