'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type CartItem = {
  id: string;
  productId: string;
  name: string;
  image: string;
  price: number;
  color: string;
  size: string;
  qty: number;
};

type CartContextValue = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clear: () => void;
  count: number;
  subtotal: number;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = 'wearjoy-cart';

const seedItems: CartItem[] = [
  {
    id: 'seed-1',
    productId: 'p1',
    name: '코튼 러플 블라우스',
    image: '/products/blouse-cream.png',
    price: 39000,
    color: '크림',
    size: 'M',
    qty: 1,
  },
  {
    id: 'seed-2',
    productId: 'p4',
    name: '플리츠 미디 스커트',
    image: '/products/skirt-beige.png',
    price: 42000,
    color: '베이지',
    size: 'M',
    qty: 2,
  },
];

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(seedItems);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, [items, hydrated]);

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((s, i) => s + i.qty, 0);
    const subtotal = items.reduce((s, i) => s + i.qty * i.price, 0);
    return {
      items,
      count,
      subtotal,
      addItem: (item) =>
        setItems((prev) => {
          const existing = prev.find(
            (p) => p.productId === item.productId && p.color === item.color && p.size === item.size,
          );
          if (existing) {
            return prev.map((p) => (p.id === existing.id ? { ...p, qty: p.qty + item.qty } : p));
          }
          return [...prev, { ...item, id: crypto.randomUUID() }];
        }),
      removeItem: (id) => setItems((prev) => prev.filter((p) => p.id !== id)),
      updateQty: (id, qty) =>
        setItems((prev) => prev.map((p) => (p.id === id ? { ...p, qty: Math.max(1, qty) } : p))),
      clear: () => setItems([]),
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
