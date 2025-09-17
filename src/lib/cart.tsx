"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Product } from "./data/products";

export type CartItem = {
  id: string;
  productId: string;
  name: string;
  price: number; // cents
  image: string;
  qty: number;
};

type CartState = {
  items: CartItem[];
  addItem: (product: Product, qty?: number) => void;
  removeItem: (productId: string) => void;
  updateQty: (productId: string, qty: number) => void;
  clear: () => void;
  count: number;
  subtotal: number;
};

const CartContext = createContext<CartState | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // hydrate from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem("cart");
      if (raw) setItems(JSON.parse(raw));
    } catch {}
  }, []);

  // persist
  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(items));
    } catch {}
  }, [items]);

  const api = useMemo<CartState>(() => {
    const addItem = (product: Product, qty = 1) => {
      setItems((prev) => {
        const existing = prev.find((i) => i.productId === product.id);
        if (existing) {
          return prev.map((i) =>
            i.productId === product.id ? { ...i, qty: i.qty + qty } : i
          );
        }
        return [
          ...prev,
          {
            id: crypto.randomUUID(),
            productId: product.id,
            name: product.name,
            price: product.price,
            image: product.images[0],
            qty,
          },
        ];
      });
    };

    const removeItem = (productId: string) =>
      setItems((prev) => prev.filter((i) => i.productId !== productId));

    const updateQty = (productId: string, qty: number) =>
      setItems((prev) =>
        prev.map((i) => (i.productId === productId ? { ...i, qty } : i))
      );

    const clear = () => setItems([]);

    const count = items.reduce((n, i) => n + i.qty, 0);
    const subtotal = items.reduce((n, i) => n + i.price * i.qty, 0);

    return { items, addItem, removeItem, updateQty, clear, count, subtotal };
  }, [items]);

  return <CartContext.Provider value={api}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}