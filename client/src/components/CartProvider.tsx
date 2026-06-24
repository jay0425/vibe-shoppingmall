'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  addCartItem,
  clearCart,
  deleteCartItem,
  getCart,
  updateCartItem,
  type Cart,
  type CartProduct,
} from '@/entities/cart';
import { useAuthStore } from '@/entities/user';

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
  addItem: (item: Omit<CartItem, 'id'>) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  updateQty: (id: string, qty: number) => Promise<void>;
  clear: () => Promise<void>;
  count: number;
  subtotal: number;
  errorMessage: string;
  isLoading: boolean;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = 'wearjoy-cart';

const getProductId = (product: string | CartProduct) =>
  typeof product === 'string' ? product : (product.id ?? product._id ?? '');

const getProductValue = <Key extends keyof CartProduct>(
  product: string | CartProduct,
  key: Key,
  fallback: NonNullable<CartProduct[Key]>,
) => (typeof product === 'string' ? fallback : (product[key] ?? fallback));

const toCartItems = (cart: Cart): CartItem[] =>
  cart.items
    .map((item) => {
      const productId = getProductId(item.product);

      return {
        id: `${productId}:${item.color ?? ''}:${item.size ?? ''}`,
        productId,
        name: getProductValue(item.product, 'name', '상품'),
        image: getProductValue(item.product, 'image', '/placeholder.svg'),
        price: getProductValue(item.product, 'price', 0),
        color: item.color ?? '기본',
        size: item.size ?? 'FREE',
        qty: item.quantity,
      };
    })
    .filter((item) => item.productId);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const session = useAuthStore((state) => state.session);
  const hydrateAuth = useAuthStore((state) => state.hydrateAuth);
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    hydrateAuth();
  }, [hydrateAuth]);

  useEffect(() => {
    if (session) {
      setHydrated(true);
      return;
    }

    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
    setHydrated(true);
  }, [session]);

  useEffect(() => {
    if (!session) {
      return;
    }

    const currentSession = session;
    let isMounted = true;

    async function loadCart() {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const cart = await getCart(currentSession.user.id, currentSession.accessToken);
        if (isMounted) {
          setItems(toCartItems(cart));
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(error instanceof Error ? error.message : '장바구니를 불러오지 못했습니다.');
          setItems([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadCart();

    return () => {
      isMounted = false;
    };
  }, [session]);

  useEffect(() => {
    if (!hydrated || session) return;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, [items, hydrated, session]);

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((s, i) => s + i.qty, 0);
    const subtotal = items.reduce((s, i) => s + i.qty * i.price, 0);
    const setCartItems = (cart: Cart) => setItems(toCartItems(cart));

    return {
      items,
      count,
      subtotal,
      errorMessage,
      isLoading,
      addItem: async (item) => {
        setErrorMessage('');

        if (session) {
          try {
            const cart = await addCartItem(session.user.id, session.accessToken, {
              productId: item.productId,
              quantity: item.qty,
              color: item.color,
              size: item.size,
            });
            setCartItems(cart);
          } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : '장바구니에 상품을 담지 못했습니다.');
          }
          return;
        }

        setItems((prev) => {
          const existing = prev.find(
            (p) => p.productId === item.productId && p.color === item.color && p.size === item.size,
          );
          if (existing) {
            return prev.map((p) => (p.id === existing.id ? { ...p, qty: p.qty + item.qty } : p));
          }
          return [...prev, { ...item, id: crypto.randomUUID() }];
        });
      },
      removeItem: async (id) => {
        setErrorMessage('');
        const item = items.find((cartItem) => cartItem.id === id);

        if (session && item) {
          try {
            const cart = await deleteCartItem(session.user.id, item.productId, session.accessToken);
            setCartItems(cart);
          } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : '장바구니 상품을 삭제하지 못했습니다.');
          }
          return;
        }

        setItems((prev) => prev.filter((p) => p.id !== id));
      },
      updateQty: async (id, qty) => {
        setErrorMessage('');
        const nextQty = Math.max(1, qty);
        const item = items.find((cartItem) => cartItem.id === id);

        if (session && item) {
          try {
            const cart = await updateCartItem(
              session.user.id,
              item.productId,
              session.accessToken,
              nextQty,
            );
            setCartItems(cart);
          } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : '장바구니 수량을 변경하지 못했습니다.');
          }
          return;
        }

        setItems((prev) => prev.map((p) => (p.id === id ? { ...p, qty: nextQty } : p)));
      },
      clear: async () => {
        setErrorMessage('');

        if (session) {
          try {
            const cart = await clearCart(session.user.id, session.accessToken);
            setCartItems(cart);
          } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : '장바구니를 비우지 못했습니다.');
          }
          return;
        }

        setItems([]);
      },
    };
  }, [errorMessage, isLoading, items, session]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
