"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Product } from "@/data/products";
import { getProducts } from "@/lib/api";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import Navbar from "@/components/Navbar";

const categories = [
  {
    value: "All",
    en: "All",
    sv: "Alla",
  },
  {
    value: "Home Decor",
    en: "Home Decor",
    sv: "Heminredning",
  },
  {
    value: "Keychains",
    en: "Keychains",
    sv: "Nyckelringar",
  },
  {
    value: "Miniatures",
    en: "Miniatures",
    sv: "Miniatyrer",
  },
  {
    value: "Desk Accessories",
    en: "Desk Accessories",
    sv: "Skrivbordstillbehör",
  },
  {
    value: "Gaming",
    en: "Gaming",
    sv: "Gaming",
  },
  {
    value: "Gifts",
    en: "Gifts",
    sv: "Presenter",
  },
  {
    value: "Anime",
    en: "Anime",
    sv: "Anime",
  },
  {
    value: "Custom Prints",
    en: "Custom Prints",
    sv: "Specialutskrifter",
  },
];

export default function ProductsPage() {
  const { addToCart } = useCart();
  const { language } = useLanguage();

  const [products, setProducts] = useState<Product[]>([]);

  const [selectedCategory, setSelectedCategory] =
    useState("All");

  const [searchQuery, setSearchQuery] =
    useState("");

  const [addedProduct, setAddedProduct] =
    useState<string | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(false);

  const text =
    language === "en"
      ? {
          shopTitle:
            "Shop 3D Printed Products",

          shopDescription:
            "Discover unique, practical and high-quality 3D printed products made with care.",

          searchPlaceholder:
            "Search products...",

          searchLabel:
            "Search products",

          clearSearchLabel:
            "Clear search",

          product: "product",
          products: "products",
          found: "found",

          noProductsFor:
            "No products found for",

          loadingProducts:
            "Loading products...",

          unableToLoad:
            "Unable to load products",

          backendMessage:
            "Please make sure the backend is running on port 3001.",

          tryAgain:
            "Try Again",

          productImage:
            "Product Image",

          added:
            "✓ Added",

          addToCart:
            "Add to Cart",

          noProducts:
            "No products found",

          noProductStarts:
            "No product name starts with",

          tryAnotherSearch:
            "Try another search.",

          noProductsCategory:
            "There are no products in this category yet.",

          clearSearch:
            "Clear Search",

          specialQuestion:
            "Have something special in mind?",

          customTitle:
            "Create Your Own Custom Print",

          customDescription:
            "Send us your idea and we can help turn your concept into a unique 3D printed product.",

          requestCustom:
            "Request Custom Print",

          rights:
            "All rights reserved.",
        }
      : {
          shopTitle:
            "Handla 3D-printade produkter",

          shopDescription:
            "Upptäck unika, praktiska och högkvalitativa 3D-printade produkter tillverkade med omsorg.",

          searchPlaceholder:
            "Sök produkter...",

          searchLabel:
            "Sök produkter",

          clearSearchLabel:
            "Rensa sökning",

          product: "produkt",
          products: "produkter",
          found: "hittades",

          noProductsFor:
            "Inga produkter hittades för",

          loadingProducts:
            "Laddar produkter...",

          unableToLoad:
            "Det gick inte att ladda produkterna",

          backendMessage:
            "Kontrollera att backend-servern körs på port 3001.",

          tryAgain:
            "Försök igen",

          productImage:
            "Produktbild",

          added:
            "✓ Tillagd",

          addToCart:
            "Lägg i varukorgen",

          noProducts:
            "Inga produkter hittades",

          noProductStarts:
            "Inget produktnamn börjar med",

          tryAnotherSearch:
            "Prova en annan sökning.",

          noProductsCategory:
            "Det finns inga produkter i den här kategorin ännu.",

          clearSearch:
            "Rensa sökning",

          specialQuestion:
            "Har du något speciellt i åtanke?",

          customTitle:
            "Skapa din egen specialutskrift",

          customDescription:
            "Skicka din idé till oss så hjälper vi dig att förvandla ditt koncept till en unik 3D-printad produkt.",

          requestCustom:
            "Begär specialutskrift",

          rights:
            "Alla rättigheter förbehållna.",
        };

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await getProducts();

        setProducts(data);
        setError(false);
      } catch (error) {
        console.error(
          "Failed to load products:",
          error
        );

        setError(true);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  /*
   * Returns English or Swedish product name.
   */
  const getProductName = (
    product: Product
  ) => {
    if (
      language === "sv" &&
      product.nameSv
    ) {
      return product.nameSv;
    }

    return product.name;
  };

  /*
   * Translate category shown on product cards.
   *
   * Database filtering still uses the
   * original English category.
   */
  const getCategoryLabel = (
    categoryName: string
  ) => {
    const normalized =
      categoryName
        .trim()
        .toLowerCase();

    const category =
      categories.find(
        (item) =>
          item.value.toLowerCase() ===
          normalized
      );

    if (category) {
      return language === "en"
        ? category.en
        : category.sv;
    }

    /*
     * Extra database categories.
     */
    if (language === "sv") {
      const extraCategories: Record<
        string,
        string
      > = {
        keychain: "Nyckelring",
        keychains: "Nyckelringar",

        toy: "Leksak",
        toys: "Leksaker",

        test: "Test",

        gift: "Present",
        gifts: "Presenter",

        miniature: "Miniatyr",
        miniatures: "Miniatyrer",

        "custom print":
          "Specialutskrift",

        "custom prints":
          "Specialutskrifter",

        "home decor":
          "Heminredning",

        "desk accessories":
          "Skrivbordstillbehör",

        gaming: "Gaming",

        anime: "Anime",
      };

      return (
        extraCategories[normalized] ||
        categoryName
      );
    }

    return categoryName;
  };

  /*
   * SEARCH + CATEGORY FILTER
   */
  const filteredProducts =
    products.filter((product) => {
      const matchesCategory =
        selectedCategory === "All" ||
        product.category ===
          selectedCategory;

      const search = searchQuery
        .trim()
        .toLowerCase();

      const productName =
        getProductName(product)
          .trim()
          .toLowerCase();

      const englishName =
        product.name
          .trim()
          .toLowerCase();

      const swedishName =
        product.nameSv
          ?.trim()
          .toLowerCase() || "";

      const matchesSearch =
        search === "" ||
        productName.startsWith(search) ||
        englishName.startsWith(search) ||
        swedishName.startsWith(search);

      return (
        matchesCategory &&
        matchesSearch
      );
    });

  const handleAddToCart = (
    slug: string
  ) => {
    const product = products.find(
      (item) =>
        item.slug === slug
    );

    if (!product) return;

    addToCart(product);

    setAddedProduct(slug);

    setTimeout(() => {
      setAddedProduct(null);
    }, 1200);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  return (
    <main
      className="min-h-screen transition-colors"
      style={{
        backgroundColor:
          "var(--background)",

        color:
          "var(--foreground)",
      }}
    >
      <Navbar />

      {/* HEADER */}
      <section
        className="border-b px-6 py-16 text-center transition-colors sm:px-8"
        style={{
          backgroundColor:
            "var(--surface-secondary)",

          borderColor:
            "var(--border)",
        }}
      >
        <div className="mx-auto max-w-4xl">

          <p
            className="text-sm font-semibold uppercase tracking-[0.3em]"
            style={{
              color:
                "var(--muted)",
            }}
          >
            RD nordform AB
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-6xl">
            {text.shopTitle}
          </h1>

          <p
            className="mx-auto mt-5 max-w-2xl text-lg leading-8"
            style={{
              color:
                "var(--muted)",
            }}
          >
            {text.shopDescription}
          </p>

        </div>
      </section>

      {/* SEARCH */}
      <section className="px-6 pt-10 sm:px-8">

        <div className="mx-auto max-w-3xl">

          <div
            className="relative flex items-center rounded-2xl border transition-colors"
            style={{
              backgroundColor:
                "var(--surface)",

              borderColor:
                "var(--border)",
            }}
          >
            <div className="pointer-events-none absolute left-5 text-xl">
              🔍
            </div>

            <input
              type="text"

              value={searchQuery}

              onChange={(event) =>
                setSearchQuery(
                  event.target.value
                )
              }

              placeholder={
                text.searchPlaceholder
              }

              className="w-full rounded-2xl bg-transparent py-4 pl-14 pr-14 text-base outline-none"

              style={{
                color:
                  "var(--foreground)",
              }}

              aria-label={
                text.searchLabel
              }
            />

            {searchQuery && (
              <button
                type="button"

                onClick={clearSearch}

                className="absolute right-4 flex h-8 w-8 items-center justify-center rounded-full text-lg transition-opacity hover:opacity-60"

                style={{
                  color:
                    "var(--muted)",
                }}

                aria-label={
                  text.clearSearchLabel
                }
              >
                ×
              </button>
            )}

          </div>

          {searchQuery.trim() && (
            <div
              className="mt-3 text-center text-sm"

              style={{
                color:
                  "var(--muted)",
              }}
            >
              {filteredProducts.length ===
              0
                ? `${text.noProductsFor} "${searchQuery}"`

                : `${
                    filteredProducts.length
                  } ${
                    filteredProducts.length ===
                    1
                      ? text.product
                      : text.products
                  } ${text.found}`}
            </div>
          )}

        </div>
      </section>

      {/* CATEGORIES */}
      <section className="px-6 pt-8 sm:px-8">

        <div className="mx-auto max-w-7xl">

          <div className="flex flex-wrap justify-center gap-3">

            {categories.map(
              (category) => {
                const isSelected =
                  selectedCategory ===
                  category.value;

                return (
                  <button
                    key={
                      category.value
                    }

                    type="button"

                    onClick={() =>
                      setSelectedCategory(
                        category.value
                      )
                    }

                    className="rounded-full border px-5 py-2.5 text-sm font-medium transition-all duration-200 hover:-translate-y-0.5"

                    style={{
                      backgroundColor:
                        isSelected
                          ? "var(--foreground)"
                          : "var(--surface)",

                      color:
                        isSelected
                          ? "var(--background)"
                          : "var(--foreground)",

                      borderColor:
                        "var(--border)",
                    }}
                  >
                    {language === "en"
                      ? category.en
                      : category.sv}
                  </button>
                );
              }
            )}

          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="px-6 py-12 sm:px-8">

        <div className="mx-auto max-w-7xl">

          {/* LOADING */}
          {loading && (
            <div className="py-20 text-center">

              <div className="text-5xl">
                🖨️
              </div>

              <p
                className="mt-5 text-lg"

                style={{
                  color:
                    "var(--muted)",
                }}
              >
                {text.loadingProducts}
              </p>

            </div>
          )}

          {/* ERROR */}
          {!loading && error && (
            <div
              className="rounded-2xl border py-20 text-center"

              style={{
                backgroundColor:
                  "var(--surface)",

                borderColor:
                  "var(--border)",
              }}
            >

              <div className="text-5xl">
                ⚠️
              </div>

              <h2 className="mt-5 text-2xl font-semibold">
                {text.unableToLoad}
              </h2>

              <p
                className="mt-2"

                style={{
                  color:
                    "var(--muted)",
                }}
              >
                {text.backendMessage}
              </p>

              <button
                type="button"

                onClick={() =>
                  window.location.reload()
                }

                className="mt-6 rounded-xl px-6 py-3 font-semibold transition hover:scale-105 hover:opacity-80"

                style={{
                  backgroundColor:
                    "var(--foreground)",

                  color:
                    "var(--background)",
                }}
              >
                {text.tryAgain}
              </button>

            </div>
          )}

          {/* PRODUCT GRID */}
          {!loading && !error && (
            <>
              {filteredProducts.length >
                0 && (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

                  {filteredProducts.map(
                    (product) => {
                      const displayName =
                        getProductName(
                          product
                        );

                      return (
                        <div
                          key={
                            product.slug
                          }

                          className="group overflow-hidden rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"

                          style={{
                            backgroundColor:
                              "var(--surface)",

                            borderColor:
                              "var(--border)",
                          }}
                        >

                          {/* PRODUCT IMAGE */}
                          <Link
                            href={`/products/${product.slug}`}
                          >
                            <div
                              className="h-64 w-full overflow-hidden"

                              style={{
                                backgroundColor:
                                  "var(--surface-secondary)",
                              }}
                            >
                              {product.imageUrl ? (
                                <img
                                  src={
                                    product.imageUrl
                                  }

                                  alt={
                                    displayName
                                  }

                                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center">

                                  <div className="text-center">

                                    <div className="text-5xl">
                                      🖨️
                                    </div>

                                    <p
                                      className="mt-3 text-sm"

                                      style={{
                                        color:
                                          "var(--muted)",
                                      }}
                                    >
                                      {
                                        text.productImage
                                      }
                                    </p>

                                  </div>
                                </div>
                              )}
                            </div>
                          </Link>

                          {/* PRODUCT INFO */}
                          <div className="p-5">

                            {/* Category */}
                            <p
                              className="text-xs font-semibold uppercase tracking-wider"

                              style={{
                                color:
                                  "var(--muted)",
                              }}
                            >
                              {getCategoryLabel(
                                product.category
                              )}
                            </p>

                            {/* Product Name */}
                            <Link
                              href={`/products/${product.slug}`}
                            >
                              <h2 className="mt-2 text-lg font-semibold transition-opacity hover:opacity-70">
                                {
                                  displayName
                                }
                              </h2>
                            </Link>

                            {/* Rating */}
                            <div className="mt-3 flex items-center gap-2">

                              <span className="text-yellow-500">
                                ★
                              </span>

                              <span
                                className="text-sm"

                                style={{
                                  color:
                                    "var(--muted)",
                                }}
                              >
                                {
                                  product.rating
                                }
                              </span>

                            </div>

                            {/* Price + Cart */}
                            <div className="mt-5 flex items-center justify-between gap-3">

                              <span className="text-xl font-bold">
                                {
                                  product.price
                                }{" "}
                                kr
                              </span>

                              <button
                                type="button"

                                onClick={() =>
                                  handleAddToCart(
                                    product.slug
                                  )
                                }

                                className="rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 hover:scale-105 hover:opacity-80"

                                style={{
                                  backgroundColor:
                                    addedProduct ===
                                    product.slug
                                      ? "#16a34a"
                                      : "var(--foreground)",

                                  color:
                                    "var(--background)",
                                }}
                              >
                                {addedProduct ===
                                product.slug
                                  ? text.added
                                  : text.addToCart}
                              </button>

                            </div>
                          </div>
                        </div>
                      );
                    }
                  )}

                </div>
              )}

              {/* EMPTY SEARCH */}
              {filteredProducts.length ===
                0 && (
                <div
                  className="rounded-2xl border py-20 text-center"

                  style={{
                    backgroundColor:
                      "var(--surface)",

                    borderColor:
                      "var(--border)",
                  }}
                >

                  <div className="text-5xl">
                    🔍
                  </div>

                  <h2 className="mt-5 text-2xl font-semibold">
                    {text.noProducts}
                  </h2>

                  <p
                    className="mx-auto mt-2 max-w-md"

                    style={{
                      color:
                        "var(--muted)",
                    }}
                  >
                    {searchQuery.trim()
                      ? `${text.noProductStarts} "${searchQuery}". ${text.tryAnotherSearch}`
                      : text.noProductsCategory}
                  </p>

                  {searchQuery.trim() && (
                    <button
                      type="button"

                      onClick={
                        clearSearch
                      }

                      className="mt-6 rounded-xl px-6 py-3 font-semibold transition hover:scale-105 hover:opacity-80"

                      style={{
                        backgroundColor:
                          "var(--foreground)",

                        color:
                          "var(--background)",
                      }}
                    >
                      {
                        text.clearSearch
                      }
                    </button>
                  )}

                </div>
              )}

            </>
          )}

        </div>
      </section>

      {/* CUSTOM PRINT CTA */}
      <section className="px-6 pb-16 sm:px-8">

        <div className="mx-auto max-w-7xl">

          <div
            className="overflow-hidden rounded-3xl border px-6 py-14 text-center sm:px-10"

            style={{
              backgroundColor:
                "var(--surface-secondary)",

              borderColor:
                "var(--border)",
            }}
          >

            <p
              className="text-sm font-semibold uppercase tracking-[0.25em]"

              style={{
                color:
                  "var(--muted)",
              }}
            >
              {text.specialQuestion}
            </p>

            <h2 className="mt-4 text-3xl font-bold md:text-4xl">
              {text.customTitle}
            </h2>

            <p
              className="mx-auto mt-4 max-w-2xl leading-7"

              style={{
                color:
                  "var(--muted)",
              }}
            >
              {text.customDescription}
            </p>

            <Link
              href="/custom-print"

              className="mt-7 inline-flex rounded-xl px-6 py-3 font-semibold transition hover:-translate-y-0.5 hover:opacity-80"

              style={{
                backgroundColor:
                  "var(--foreground)",

                color:
                  "var(--background)",
              }}
            >
              {text.requestCustom}
            </Link>

          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        className="border-t px-6 py-10 text-center"

        style={{
          borderColor:
            "var(--border)",
        }}
      >

        <div className="mx-auto max-w-7xl">

          <div
            className="text-sm"

            style={{
              color:
                "var(--muted)",
            }}
          >
            ©{" "}
            {new Date().getFullYear()}{" "}
            RD nordform AB.{" "}
            {text.rights}
          </div>

        </div>
      </footer>

    </main>
  );
}