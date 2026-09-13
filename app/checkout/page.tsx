"use client";

import Link from "next/link";
import { useState } from "react";

import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import Navbar from "@/components/Navbar";

export default function CheckoutPage() {
  const {
    cart,
    selectedItems,
    setSelectedItems,
    removeFromCart,
  } = useCart();

  const { language } = useLanguage();

  const text =
    language === "en"
      ? {
          selectAtLeastOne:
            "Please select at least one product.",

          validPhone:
            "Please enter a valid 10-digit phone number.",

          validPincode:
            "Please enter a valid 5-digit postal code.",

          failedPlaceOrder:
            "Failed to place order",

          genericOrderError:
            "Something went wrong while placing your order.",

          noProductsSelected:
            "No products selected",

          noProductsSelectedDesc:
            "Select a product from your cart before checking out.",

          goToCart:
            "Go to Cart",

          orderPlaced:
            "Order Placed!",

          orderPlacedDesc:
            "Thank you for shopping with RD nordform AB. Your order has been successfully received.",

          orderId:
            "Order ID",

          orderReceived:
            "✓ Order received",

          contactMessage:
            "We'll contact you using the details provided during checkout.",

          continueShopping:
            "Continue Shopping",

          backToCart:
            "← Back to Cart",

          checkout:
            "Checkout",

          checkoutDesc:
            "Enter your delivery details to complete your order.",

          step01:
            "Step 01",

          customerInformation:
            "Customer Information",

          fullName:
            "Full Name",

          fullNamePlaceholder:
            "Enter your full name",

          email:
            "Email",

          phone:
            "Phone",

          phonePlaceholder:
            "10-digit phone number",

          step02:
            "Step 02",

          deliveryAddress:
            "Delivery Address",

          address:
            "Address",

          addressPlaceholder:
            "House number, street, area",

          city:
            "City",

          state:
            "State",

          pincode:
            "Postal Code",

          pincodePlaceholder:
            "5-digit postal code",

          unableToPlaceOrder:
            "Unable to place order",

          placingOrder:
            "Placing Order...",

          placeOrder:
            "Place Order",

          yourOrder:
            "Your Order",

          orderSummary:
            "Order Summary",

          subtotal:
            "Subtotal",

          shipping:
            "Shipping",

          free:
            "Free",

          total:
            "Total",

          secureOrder:
            "✓ Secure order",

          secureOrderDesc:
            "Your order details will be securely submitted for review before production begins.",

          rights:
            "All rights reserved.",
        }
      : {
          selectAtLeastOne:
            "Välj minst en produkt.",

          validPhone:
            "Ange ett giltigt 10-siffrigt telefonnummer.",

          validPincode:
            "Ange ett giltigt 5-siffrigt postnummer.",

          failedPlaceOrder:
            "Det gick inte att lägga beställningen",

          genericOrderError:
            "Något gick fel när din beställning skulle läggas.",

          noProductsSelected:
            "Inga produkter valda",

          noProductsSelectedDesc:
            "Välj en produkt i varukorgen innan du går till kassan.",

          goToCart:
            "Gå till varukorgen",

          orderPlaced:
            "Beställningen är lagd!",

          orderPlacedDesc:
            "Tack för att du handlar hos RD nordform AB. Din beställning har tagits emot.",

          orderId:
            "Ordernummer",

          orderReceived:
            "✓ Beställning mottagen",

          contactMessage:
            "Vi kontaktar dig med hjälp av uppgifterna du angav i kassan.",

          continueShopping:
            "Fortsätt handla",

          backToCart:
            "← Tillbaka till varukorgen",

          checkout:
            "Kassa",

          checkoutDesc:
            "Ange dina leveransuppgifter för att slutföra beställningen.",

          step01:
            "Steg 01",

          customerInformation:
            "Kundinformation",

          fullName:
            "Fullständigt namn",

          fullNamePlaceholder:
            "Ange ditt fullständiga namn",

          email:
            "E-post",

          phone:
            "Telefon",

          phonePlaceholder:
            "10-siffrigt telefonnummer",

          step02:
            "Steg 02",

          deliveryAddress:
            "Leveransadress",

          address:
            "Adress",

          addressPlaceholder:
            "Husnummer, gata, område",

          city:
            "Stad",

          state:
            "Region",

          pincode:
            "Postnummer",

          pincodePlaceholder:
            "5-siffrigt postnummer",

          unableToPlaceOrder:
            "Det gick inte att lägga beställningen",

          placingOrder:
            "Beställningen skickas...",

          placeOrder:
            "Lägg beställning",

          yourOrder:
            "Din beställning",

          orderSummary:
            "Ordersammanfattning",

          subtotal:
            "Delsumma",

          shipping:
            "Frakt",

          free:
            "Gratis",

          total:
            "Totalt",

          secureOrder:
            "✓ Säker beställning",

          secureOrderDesc:
            "Dina beställningsuppgifter skickas säkert för granskning innan produktionen börjar.",

          rights:
            "Alla rättigheter förbehållna.",
        };

  /*
   * PRODUCT NAME TRANSLATION
   */
  const productNameLabel = (
    name: string,
    nameSv?: string | null
  ) => {
    if (language === "en") {
      return name;
    }

    if (nameSv) {
      return nameSv;
    }

    const swedishNames: Record<
      string,
      string
    > = {
      venom: "Venom figur",

      "head massager":
        "Huvudmassagerare",

      "Custom 3D Print":
        "Anpassad 3D-utskrift",

      "Custom Name Keychain":
        "Personlig nyckelring med namn",

      "Geometric Planter":
        "Geometrisk blomkruka",

      "Desk Organizer":
        "Skrivbordsorganisatör",

      "Miniature Figure":
        "Miniatyrfigur",

      "Anime Character Figure":
        "Animefigur",

      "Gaming Controller Stand":
        "Ställ för spelkontroll",
    };

    return swedishNames[name] || name;
  };

  const [orderPlaced, setOrderPlaced] =
    useState(false);

  const [orderId, setOrderId] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (selectedProducts.length === 0) {
      setError(text.selectAtLeastOne);
      return;
    }

    if (
      form.phone.replace(/\D/g, "").length !==
      10
    ) {
      setError(text.validPhone);
      return;
    }

    // Swedish postal code = 5 digits
    // Used in BOTH English and Swedish mode
    if (
      form.pincode.replace(/\D/g, "")
        .length !== 5
    ) {
      setError(text.validPincode);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${
          process.env
            .NEXT_PUBLIC_API_URL ||
          "http://localhost:3001"
        }/orders`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            customerName: form.name,

            email: form.email,

            phone: form.phone,

            address:
              `${form.address}, ${form.state}`,

            city: form.city,

            postalCode:
              form.pincode,

            // Store is located in Sweden
            country: "Sweden",

            items:
              selectedProducts.map(
                (item) => ({
                  productId:
                    item.id,

                  quantity:
                    item.quantity,
                })
              ),
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            text.failedPlaceOrder
        );
      }

      setOrderId(
        `RD-${data.id}`
      );

      selectedProducts.forEach(
        (item) => {
          removeFromCart(
            item.slug
          );
        }
      );

      setSelectedItems([]);

      setOrderPlaced(true);
    } catch (err) {
      console.error(
        "Checkout error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : text.genericOrderError
      );
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    backgroundColor:
      "var(--surface-secondary)",

    color:
      "var(--foreground)",

    borderColor:
      "var(--border)",
  };

  /*
   * =========================
   * NO PRODUCTS SELECTED
   * =========================
   */

  if (
    selectedProducts.length === 0 &&
    !orderPlaced
  ) {
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

        <section className="flex min-h-[70vh] items-center justify-center px-6">
          <div
            className="w-full max-w-lg rounded-3xl border p-10 text-center shadow-sm"
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

            <h1 className="mt-6 text-3xl font-bold">
              {
                text.noProductsSelected
              }
            </h1>

            <p
              className="mt-3"
              style={{
                color:
                  "var(--muted)",
              }}
            >
              {
                text.noProductsSelectedDesc
              }
            </p>

            <Link
              href="/cart"
              className="mt-7 inline-block rounded-xl px-7 py-3.5 font-semibold transition hover:opacity-90"
              style={{
                backgroundColor:
                  "var(--foreground)",

                color:
                  "var(--background)",
              }}
            >
              {text.goToCart}
            </Link>
          </div>
        </section>

        <footer
          className="border-t px-6 py-8 text-center text-sm"
          style={{
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

  /*
   * =========================
   * ORDER SUCCESS
   * =========================
   */

  if (orderPlaced) {
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

        <section className="flex min-h-[70vh] items-center justify-center px-6 py-16">
          <div
            className="w-full max-w-lg rounded-3xl border p-8 text-center shadow-sm sm:p-12"
            style={{
              backgroundColor:
                "var(--surface)",

              borderColor:
                "var(--border)",
            }}
          >
            <div
              className="mx-auto flex h-20 w-20 items-center justify-center rounded-full text-4xl"
              style={{
                backgroundColor:
                  "#dcfce7",

                color:
                  "#16a34a",
              }}
            >
              ✓
            </div>

            <h1 className="mt-7 text-4xl font-bold">
              {text.orderPlaced}
            </h1>

            <p
              className="mt-4 leading-6"
              style={{
                color:
                  "var(--muted)",
              }}
            >
              {
                text.orderPlacedDesc
              }
            </p>

            <div
              className="mt-8 rounded-2xl border p-6"
              style={{
                backgroundColor:
                  "var(--surface-secondary)",

                borderColor:
                  "var(--border)",
              }}
            >
              <p
                className="text-xs font-semibold uppercase tracking-wider"
                style={{
                  color:
                    "var(--muted)",
                }}
              >
                {text.orderId}
              </p>

              <p className="mt-2 text-2xl font-bold">
                {orderId}
              </p>
            </div>

            <div
              className="mt-6 rounded-xl p-4 text-left"
              style={{
                backgroundColor:
                  "var(--surface-secondary)",
              }}
            >
              <p className="text-sm font-semibold">
                {
                  text.orderReceived
                }
              </p>

              <p
                className="mt-1 text-xs leading-5"
                style={{
                  color:
                    "var(--muted)",
                }}
              >
                {
                  text.contactMessage
                }
              </p>
            </div>

            <Link
              href="/products"
              className="mt-8 inline-block rounded-xl px-7 py-3.5 font-semibold transition hover:opacity-90"
              style={{
                backgroundColor:
                  "var(--foreground)",

                color:
                  "var(--background)",
              }}
            >
              {
                text.continueShopping
              }
            </Link>
          </div>
        </section>

        <footer
          className="border-t px-6 py-10 text-center text-sm"
          style={{
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

  /*
   * =========================
   * CHECKOUT
   * =========================
   */

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

      {/* HEADER */}
      <section
        className="border-b"
        style={{
          backgroundColor:
            "var(--surface-secondary)",

          borderColor:
            "var(--border)",
        }}
      >
        <div className="mx-auto max-w-7xl px-6 py-12 sm:px-8">
          <Link
            href="/cart"
            className="text-sm font-medium transition hover:opacity-70"
            style={{
              color:
                "var(--muted)",
            }}
          >
            {text.backToCart}
          </Link>

          <p
            className="mt-7 text-sm font-semibold uppercase tracking-[0.3em]"
            style={{
              color:
                "var(--muted)",
            }}
          >
            RD nordform AB
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">
            {text.checkout}
          </h1>

          <p
            className="mt-3 max-w-2xl"
            style={{
              color:
                "var(--muted)",
            }}
          >
            {text.checkoutDesc}
          </p>
        </div>
      </section>

      {/* CHECKOUT CONTENT */}
      <section className="mx-auto grid max-w-7xl gap-8 px-6 py-12 sm:px-8 lg:grid-cols-3">

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="space-y-6 lg:col-span-2"
        >

          {/* STEP 01 */}
          <div
            className="rounded-2xl border p-6 shadow-sm sm:p-8"
            style={{
              backgroundColor:
                "var(--surface)",

              borderColor:
                "var(--border)",
            }}
          >
            <p
              className="text-sm font-semibold uppercase tracking-wider"
              style={{
                color:
                  "var(--muted)",
              }}
            >
              {text.step01}
            </p>

            <h2 className="mt-2 text-2xl font-bold">
              {
                text.customerInformation
              }
            </h2>

            <div className="mt-7 grid gap-5 sm:grid-cols-2">

              {/* FULL NAME */}
              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-semibold">
                  {text.fullName}
                </label>

                <input
                  required
                  name="name"
                  value={form.name}
                  onChange={
                    handleChange
                  }
                  placeholder={
                    text.fullNamePlaceholder
                  }
                  autoComplete="name"
                  className="w-full rounded-xl border px-4 py-3.5 outline-none transition focus:border-[var(--foreground)]"
                  style={
                    inputStyle
                  }
                />
              </div>

              {/* EMAIL */}
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  {text.email}
                </label>

                <input
                  required
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={
                    handleChange
                  }
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="w-full rounded-xl border px-4 py-3.5 outline-none transition focus:border-[var(--foreground)]"
                  style={
                    inputStyle
                  }
                />
              </div>

              {/* PHONE */}
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  {text.phone}
                </label>

                <input
                  required
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={(e) => {
                    const value =
                      e.target.value.replace(
                        /\D/g,
                        ""
                      );

                    setForm({
                      ...form,
                      phone: value,
                    });

                    setError("");
                  }}
                  placeholder={
                    text.phonePlaceholder
                  }
                  maxLength={10}
                  inputMode="numeric"
                  autoComplete="tel"
                  pattern="[0-9]{10}"
                  className="w-full rounded-xl border px-4 py-3.5 outline-none transition focus:border-[var(--foreground)]"
                  style={
                    inputStyle
                  }
                />
              </div>
            </div>
          </div>

          {/* STEP 02 */}
          <div
            className="rounded-2xl border p-6 shadow-sm sm:p-8"
            style={{
              backgroundColor:
                "var(--surface)",

              borderColor:
                "var(--border)",
            }}
          >
            <p
              className="text-sm font-semibold uppercase tracking-wider"
              style={{
                color:
                  "var(--muted)",
              }}
            >
              {text.step02}
            </p>

            <h2 className="mt-2 text-2xl font-bold">
              {
                text.deliveryAddress
              }
            </h2>

            <div className="mt-7 space-y-5">

              {/* ADDRESS */}
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  {text.address}
                </label>

                <input
                  required
                  name="address"
                  value={
                    form.address
                  }
                  onChange={
                    handleChange
                  }
                  placeholder={
                    text.addressPlaceholder
                  }
                  autoComplete="street-address"
                  className="w-full rounded-xl border px-4 py-3.5 outline-none transition focus:border-[var(--foreground)]"
                  style={
                    inputStyle
                  }
                />
              </div>

              {/* CITY + REGION */}
              <div className="grid gap-5 sm:grid-cols-2">

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    {text.city}
                  </label>

                  <input
                    required
                    name="city"
                    value={
                      form.city
                    }
                    onChange={
                      handleChange
                    }
                    placeholder={
                      text.city
                    }
                    autoComplete="address-level2"
                    className="w-full rounded-xl border px-4 py-3.5 outline-none transition focus:border-[var(--foreground)]"
                    style={
                      inputStyle
                    }
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    {text.state}
                  </label>

                  <input
                    required
                    name="state"
                    value={
                      form.state
                    }
                    onChange={
                      handleChange
                    }
                    placeholder={
                      text.state
                    }
                    autoComplete="address-level1"
                    className="w-full rounded-xl border px-4 py-3.5 outline-none transition focus:border-[var(--foreground)]"
                    style={
                      inputStyle
                    }
                  />
                </div>
              </div>

              {/* POSTAL CODE */}
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  {text.pincode}
                </label>

                <input
                  required
                  name="pincode"
                  value={
                    form.pincode
                  }
                  onChange={(e) => {
                    const value =
                      e.target.value
                        .replace(
                          /\D/g,
                          ""
                        )
                        .slice(
                          0,
                          5
                        );

                    setForm({
                      ...form,
                      pincode:
                        value,
                    });

                    setError("");
                  }}
                  placeholder={
                    text.pincodePlaceholder
                  }

                  // Sweden = 5 digits
                  maxLength={5}

                  inputMode="numeric"

                  pattern="[0-9]{5}"

                  autoComplete="postal-code"

                  className="w-full rounded-xl border px-4 py-3.5 outline-none transition focus:border-[var(--foreground)]"

                  style={
                    inputStyle
                  }
                />
              </div>
            </div>
          </div>

          {/* ERROR */}
          {error && (
            <div
              className="rounded-xl border p-4"
              style={{
                backgroundColor:
                  "#fef2f2",

                borderColor:
                  "#fecaca",

                color:
                  "#b91c1c",
              }}
            >
              <p className="text-sm font-semibold">
                {
                  text.unableToPlaceOrder
                }
              </p>

              <p className="mt-1 text-sm">
                {error}
              </p>
            </div>
          )}

          {/* PLACE ORDER */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl px-6 py-4 text-base font-semibold transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            style={{
              backgroundColor:
                "var(--foreground)",

              color:
                "var(--background)",
            }}
          >
            {loading
              ? text.placingOrder
              : `${text.placeOrder} · ${selectedTotal} kr`}
          </button>
        </form>

        {/* ORDER SUMMARY */}
        <div
          className="h-fit rounded-2xl border p-6 shadow-sm lg:sticky lg:top-24"
          style={{
            backgroundColor:
              "var(--surface)",

            borderColor:
              "var(--border)",
          }}
        >
          <p
            className="text-sm font-semibold uppercase tracking-wider"
            style={{
              color:
                "var(--muted)",
            }}
          >
            {text.yourOrder}
          </p>

          <h2 className="mt-2 text-2xl font-bold">
            {
              text.orderSummary
            }
          </h2>

          {/* PRODUCTS */}
          <div className="mt-6 space-y-4">
            {selectedProducts.map(
              (item) => {
                const displayName =
                  productNameLabel(
                    item.name,
                    item.nameSv
                  );

                return (
                  <div
                    key={
                      item.slug
                    }
                    className="flex gap-4 rounded-xl border p-3"
                    style={{
                      borderColor:
                        "var(--border)",

                      backgroundColor:
                        "var(--surface-secondary)",
                    }}
                  >
                    {/* IMAGE */}
                    <div
                      className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg"
                      style={{
                        backgroundColor:
                          "var(--surface)",
                      }}
                    >
                      {item.imageUrl ? (
                        <img
                          src={
                            item.imageUrl
                          }
                          alt={
                            displayName
                          }
                          className="h-full w-full object-contain p-1"
                        />
                      ) : (
                        <span className="text-2xl">
                          🖨️
                        </span>
                      )}
                    </div>

                    {/* PRODUCT DETAILS */}
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold">
                        {
                          displayName
                        }
                      </p>

                      <p
                        className="mt-1 text-sm"
                        style={{
                          color:
                            "var(--muted)",
                        }}
                      >
                        {
                          item.price
                        }{" "}
                        kr ×{" "}
                        {
                          item.quantity
                        }
                      </p>

                      <p className="mt-2 font-semibold">
                        {item.price *
                          item.quantity}{" "}
                        kr
                      </p>
                    </div>
                  </div>
                );
              }
            )}
          </div>

          {/* TOTALS */}
          <div
            className="mt-7 border-t pt-6"
            style={{
              borderColor:
                "var(--border)",
            }}
          >
            <div className="flex justify-between">
              <span
                style={{
                  color:
                    "var(--muted)",
                }}
              >
                {text.subtotal}
              </span>

              <span className="font-semibold">
                {
                  selectedTotal
                }{" "}
                kr
              </span>
            </div>

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
                {
                  selectedTotal
                }{" "}
                kr
              </span>
            </div>
          </div>

          {/* SECURE ORDER */}
          <div
            className="mt-6 rounded-xl p-4"
            style={{
              backgroundColor:
                "var(--surface-secondary)",
            }}
          >
            <p className="text-sm font-semibold">
              {
                text.secureOrder
              }
            </p>

            <p
              className="mt-1 text-xs leading-5"
              style={{
                color:
                  "var(--muted)",
              }}
            >
              {
                text.secureOrderDesc
              }
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        className="border-t px-6 py-10 text-center text-sm"
        style={{
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