"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import Navbar from "@/components/Navbar";
import { useLanguage } from "@/context/LanguageContext";
import { getProducts } from "@/lib/api";
import type { Product } from "@/data/products";

export default function Home() {
  const { language } = useLanguage();

  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const text =
    language === "en"
      ? {
          heroTitle1: "Ideas made",
          heroTitle2: "tangible.",
          heroDescription:
            "Discover unique 3D printed products or bring your own idea to life with our custom design and 3D printing service.",
          exploreProducts: "Explore Products",
          customPrint: "Custom Print",

          uniqueProducts: "Unique Products",
          uniqueProductsDescription:
            "Discover carefully selected 3D printed products designed for everyday life.",

          customDesigns: "Custom Designs",
          customDesignsDescription:
            "Turn your idea, sketch or model into a custom 3D printed product.",

          madeWithCare: "Made With Care",
          madeWithCareDescription:
            "We focus on detail, materials and print quality to create products you'll enjoy.",

          explore: "Explore",
          featuredProducts: "Featured Products",
          viewAll: "View All",
          viewAllProducts: "View All Products",

          productImage: "Product Image",
          loadingProducts: "Loading products...",

          customPrinting: "Custom 3D Printing",
          customHeading:
            "Have an idea that doesn't exist yet?",
          customDescription:
            "Bring your own design or tell us what you want. We'll help turn your idea into a physical 3D print.",
          createCustomPrint: "Create Your Custom Print",

          copyright:
            "© 2026 RD nordform AB. All rights reserved.",
        }
      : {
          heroTitle1: "Idéer blir",
          heroTitle2: "verklighet.",
          heroDescription:
            "Upptäck unika 3D-printade produkter eller förverkliga din egen idé med vår tjänst för specialdesign och 3D-utskrift.",
          exploreProducts: "Utforska produkter",
          customPrint: "Specialutskrift",

          uniqueProducts: "Unika produkter",
          uniqueProductsDescription:
            "Upptäck noggrant utvalda 3D-printade produkter designade för vardagen.",

          customDesigns: "Anpassade designer",
          customDesignsDescription:
            "Förvandla din idé, skiss eller modell till en skräddarsydd 3D-printad produkt.",

          madeWithCare: "Tillverkad med omsorg",
          madeWithCareDescription:
            "Vi fokuserar på detaljer, material och utskriftskvalitet för att skapa produkter du kommer att uppskatta.",

          explore: "Utforska",
          featuredProducts: "Utvalda produkter",
          viewAll: "Visa alla",
          viewAllProducts: "Visa alla produkter",

          productImage: "Produktbild",
          loadingProducts: "Laddar produkter...",

          customPrinting: "Anpassad 3D-utskrift",
          customHeading:
            "Har du en idé som ännu inte finns?",
          customDescription:
            "Ta med din egen design eller berätta vad du vill skapa. Vi hjälper dig att förvandla din idé till en fysisk 3D-utskrift.",
          createCustomPrint: "Skapa din specialutskrift",

          copyright:
            "© 2026 RD nordform AB. Alla rättigheter förbehållna.",
        };

  // =====================================================
  // LOAD REAL PRODUCTS FROM BACKEND
  // =====================================================

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoadingProducts(true);

        const data = await getProducts();

        setProducts(data);
      } catch (error) {
        console.error(
          "Failed to load homepage products:",
          error
        );
      } finally {
        setLoadingProducts(false);
      }
    };

    loadProducts();
  }, []);

  // Show only 4 products on homepage
  const featuredProducts = products.slice(0, 4);

  return (
    <main
      className="min-h-screen transition-colors"
      style={{
        backgroundColor: "var(--background)",
        color: "var(--foreground)",
      }}
    >
      <Navbar />

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative overflow-hidden px-8 py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-2">
          {/* Left */}
          <div>
            <p
              className="text-sm font-semibold uppercase tracking-[0.3em]"
              style={{
                color: "var(--muted)",
              }}
            >
              RD nordform AB
            </p>

            <h1 className="mt-6 text-5xl font-bold leading-tight tracking-tight md:text-6xl">
              {text.heroTitle1}

              <span className="block">
                {text.heroTitle2}
              </span>
            </h1>

            <p
              className="mt-6 max-w-xl text-lg leading-8"
              style={{
                color: "var(--muted)",
              }}
            >
              {text.heroDescription}
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                href="/products"
                className="rounded-lg px-7 py-3 font-semibold transition hover:opacity-80"
                style={{
                  backgroundColor: "var(--foreground)",
                  color: "var(--background)",
                }}
              >
                {text.exploreProducts}
              </Link>

              <Link
                href="/custom-print"
                className="rounded-lg border px-7 py-3 font-semibold transition hover:opacity-70"
                style={{
                  borderColor: "var(--border)",
                  color: "var(--foreground)",
                }}
              >
                {text.customPrint}
              </Link>
            </div>
          </div>

          {/* Video */}
          <div className="relative min-h-[420px] overflow-hidden rounded-3xl">
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              className="absolute inset-0 h-full w-full object-cover"
            >
              <source
                src="/videos/3d-printing.mp4"
                type="video/mp4"
              />
            </video>

            <div className="absolute inset-0 bg-black/20" />
          </div>
        </div>
      </section>

      {/* =====================================================
          FEATURES
      ===================================================== */}

      <section
        className="border-y px-8 py-20 transition-colors"
        style={{
          backgroundColor: "var(--surface-secondary)",
          borderColor: "var(--border)",
        }}
      >
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 md:grid-cols-3">
            {/* Feature 1 */}
            <div
              className="rounded-2xl border p-8 transition-colors"
              style={{
                backgroundColor: "var(--surface)",
                borderColor: "var(--border)",
              }}
            >
              <span className="text-3xl">
                ◇
              </span>

              <h2 className="mt-6 text-xl font-bold">
                {text.uniqueProducts}
              </h2>

              <p
                className="mt-3 leading-7"
                style={{
                  color: "var(--muted)",
                }}
              >
                {text.uniqueProductsDescription}
              </p>
            </div>

            {/* Feature 2 */}
            <div
              className="rounded-2xl border p-8 transition-colors"
              style={{
                backgroundColor: "var(--surface)",
                borderColor: "var(--border)",
              }}
            >
              <span className="text-3xl">
                ✦
              </span>

              <h2 className="mt-6 text-xl font-bold">
                {text.customDesigns}
              </h2>

              <p
                className="mt-3 leading-7"
                style={{
                  color: "var(--muted)",
                }}
              >
                {text.customDesignsDescription}
              </p>
            </div>

            {/* Feature 3 */}
            <div
              className="rounded-2xl border p-8 transition-colors"
              style={{
                backgroundColor: "var(--surface)",
                borderColor: "var(--border)",
              }}
            >
              <span className="text-3xl">
                ⚙
              </span>

              <h2 className="mt-6 text-xl font-bold">
                {text.madeWithCare}
              </h2>

              <p
                className="mt-3 leading-7"
                style={{
                  color: "var(--muted)",
                }}
              >
                {text.madeWithCareDescription}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          FEATURED PRODUCTS
      ===================================================== */}

      <section className="px-8 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-end justify-between">
            <div>
              <p
                className="text-sm font-semibold uppercase tracking-widest"
                style={{
                  color: "var(--muted)",
                }}
              >
                {text.explore}
              </p>

              <h2 className="mt-2 text-4xl font-bold">
                {text.featuredProducts}
              </h2>
            </div>

            <Link
              href="/products"
              className="hidden text-sm font-semibold hover:underline sm:block"
            >
              {text.viewAll} →
            </Link>
          </div>

          {/* Loading */}
          {loadingProducts && (
            <div
              className="py-16 text-center"
              style={{
                color: "var(--muted)",
              }}
            >
              {text.loadingProducts}
            </div>
          )}

          {/* Products */}
          {!loadingProducts &&
            featuredProducts.length > 0 && (
              <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {featuredProducts.map((product) => {
                  const displayName =
                    language === "sv" &&
                    product.nameSv
                      ? product.nameSv
                      : product.name;

                  return (
                    <div
                      key={product.slug}
                      className="rounded-2xl border p-4 transition-colors"
                      style={{
                        backgroundColor: "var(--surface)",
                        borderColor: "var(--border)",
                      }}
                    >
                      {/* Product Image */}
                      <Link
                        href={`/products/${product.slug}`}
                      >
                        <div
                          className="flex h-52 items-center justify-center overflow-hidden rounded-xl"
                          style={{
                            backgroundColor:
                              "var(--surface-secondary)",
                          }}
                        >
                          {product.imageUrl ? (
                            <img
                              src={product.imageUrl}
                              alt={displayName}
                              className="h-full w-full object-contain p-2 transition-transform duration-300 hover:scale-105"
                            />
                          ) : (
                            <span
                              style={{
                                color: "var(--muted)",
                              }}
                            >
                              {text.productImage}
                            </span>
                          )}
                        </div>
                      </Link>

                      {/* Product Name */}
                      <Link
                        href={`/products/${product.slug}`}
                      >
                        <h3 className="mt-5 font-semibold transition hover:opacity-70">
                          {displayName}
                        </h3>
                      </Link>

                      {/* Price */}
                      <p className="mt-2 font-bold">
                        {product.price} kr
                      </p>
                    </div>
                  );
                })}
              </div>
            )}

          <div className="mt-8 text-center sm:hidden">
            <Link
              href="/products"
              className="font-semibold hover:underline"
            >
              {text.viewAllProducts} →
            </Link>
          </div>
        </div>
      </section>

      {/* =====================================================
          CUSTOM PRINT CTA
      ===================================================== */}

      <section className="px-8 pb-24">
        <div
          className="mx-auto max-w-7xl rounded-3xl border px-8 py-20 text-center transition-colors"
          style={{
            backgroundColor: "var(--surface)",
            color: "var(--foreground)",
            borderColor: "var(--border)",
          }}
        >
          <p
            className="text-sm font-semibold uppercase tracking-[0.3em]"
            style={{
              color: "var(--muted)",
            }}
          >
            {text.customPrinting}
          </p>

          <h2 className="mx-auto mt-5 max-w-3xl text-4xl font-bold md:text-5xl">
            {text.customHeading}
          </h2>

          <p
            className="mx-auto mt-5 max-w-2xl leading-7"
            style={{
              color: "var(--muted)",
            }}
          >
            {text.customDescription}
          </p>

          <Link
            href="/custom-print"
            className="mt-8 inline-block rounded-lg px-7 py-3 font-semibold transition hover:opacity-80"
            style={{
              backgroundColor: "var(--foreground)",
              color: "var(--background)",
            }}
          >
            {text.createCustomPrint}
          </Link>
        </div>
      </section>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer
        className="border-t px-8 py-8 text-center text-sm transition-colors"
        style={{
          backgroundColor: "var(--surface)",
          borderColor: "var(--border)",
          color: "var(--muted)",
        }}
      >
        {text.copyright}
      </footer>
    </main>
  );
}