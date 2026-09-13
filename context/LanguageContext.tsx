"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

type Language = "en" | "sv";

type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
};

const translations: Record<
  Language,
  Record<string, string>
> = {
  en: {
    // Navbar
    home: "Home",
    shop: "Shop",
    categories: "Categories",
    customPrint: "Custom Print",
    about: "About",
    cart: "Cart",
    search: "Search",
    searchProducts: "Search products...",
    shoppingCart: "Shopping Cart",

    // Home
    heroTitle: "Bring Your Ideas to Life",
    heroDescription:
      "High-quality 3D printed products and custom creations made for you.",
    shopNow: "Shop Now",
    startCustomPrint: "Start Custom Print",
    exploreProducts: "Explore Products",
    featuredProducts: "Featured Products",
    viewAllProducts: "View All Products",
    whyChooseUs: "Why Choose Us",

    // Products
    products: "Products",
    allProducts: "All Products",
    loadingProducts: "Loading products...",
    noProducts: "No products found",
    tryAnotherSearch:
      "Try another product name or category.",
    searchHint:
      "Search by product name, category or description",

    // Categories
    all: "All",
    homeDecor: "Home Decor",
    keychains: "Keychains",
    miniatures: "Miniatures",
    deskAccessories: "Desk Accessories",
    gaming: "Gaming",
    gifts: "Gifts",
    anime: "Anime",
    customPrints: "Custom Prints",

    // Product detail
    productDetails: "Product Details",
    description: "Description",
    price: "Price",
    material: "Material",
    colors: "Colors",
    dimensions: "Dimensions",
    printTime: "Print Time",
    rating: "Rating",
    addToCart: "Add to Cart",
    addedToCart: "Added to Cart",
    backToShop: "Back to Shop",

    // Cart
    yourCart: "Your Cart",
    emptyCart: "Your cart is empty",
    continueShopping: "Continue Shopping",
    quantity: "Quantity",
    remove: "Remove",
    selectAll: "Select All",
    subtotal: "Subtotal",
    total: "Total",
    proceedCheckout: "Proceed to Checkout",

    // Checkout
    checkout: "Checkout",
    orderSummary: "Order Summary",
    customerInformation: "Customer Information",
    customerName: "Customer Name",
    fullName: "Full Name",
    email: "Email",
    phone: "Phone",
    address: "Address",
    city: "City",
    state: "State",
    postalCode: "Postal Code",
    country: "Country",
    placeOrder: "Place Order",
    placingOrder: "Placing Order...",
    orderSuccess: "Order Placed Successfully",
    thankYou: "Thank you for your order.",
    orderId: "Order ID",

    // Custom Print
    customPrintTitle: "Custom 3D Print",
    customPrintDescription:
      "Upload your 3D model and tell us how you want it printed.",
    customerDetails: "Customer Details",
    uploadModel: "Upload 3D Model",
    referenceImages: "Reference Images",
    uploadReference: "Upload Reference Images",
    chooseMaterial: "Choose Material",
    chooseColor: "Choose Color",
    customColor: "Custom Color",
    printQuality: "Print Quality",
    standard: "Standard",
    high: "High",
    premium: "Premium",
    additionalNotes: "Additional Notes",
    submitQuote: "Submit Quote",
    submitting: "Submitting...",
    quoteSuccess: "Quote submitted successfully",
    modelFiles: "3D Model Files",

    // About
    aboutUs: "About Us",
    aboutTitle: "About RD nordform AB",
    aboutDescription:
      "We transform ideas into high-quality 3D printed products.",
    ourMission: "Our Mission",
    ourVision: "Our Vision",

    // Common
    loading: "Loading...",
    error: "Something went wrong",
    retry: "Try Again",
    close: "Close",
    cancel: "Cancel",
    save: "Save",
    viewDetails: "View Details",

    // Footer
    copyright:
      "© 2026 RD nordform AB. All rights reserved.",
  },

  sv: {
    // Navbar
    home: "Hem",
    shop: "Butik",
    categories: "Kategorier",
    customPrint: "Specialutskrift",
    about: "Om oss",
    cart: "Varukorg",
    search: "Sök",
    searchProducts: "Sök produkter...",
    shoppingCart: "Varukorg",

    // Home
    heroTitle: "Förverkliga dina idéer",
    heroDescription:
      "Högkvalitativa 3D-printade produkter och skräddarsydda skapelser gjorda för dig.",
    shopNow: "Handla nu",
    startCustomPrint: "Starta specialutskrift",
    exploreProducts: "Utforska produkter",
    featuredProducts: "Utvalda produkter",
    viewAllProducts: "Visa alla produkter",
    whyChooseUs: "Varför välja oss",

    // Products
    products: "Produkter",
    allProducts: "Alla produkter",
    loadingProducts: "Laddar produkter...",
    noProducts: "Inga produkter hittades",
    tryAnotherSearch:
      "Prova ett annat produktnamn eller en annan kategori.",
    searchHint:
      "Sök efter produktnamn, kategori eller beskrivning",

    // Categories
    all: "Alla",
    homeDecor: "Heminredning",
    keychains: "Nyckelringar",
    miniatures: "Miniatyrer",
    deskAccessories: "Skrivbordstillbehör",
    gaming: "Gaming",
    gifts: "Presenter",
    anime: "Anime",
    customPrints: "Specialutskrifter",

    // Product detail
    productDetails: "Produktinformation",
    description: "Beskrivning",
    price: "Pris",
    material: "Material",
    colors: "Färger",
    dimensions: "Dimensioner",
    printTime: "Utskriftstid",
    rating: "Betyg",
    addToCart: "Lägg i varukorgen",
    addedToCart: "Tillagd i varukorgen",
    backToShop: "Tillbaka till butiken",

    // Cart
    yourCart: "Din varukorg",
    emptyCart: "Din varukorg är tom",
    continueShopping: "Fortsätt handla",
    quantity: "Antal",
    remove: "Ta bort",
    selectAll: "Välj alla",
    subtotal: "Delsumma",
    total: "Totalt",
    proceedCheckout: "Gå till kassan",

    // Checkout
    checkout: "Kassa",
    orderSummary: "Ordersammanfattning",
    customerInformation: "Kundinformation",
    customerName: "Kundnamn",
    fullName: "Fullständigt namn",
    email: "E-post",
    phone: "Telefon",
    address: "Adress",
    city: "Stad",
    state: "Region",
    postalCode: "Postnummer",
    country: "Land",
    placeOrder: "Lägg beställning",
    placingOrder: "Beställningen skickas...",
    orderSuccess: "Beställningen har lagts",
    thankYou: "Tack för din beställning.",
    orderId: "Ordernummer",

    // Custom Print
    customPrintTitle: "Anpassad 3D-utskrift",
    customPrintDescription:
      "Ladda upp din 3D-modell och berätta hur du vill att den ska skrivas ut.",
    customerDetails: "Kunduppgifter",
    uploadModel: "Ladda upp 3D-modell",
    referenceImages: "Referensbilder",
    uploadReference: "Ladda upp referensbilder",
    chooseMaterial: "Välj material",
    chooseColor: "Välj färg",
    customColor: "Anpassad färg",
    printQuality: "Utskriftskvalitet",
    standard: "Standard",
    high: "Hög",
    premium: "Premium",
    additionalNotes: "Ytterligare information",
    submitQuote: "Skicka offertförfrågan",
    submitting: "Skickar...",
    quoteSuccess: "Offertförfrågan har skickats",
    modelFiles: "3D-modellfiler",

    // About
    aboutUs: "Om oss",
    aboutTitle: "Om RD nordform AB",
    aboutDescription:
      "Vi förvandlar idéer till högkvalitativa 3D-printade produkter.",
    ourMission: "Vårt uppdrag",
    ourVision: "Vår vision",

    // Common
    loading: "Laddar...",
    error: "Något gick fel",
    retry: "Försök igen",
    close: "Stäng",
    cancel: "Avbryt",
    save: "Spara",
    viewDetails: "Visa detaljer",

    // Footer
    copyright:
      "© 2026 RD nordform AB. Alla rättigheter förbehållna.",
  },
};

const LanguageContext =
  createContext<LanguageContextType | undefined>(
    undefined
  );

export function LanguageProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [language, setLanguageState] =
    useState<Language>("en");

  useEffect(() => {
    const saved =
      localStorage.getItem(
        "rdnordform-language"
      );

    if (saved === "en" || saved === "sv") {
      setLanguageState(saved);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang =
      language;
  }, [language]);

  const setLanguage = (
    newLanguage: Language
  ) => {
    setLanguageState(newLanguage);

    localStorage.setItem(
      "rdnordform-language",
      newLanguage
    );

    document.documentElement.lang =
      newLanguage;
  };

  const toggleLanguage = () => {
    setLanguage(
      language === "en" ? "sv" : "en"
    );
  };

  const t = (key: string) => {
    return (
      translations[language][key] ||
      translations.en[key] ||
      key
    );
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context =
    useContext(LanguageContext);

  if (!context) {
    throw new Error(
      "useLanguage must be used inside LanguageProvider"
    );
  }

  return context;
}
