'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { useCart } from '@/components/CartProvider';
import { formatPrice } from '@/lib/data';

const payMethods = ['신용카드', '카카오페이', '네이버페이', '토스페이', '무통장입금'];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clear } = useCart();
  const shipping = subtotal >= 50000 || subtotal === 0 ? 0 : 3000;
  const total = subtotal + shipping;
  const [pay, setPay] = useState(payMethods[0]);
  const [agree, setAgree] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!agree) return;
    const orderId = '20260617-' + Math.floor(1000 + Math.random() * 9000).toString();
    await clear();
    router.push(`/order-complete?id=${orderId}&total=${total}`);
  }

  const inputClass =
    'w-full rounded-md border border-border bg-background px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-ring';

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-10 md:px-6">
        <h1 className="font-heading text-3xl text-foreground">주문하기</h1>

        <form onSubmit={handleSubmit} className="mt-8 grid gap-8 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            {/* Shipping */}
            <section className="rounded-xl border border-border bg-card p-6">
              <h2 className="font-heading text-xl text-foreground">배송지 정보</h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <label className="mb-1.5 block text-sm text-foreground">받는 분</label>
                  <input required className={inputClass} placeholder="이름" />
                </div>
                <div className="sm:col-span-1">
                  <label className="mb-1.5 block text-sm text-foreground">연락처</label>
                  <input required className={inputClass} placeholder="010-0000-0000" />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-sm text-foreground">주소</label>
                  <input required className={`${inputClass} mb-2`} placeholder="기본 주소" />
                  <input className={inputClass} placeholder="상세 주소" />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-sm text-foreground">배송 요청사항</label>
                  <input className={inputClass} placeholder="예) 부재 시 문 앞에 놓아주세요" />
                </div>
              </div>
            </section>

            {/* Items */}
            <section className="rounded-xl border border-border bg-card p-6">
              <h2 className="font-heading text-xl text-foreground">주문 상품</h2>
              <ul className="mt-4 divide-y divide-border">
                {items.map((item) => (
                  <li key={item.id} className="flex gap-3 py-4">
                    <div className="relative size-16 shrink-0 overflow-hidden rounded-md bg-muted">
                      <Image
                        src={item.image || '/placeholder.svg'}
                        alt={item.name}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-1 items-center justify-between">
                      <div>
                        <p className="text-sm text-foreground">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.color} / {item.size} · {item.qty}개
                        </p>
                      </div>
                      <span className="text-sm font-medium text-foreground">
                        {formatPrice(item.price * item.qty)}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            {/* Payment */}
            <section className="rounded-xl border border-border bg-card p-6">
              <h2 className="font-heading text-xl text-foreground">결제 수단</h2>
              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {payMethods.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setPay(m)}
                    className={`rounded-md border py-3 text-sm transition-colors ${
                      pay === m
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border text-foreground hover:bg-secondary'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </section>
          </div>

          {/* Summary */}
          <aside className="lg:col-span-1">
            <div className="sticky top-28 rounded-xl border border-border bg-card p-6">
              <h2 className="font-heading text-xl text-foreground">결제 금액</h2>
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
                <div className="my-2 h-px bg-border" />
                <div className="flex justify-between">
                  <dt className="text-base font-medium text-foreground">총 결제금액</dt>
                  <dd className="text-xl font-semibold text-foreground">{formatPrice(total)}</dd>
                </div>
              </dl>

              <label className="mt-5 flex items-start gap-2 text-sm text-muted-foreground">
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                  className="mt-0.5 size-4 accent-primary"
                />
                주문 내용을 확인했으며 결제에 동의합니다.
              </label>

              <button
                type="submit"
                disabled={!agree || items.length === 0}
                className="mt-5 w-full rounded-full bg-primary py-3.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
              >
                {formatPrice(total)} 결제하기
              </button>
            </div>
          </aside>
        </form>
      </main>
      <SiteFooter />
    </div>
  );
}
