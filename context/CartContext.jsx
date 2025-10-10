import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    // Initialize from localStorage or default to empty array
    const savedCart = localStorage.getItem("cartItems");
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [status, setStatus] = useState("idle"); // "idle" | "loading" | "error"
  const [error, setError] = useState(null);

  useEffect(() => {
    // Update localStorage whenever items change
    localStorage.setItem("cartItems", JSON.stringify(items));
  }, [items]);

  const addToCart = (product) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product._id);
      if (existing) {
        return prev.map((i) =>
          i.id === product._id ? { ...i, qty: i.qty + 1 } : i
        );
      } else {
        return [...prev, { ...product, id: product._id, qty: 1 }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setItems((prev) => prev.filter((i) => i.id !== productId));
  };

  const clearCart = () => {
    setItems([]);
  };

  const updateQuantity = (productId, qty) => {
    setItems((prev) =>
      prev.map((i) =>
        i.id === productId ? { ...i, qty: Math.max(1, qty) } : i
      )
    );
  };

  return (
    <CartContext.Provider
      value={{ items, status, error, addToCart, removeFromCart, clearCart, updateQuantity }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
