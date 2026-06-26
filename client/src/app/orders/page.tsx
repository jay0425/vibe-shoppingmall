'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { ChevronLeft, ShoppingBag } from '@/lib/lucide-react';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { StatusBadge } from '@/components/StatusBadge';
import { getOrders, type Order, type OrderStatus } from '@/entities/order';
import { useAuthStore } from '@/entities/user';
import { formatPrice, type OrderStatus as DisplayOrderStatus } from '@/lib/data';

const statusLabels: Record<OrderStatus, DisplayOrderStatus> = {
  pending: '결제완료',
  paid: '결제완료',
  preparing: '배송준비',
  shipping: '배송중',
  delivered: '배송완료',
  cancelled: '취소',
};

const ORDER_REFRESH_INTERVAL_MS = 30_000;

function formatDate(value?: string) {
  if (!value) {
    return '-';
  }

  return new Intl.DateTimeFormat('ko-KR', {
    dateStyle: 'medium',
  }).format(new Date(value));
}

function itemOption(item: Order['items'][number]) {
  return [item.color, item.size].filter(Boolean).join(' / ') || '기본 옵션';
}

export default function OrdersPage() {
  const session = useAuthStore((state) => state.session);
  const hydrateAuth = useAuthStore((state) => state.hydrateAuth);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    hydrateAuth();
  }, [hydrateAuth]);

  useEffect(() => {
    if (!session) {
      setIsLoading(false);
      return;
    }

    const currentSession = session;
    let isMounted = true;

    async function loadOrders({ showLoading = false } = {}) {
      if (showLoading) {
        setIsLoading(true);
      }
      setErrorMessage('');

      try {
        const data = await getOrders(currentSession.accessToken);
        if (isMounted) {
          setOrders(data);
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(error instanceof Error ? error.message : '주문 내역을 불러오지 못했습니다.');
          setOrders([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadOrders({ showLoading: true });

    const refreshOrders = () => {
      if (document.visibilityState === 'visible') {
        void loadOrders();
      }
    };

    window.addEventListener('focus', refreshOrders);
    document.addEventListener('visibilitychange', refreshOrders);
    const refreshInterval = window.setInterval(refreshOrders, ORDER_REFRESH_INTERVAL_MS);

    return () => {
      isMounted = false;
      window.removeEventListener('focus', refreshOrders);
      document.removeEventListener('visibilitychange', refreshOrders);
      window.clearInterval(refreshInterval);
    };
  }, [session]);

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-10 md:px-6">
        <div className="mb-8">
          <Link
            href="/"
            className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="size-4" />
            쇼핑 계속하기
          </Link>
          <h1 className="font-heading text-3xl tracking-tight">내 주문 목록</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            총 {orders.length}건의 주문 내역이 있습니다.
          </p>
        </div>

        {!session ? (
          <div className="flex flex-col items-center gap-4 rounded-lg border border-border bg-card py-16 text-center">
            <ShoppingBag className="size-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">로그인 후 주문 내역을 확인할 수 있습니다.</p>
            <Link
              href="/login"
              className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground"
            >
              로그인하기
            </Link>
          </div>
        ) : isLoading ? (
          <div className="rounded-lg border border-border bg-card py-16 text-center text-sm text-muted-foreground">
            주문 내역을 불러오는 중입니다.
          </div>
        ) : errorMessage ? (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-5 py-10 text-center text-sm text-destructive">
            {errorMessage}
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center gap-4 rounded-lg border border-border bg-card py-16 text-center">
            <ShoppingBag className="size-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">아직 주문 내역이 없습니다.</p>
            <Link
              href="/"
              className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground"
            >
              쇼핑하러 가기
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {orders.map((order) => (
              <div key={order.id} className="overflow-hidden rounded-lg border border-border bg-card">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-muted/40 px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">{formatDate(order.createdAt)}</span>
                    <span className="text-xs text-muted-foreground">
                      주문번호 {order.orderNumber}
                    </span>
                  </div>
                  <StatusBadge status={statusLabels[order.status]} />
                </div>

                <div className="divide-y divide-border">
                  {order.items.map((item, index) => (
                    <div key={`${order.id}-${item.product}-${index}`} className="flex items-center gap-4 px-5 py-4">
                      <div className="relative size-16 shrink-0 overflow-hidden rounded-md bg-muted">
                        <Image
                          src={item.image || '/placeholder.svg'}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{item.name}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">{itemOption(item)}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">수량 {item.quantity}개</p>
                      </div>
                      <p className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-5 py-4">
                  <span className="text-sm text-muted-foreground">
                    {order.paymentMethod} · 총 결제금액
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="font-heading text-lg">{formatPrice(order.total)}</span>
                    <div className="flex gap-2">
                      <button className="rounded-md border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted">
                        주문 상세
                      </button>
                      {order.status === 'delivered' && (
                        <button className="rounded-md border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted">
                          리뷰 작성
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
