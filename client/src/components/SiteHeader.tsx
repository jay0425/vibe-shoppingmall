'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Heart, Menu, Search, ShoppingBag, User, X } from '@/lib/lucide-react';
import { useCart } from '@/components/CartProvider';
import { categories } from '@/lib/data';
import { getMe, useAuthStore } from '@/entities/user';
import { useLogout } from '@/features/logout';

export function SiteHeader() {
  const { count } = useCart();
  const [open, setOpen] = useState(false);
  const session = useAuthStore((state) => state.session);
  const hydrateAuth = useAuthStore((state) => state.hydrateAuth);
  const logout = useLogout();
  const { data: me } = useQuery({
    queryKey: ['me', session?.accessToken],
    queryFn: () => getMe(session?.accessToken ?? ''),
    enabled: Boolean(session?.accessToken),
  });
  const displayName = me?.name ?? session?.user.name;

  useEffect(() => {
    hydrateAuth();
  }, [hydrateAuth]);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="bg-primary py-2 text-center text-xs tracking-wide text-primary-foreground">
        지금 가입하면 첫 구매 10% 할인 · 5만원 이상 무료배송
      </div>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 md:px-6">
        <button className="md:hidden" onClick={() => setOpen((v) => !v)} aria-label="메뉴 열기">
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>

        <Link href="/" className="flex items-baseline gap-1">
          <span className="font-heading text-2xl tracking-tight text-foreground">
            wear<span className="text-accent-foreground">joy</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={c.slug === 'all' ? '/' : `/?category=${c.slug}`}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {c.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3 text-foreground">
          {session ? (
            <>
              {displayName && (
                <span className="hidden max-w-40 truncate text-sm text-muted-foreground lg:block">
                  {displayName}님 반갑습니다.
                </span>
              )}
              <button
                type="button"
                onClick={logout}
                className="hidden text-sm text-muted-foreground transition-colors hover:text-foreground sm:block"
              >
                로그아웃
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="hidden text-sm text-muted-foreground transition-colors hover:text-foreground sm:block"
            >
              로그인
            </Link>
          )}
          <button aria-label="검색" className="hover:text-accent-foreground">
            <Search className="size-5" />
          </button>
          <Link href="/orders" aria-label="내 주문" className="hover:text-accent-foreground">
            <User className="size-5" />
          </Link>
          <button aria-label="위시리스트" className="hidden hover:text-accent-foreground sm:block">
            <Heart className="size-5" />
          </button>
          <Link
            href="/cart"
            aria-label="장바구니"
            className="relative hover:text-accent-foreground"
          >
            <ShoppingBag className="size-5" />
            {count > 0 && (
              <span className="absolute -right-2 -top-2 flex size-4 items-center justify-center rounded-full bg-accent text-[10px] font-semibold text-accent-foreground">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>

      {open && (
        <nav className="border-t border-border bg-background px-4 py-3 md:hidden">
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={c.slug === 'all' ? '/' : `/?category=${c.slug}`}
              onClick={() => setOpen(false)}
              className="block py-2 text-sm text-foreground"
            >
              {c.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
