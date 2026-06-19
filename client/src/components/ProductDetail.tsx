'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Heart, Minus, Plus, ShoppingBag, Truck } from '@/lib/lucide-react';
import { useCart } from '@/components/CartProvider';
import { formatPrice, type Product } from '@/lib/data';

export function ProductDetail({ product }: { product: Product }) {
  const router = useRouter();
  const { addItem } = useCart();
  const [color, setColor] = useState(product.colors[0]);
  const [size, setSize] = useState(product.sizes[0]);
  const [qty, setQty] = useState(1);

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  function handleAdd(goCart: boolean) {
    addItem({
      productId: product.id,
      name: product.name,
      image: product.image,
      price: product.price,
      color,
      size,
      qty,
    });
    if (goCart) router.push('/cart');
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
      <nav className="mb-6 text-xs text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          홈
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid gap-10 md:grid-cols-2">
        <div className="space-y-3">
          <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-muted">
            <Image
              src={product.image || '/placeholder.svg'}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>

        <div>
          {product.badge && (
            <span className="mb-3 inline-block rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
              {product.badge}
            </span>
          )}
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            {product.englishName}
          </p>
          <h1 className="mt-1 font-heading text-3xl text-foreground">{product.name}</h1>
          <p className="mt-3 leading-relaxed text-muted-foreground">{product.description}</p>

          <div className="mt-5 flex items-end gap-3">
            <span className="text-2xl font-semibold text-foreground">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <>
                <span className="text-base text-muted-foreground line-through">
                  {formatPrice(product.originalPrice)}
                </span>
                <span className="text-base font-semibold text-destructive">{discount}%</span>
              </>
            )}
          </div>

          <div className="my-6 h-px bg-border" />

          {/* Color */}
          <div className="mb-5">
            <p className="mb-2 text-sm font-medium text-foreground">컬러</p>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                    color === c
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border text-foreground hover:bg-secondary'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Size */}
          <div className="mb-5">
            <p className="mb-2 text-sm font-medium text-foreground">사이즈</p>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`min-w-12 rounded-md border px-3 py-1.5 text-sm transition-colors ${
                    size === s
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border text-foreground hover:bg-secondary'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Qty */}
          <div className="mb-6">
            <p className="mb-2 text-sm font-medium text-foreground">수량</p>
            <div className="inline-flex items-center rounded-md border border-border">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="px-3 py-2 text-muted-foreground hover:text-foreground"
                aria-label="수량 감소"
              >
                <Minus className="size-4" />
              </button>
              <span className="w-10 text-center text-sm text-foreground">{qty}</span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="px-3 py-2 text-muted-foreground hover:text-foreground"
                aria-label="수량 증가"
              >
                <Plus className="size-4" />
              </button>
            </div>
          </div>

          <div className="mb-6 flex items-center justify-between rounded-lg bg-secondary/50 px-4 py-3">
            <span className="text-sm text-muted-foreground">총 상품 금액</span>
            <span className="text-xl font-semibold text-foreground">
              {formatPrice(product.price * qty)}
            </span>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => handleAdd(false)}
              className="flex flex-1 items-center justify-center gap-2 rounded-full border border-border py-3.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
            >
              <ShoppingBag className="size-4" /> 장바구니
            </button>
            <button
              onClick={() => handleAdd(true)}
              className="flex flex-1 items-center justify-center rounded-full bg-primary py-3.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              바로 구매
            </button>
            <button
              className="flex items-center justify-center rounded-full border border-border px-4 text-foreground transition-colors hover:bg-secondary"
              aria-label="위시리스트 추가"
            >
              <Heart className="size-5" />
            </button>
          </div>

          <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
            <Truck className="size-4" />
            5만원 이상 구매 시 무료배송 · 평균 1~3일 내 출고
          </div>
        </div>
      </div>

      {/* Detail */}
      <div className="mx-auto mt-16 max-w-3xl">
        <h2 className="mb-4 font-heading text-2xl text-foreground">상품 상세</h2>
        <p className="leading-loose text-muted-foreground">{product.detail}</p>
        <div className="mt-8 overflow-hidden rounded-xl">
          <div className="relative aspect-[4/3]">
            <Image
              src={product.image || '/placeholder.svg'}
              alt={`${product.name} 상세 컷`}
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
            />
          </div>
        </div>
        <dl className="mt-8 divide-y divide-border border-y border-border text-sm">
          {[
            ['소재', '코튼 혼방'],
            ['제조국', '대한민국'],
            ['세탁', '단독 손세탁 권장'],
            ['배송', 'CJ대한통운 · 1~3일 소요'],
          ].map(([k, v]) => (
            <div key={k} className="flex gap-4 py-3">
              <dt className="w-24 shrink-0 text-muted-foreground">{k}</dt>
              <dd className="text-foreground">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
