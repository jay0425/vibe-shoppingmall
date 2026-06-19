'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Minus, Plus, ShoppingBag, Trash2 } from '@/lib/lucide-react';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { useCart } from '@/components/CartProvider';
import { formatPrice } from '@/lib/data';

export default function CartPage() {
  const { items, removeItem, updateQty, subtotal, count } = useCart();
  const shipping = subtotal >= 50000 || subtotal === 0 ? 0 : 3000;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-10 md:px-6">
        <h1 className="font-heading text-3xl text-foreground">장바구니</h1>
        <p className="mt-1 text-sm text-muted-foreground">담긴 상품 {count}개</p>

        {items.length === 0 ? (
          <div className="mt-16 flex flex-col items-center gap-4 py-16 text-center">
            <ShoppingBag className="size-12 text-muted-foreground" />
            <p className="text-muted-foreground">장바구니가 비어 있습니다.</p>
            <Link
              href="/"
              className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground"
            >
              쇼핑 계속하기
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <ul className="divide-y divide-border border-y border-border">
                {items.map((item) => (
                  <li key={item.id} className="flex gap-4 py-5">
                    <Link
                      href={`/products/${item.productId}`}
                      className="relative size-24 shrink-0 overflow-hidden rounded-md bg-muted sm:size-28"
                    >
                      <Image
                        src={item.image || '/placeholder.svg'}
                        alt={item.name}
                        fill
                        sizes="120px"
                        className="object-cover"
                      />
                    </Link>
                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <Link
                            href={`/products/${item.productId}`}
                            className="text-sm font-medium text-foreground hover:underline"
                          >
                            {item.name}
                          </Link>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {item.color} / {item.size}
                          </p>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-muted-foreground hover:text-destructive"
                          aria-label="삭제"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                      <div className="mt-auto flex items-center justify-between pt-3">
                        <div className="inline-flex items-center rounded-md border border-border">
                          <button
                            onClick={() => updateQty(item.id, item.qty - 1)}
                            className="px-2.5 py-1.5 text-muted-foreground hover:text-foreground"
                            aria-label="수량 감소"
                          >
                            <Minus className="size-3.5" />
                          </button>
                          <span className="w-8 text-center text-sm text-foreground">
                            {item.qty}
                          </span>
                          <button
                            onClick={() => updateQty(item.id, item.qty + 1)}
                            className="px-2.5 py-1.5 text-muted-foreground hover:text-foreground"
                            aria-label="수량 증가"
                          >
                            <Plus className="size-3.5" />
                          </button>
                        </div>
                        <span className="text-sm font-semibold text-foreground">
                          {formatPrice(item.price * item.qty)}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <aside className="lg:col-span-1">
              <div className="sticky top-28 rounded-xl border border-border bg-card p-6">
                <h2 className="font-heading text-xl text-foreground">결제 정보</h2>
                <dl className="mt-5 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">상품 금액</dt>
                    <dd className="text-foreground">{formatPrice(subtotal)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">배송비</dt>
                    <dd className="text-foreground">
                      {shipping === 0 ? '무료' : formatPrice(shipping)}
                    </dd>
                  </div>
                  {shipping > 0 && (
                    <p className="text-xs text-accent-foreground">
                      {formatPrice(50000 - subtotal)} 추가 시 무료배송
                    </p>
                  )}
                  <div className="my-2 h-px bg-border" />
                  <div className="flex justify-between">
                    <dt className="text-base font-medium text-foreground">총 결제금액</dt>
                    <dd className="text-xl font-semibold text-foreground">{formatPrice(total)}</dd>
                  </div>
                </dl>
                <Link
                  href="/checkout"
                  className="mt-6 block rounded-full bg-primary py-3.5 text-center text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
                >
                  주문하기
                </Link>
                <Link
                  href="/"
                  className="mt-3 block rounded-full border border-border py-3 text-center text-sm text-foreground transition-colors hover:bg-secondary"
                >
                  쇼핑 계속하기
                </Link>
              </div>
            </aside>
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
