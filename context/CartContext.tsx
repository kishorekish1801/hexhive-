
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import { Product } from "@/data/products";

type CartItem = Product & {
  quantity: number;
};

type CartContextType = {
  cart: CartItem[];

  addToCart: (product: Product) => void;
  removeFromCart: (slug: string) => void;
  updateQuantity: (slug: string, quantity: number) => void;
  clearCart: () => void;

  selectedItems: string[];
  setSelectedItems: (slugs: string[]) => void;

  cartCount: number;
  cartTotal: number;
};

const CartContext = createContext<CartContextType | undefined>(
  undefined
);

export function CartProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedItems, setSelectedItemsState] = useState<string[]>(
    []
  );

  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from localStorage
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("hexhive-cart");

      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);

        if (Array.isArray(parsedCart)) {
          setCart(parsedCart);

          // Select all products when loading the cart
          setSelectedItemsState(
            parsedCart.map((item: CartItem) => item.slug)
          );
        }
      }
    } catch (error) {
      console.error("Failed to load cart:", error);

      localStorage.removeItem("hexhive-cart");
    }

    setIsLoaded(true);
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    if (!isLoaded) return;

    localStorage.setItem(
      "hexhive-cart",
      JSON.stringify(cart)
    );
  }, [cart, isLoaded]);

  // Add product
  const addToCart = (product: Product) => {
    setCart((currentCart) => {
      const existingItem = currentCart.find(
        (item) => item.slug === product.slug
      );

      if (existingItem) {
        return currentCart.map((item) =>
          item.slug === product.slug
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        );
      }

      return [
        ...currentCart,
        {
          ...product,
          quantity: 1,
        },
      ];
    });

    // Automatically select the product when added
    setSelectedItemsState((current) => {
      if (current.includes(product.slug)) {
        return current;
      }

      return [...current, product.slug];
    });
  };

  // Remove product
  const removeFromCart = (slug: string) => {
    setCart((currentCart) =>
      currentCart.filter(
        (item) => item.slug !== slug
      )
    );

    // Remove it from selected products too
    setSelectedItemsState((current) =>
      current.filter(
        (item) => item !== slug
      )
    );
  };

  // Update quantity
  const updateQuantity = (
    slug: string,
    quantity: number
  ) => {
    if (quantity <= 0) {
      removeFromCart(slug);
      return;
    }

    setCart((currentCart) =>
      currentCart.map((item) =>
        item.slug === slug
          ? {
              ...item,
              quantity,
            }
          : item
      )
    );
  };

  // Clear entire cart
  const clearCart = () => {
    setCart([]);
    setSelectedItemsState([]);
  };

  // Set selected products
  const setSelectedItems = (slugs: string[]) => {
    setSelectedItemsState(slugs);
  };

  // Total number of products
  const cartCount = cart.reduce(
    (total, item) =>
      total + item.quantity,
    0
  );

  // Total price of entire cart
  const cartTotal = cart.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,

        selectedItems,
        setSelectedItems,

        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return context;
}

