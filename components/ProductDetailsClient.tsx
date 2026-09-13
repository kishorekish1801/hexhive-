"use client";

import Link from "next/link";

import Navbar from "@/components/Navbar";
import AddToCartButton from "@/components/AddToCartButton";
import { useLanguage } from "@/context/LanguageContext";

type Product = {
  id: number;
  slug: string;

  name: string;
  nameSv?: string | null;

  category: string;

  price: number;
  rating: number;

  description: string;
  descriptionSv?: string | null;

  material: string;
  colors: string[];

  dimensions: string;
  printTime: string;

  imageUrl?: string | null;
};

type ProductDetailsClientProps = {
  product: Product;
};

export default function ProductDetailsClient({
  product,
}: ProductDetailsClientProps) {
  const { language } = useLanguage();

  const isSwedish = language === "sv";

  // =====================================================
  // PRODUCT NAME + DESCRIPTION
  // =====================================================

  const productName =
    isSwedish && product.nameSv
      ? product.nameSv
      : product.name;

  const productDescription =
    isSwedish && product.descriptionSv
      ? product.descriptionSv
      : product.description;

  // =====================================================
  // CATEGORY TRANSLATION
  // =====================================================

  function translateCategory(category: string) {
    if (!isSwedish) {
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

    return (
      categories[normalizedCategory] ||
      category
    );
  }

  // =====================================================
  // COLOR TRANSLATION
  // =====================================================

  function translateColor(color: string) {
    if (!isSwedish) {
      return color;
    }

    const normalizedColor =
      color.trim().toLowerCase();

    const colorTranslations: Record<
      string,
      string
    > = {
      black: "Svart",
      white: "Vit",
      red: "Röd",
      blue: "Blå",
      green: "Grön",
      yellow: "Gul",
      orange: "Orange",
      pink: "Rosa",
      purple: "Lila",
      grey: "Grå",
      gray: "Grå",
      brown: "Brun",
      gold: "Guld",
      silver: "Silver",
      beige: "Beige",
      transparent: "Transparent",
    };

    return (
      colorTranslations[normalizedColor] ||
      color
    );
  }

  return (
    <main
      className="min-h-screen"
      style={{
        backgroundColor: "var(--background)",
        color: "var(--foreground)",
      }}
    >
      <Navbar />

      {/* Breadcrumb */}
      <div className="mx-auto max-w-7xl px-6 pt-8 sm:px-8">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-sm font-medium transition hover:opacity-70"
          style={{
            color: "var(--muted)",
          }}
        >
          ←{" "}
          {isSwedish
            ? "Tillbaka till butiken"
            : "Back to Shop"}
        </Link>
      </div>

      {/* Product Section */}
      <section className="mx-auto max-w-7xl px-6 py-10 sm:px-8 sm:py-14">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Product Image */}
          <div
            className="relative flex min-h-[420px] items-center justify-center overflow-hidden rounded-3xl border p-6 sm:min-h-[560px] sm:p-10"
            style={{
              backgroundColor:
                "var(--surface-secondary)",
              borderColor: "var(--border)",
            }}
          >
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={productName}
                className="max-h-[520px] w-full object-contain transition-transform duration-500 hover:scale-105"
              />
            ) : (
              <div className="text-center">
                <div className="text-7xl">
                  🖨️
                </div>

                <p
                  className="mt-5 text-sm font-medium"
                  style={{
                    color: "var(--muted)",
                  }}
                >
                  {isSwedish
                    ? "Produktbild"
                    : "Product Image"}
                </p>

                <p
                  className="mt-1 text-xs"
                  style={{
                    color: "var(--muted)",
                  }}
                >
                  {isSwedish
                    ? "Bild kommer snart"
                    : "Image coming soon"}
                </p>
              </div>
            )}
          </div>

          {/* Product Information */}
          <div className="flex flex-col justify-center">
            {/* Category */}
            <p
              className="text-sm font-semibold uppercase tracking-[0.25em]"
              style={{
                color: "var(--muted)",
              }}
            >
              {translateCategory(
                product.category
              )}
            </p>

            {/* Product Name */}
            <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
              {productName}
            </h1>

            {/* Rating */}
            <div className="mt-5 flex items-center gap-2">
              <span className="text-lg text-yellow-500">
                ★
              </span>

              <span className="font-semibold">
                {product.rating}
              </span>

              <span
                className="text-sm"
                style={{
                  color: "var(--muted)",
                }}
              >
                / 5
              </span>
            </div>

            {/* Price */}
            <div className="mt-7">
              <span className="text-3xl font-bold sm:text-4xl">
                {product.price} kr
              </span>
            </div>

            {/* Description */}
            <p
              className="mt-6 max-w-xl text-base leading-8 sm:text-lg"
              style={{
                color: "var(--muted)",
              }}
            >
              {productDescription}
            </p>

            {/* Product Details */}
            <div
              className="mt-8 rounded-2xl border p-6"
              style={{
                backgroundColor:
                  "var(--surface)",
                borderColor: "var(--border)",
              }}
            >
              <h2 className="text-lg font-semibold">
                {isSwedish
                  ? "Produktdetaljer"
                  : "Product Details"}
              </h2>

              <div className="mt-4">
                {/* Material */}
                <div
                  className="flex items-center justify-between gap-6 border-b py-4"
                  style={{
                    borderColor:
                      "var(--border)",
                  }}
                >
                  <span
                    className="text-sm"
                    style={{
                      color: "var(--muted)",
                    }}
                  >
                    Material
                  </span>

                  <span className="text-right text-sm font-medium">
                    {product.material}
                  </span>
                </div>

                {/* Dimensions */}
                <div
                  className="flex items-center justify-between gap-6 border-b py-4"
                  style={{
                    borderColor:
                      "var(--border)",
                  }}
                >
                  <span
                    className="text-sm"
                    style={{
                      color: "var(--muted)",
                    }}
                  >
                    {isSwedish
                      ? "Dimensioner"
                      : "Dimensions"}
                  </span>

                  <span className="text-right text-sm font-medium">
                    {product.dimensions}
                  </span>
                </div>

                {/* Print Time */}
                <div className="flex items-center justify-between gap-6 pt-4">
                  <span
                    className="text-sm"
                    style={{
                      color: "var(--muted)",
                    }}
                  >
                    {isSwedish
                      ? "Utskriftstid"
                      : "Print Time"}
                  </span>

                  <span className="text-right text-sm font-medium">
                    {product.printTime}
                  </span>
                </div>
              </div>
            </div>

            {/* Available Colors */}
            <div className="mt-8">
              <h2 className="text-lg font-semibold">
                {isSwedish
                  ? "Tillgängliga färger"
                  : "Available Colors"}
              </h2>

              <div className="mt-4 flex flex-wrap gap-3">
                {product.colors.map(
                  (color) => (
                    <span
                      key={color}
                      className="rounded-full border px-4 py-2 text-sm"
                      style={{
                        backgroundColor:
                          "var(--surface)",
                        borderColor:
                          "var(--border)",
                      }}
                    >
                      {translateColor(color)}
                    </span>
                  )
                )}
              </div>
            </div>

            {/* Add To Cart */}
            <div className="mt-9">
              <AddToCartButton
                product={product}
              />
            </div>

            {/* Continue Shopping */}
            <Link
              href="/products"
              className="mt-4 text-center text-sm font-medium transition hover:opacity-70"
              style={{
                color: "var(--muted)",
              }}
            >
              {isSwedish
                ? "Fortsätt handla"
                : "Continue Shopping"}
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="border-t px-6 py-12 text-center"
        style={{
          backgroundColor: "var(--surface)",
          borderColor: "var(--border)",
        }}
      >
        <div className="mx-auto max-w-7xl">
          <h2 className="text-2xl font-bold">
            RD nordform AB
          </h2>

          <p
            className="mt-3"
            style={{
              color: "var(--muted)",
            }}
          >
            {isSwedish
              ? "Vi förvandlar idéer till verklighet."
              : "Turning ideas into reality."}
          </p>

          <div
            className="mx-auto mt-8 max-w-3xl border-t pt-6 text-sm"
            style={{
              borderColor: "var(--border)",
              color: "var(--muted)",
            }}
          >
            © 2026 RD nordform AB.{" "}
            {isSwedish
              ? "Alla rättigheter förbehållna."
              : "All rights reserved."}
          </div>
        </div>
      </footer>
    </main>
  );
}