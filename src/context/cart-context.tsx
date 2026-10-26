"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CartItem } from "@/lib/types";

const STORAGE_KEY = "engineer-step-cart";

export type CartKey = { productId: string; size: string; color?: string };

const same = (a: CartKey, b: CartKey) =>
  a.productId === b.productId && a.size === b.size && (a.color ?? "") === (b.color ?? "");

interface CartContextValue {
  items: CartItem[];
  hydrated: boolean;
  itemCount: number;
  subtotal: number;
  addItem: (item: CartItem) => void;
  setQuantity: (key: CartKey, quantity: number) => void;
  removeItem: (key: CartKey) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

function load(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? (parsed as CartItem[]) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(load());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* التخزين غير متاح */
    }
  }, [items, hydrated]);

  const addItem = useCallback((item: CartItem) => {
    setItems((prev) =>
      prev.some((i) => same(i, item))
        ? prev.map((i) => (same(i, item) ? { ...i, quantity: i.quantity + item.quantity } : i))
        : [...prev, item],
    );
  }, []);

  const setQuantity = useCallback((key: CartKey, quantity: number) => {
    setItems((prev) =>
      quantity <= 0
        ? prev.filter((i) => !same(i, key))
        : prev.map((i) => (same(i, key) ? { ...i, quantity } : i)),
    );
  }, []);

  const removeItem = useCallback((key: CartKey) => {
    setItems((prev) => prev.filter((i) => !same(i, key)));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      hydrated,
      itemCount: items.reduce((s, i) => s + i.quantity, 0),
      subtotal: items.reduce((s, i) => s + i.price * i.quantity, 0),
      addItem,
      setQuantity,
      removeItem,
      clearCart,
    }),
    [items, hydrated, addItem, setQuantity, removeItem, clearCart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
