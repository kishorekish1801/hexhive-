"use client";

import { useState } from "react";
import { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";

type AddToCartButtonProps = {
  product: Product;
};

export default function AddToCartButton({
  product,
}: AddToCartButtonProps) {
  const { addToCart } = useCart();
  const { language } = useLanguage();

  const [added, setAdded] = useState(false);

  const isSwedish = language === "sv";

  const handleAddToCart = () => {
    addToCart(product);

    setAdded(true);

    setTimeout(() => {
      setAdded(false);
    }, 1200);
  };

  return (
    <button
      type="button"
      onClick={handleAddToCart}
      className="w-full rounded-xl px-6 py-4 text-base font-semibold transition-all duration-200 hover:scale-[1.01] hover:opacity-80"
      style={{
        backgroundColor: added
          ? "#16a34a"
          : "var(--foreground)",
        color: "var(--background)",
      }}
    >
      {added
        ? isSwedish
          ? "✓ Tillagd i kundvagnen"
          : "✓ Added to Cart"
        : isSwedish
          ? "Lägg i kundvagnen"
          : "Add to Cart"}
    </button>
  );
}
