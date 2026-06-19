import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft } from '@/lib/lucide-react';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { StatusBadge } from '@/components/StatusBadge';
import { myOrders, formatPrice } from '@/lib/data';

export default function OrdersPage() {
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
            총 {myOrders.length}건의 주문 내역이 있습니다.
          </p>
        </div>

        <div className="flex flex-col gap-5">
          {myOrders.map((order) => (
            <div key={order.id} className="overflow-hidden rounded-lg border border-border bg-card">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-muted/40 px-5 py-3.5">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium">{order.date}</span>
                  <span className="text-xs text-muted-foreground">주문번호 {order.id}</span>
                </div>
                <StatusBadge status={order.status} />
              </div>

              <div className="divide-y divide-border">
                {order.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-4 px-5 py-4">
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
                      <p className="mt-0.5 text-xs text-muted-foreground">{item.option}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">수량 {item.qty}개</p>
                    </div>
                    <p className="text-sm font-medium">{formatPrice(item.price * item.qty)}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-5 py-4">
                <span className="text-sm text-muted-foreground">{order.payment} · 총 결제금액</span>
                <div className="flex items-center gap-3">
                  <span className="font-heading text-lg">{formatPrice(order.total)}</span>
                  <div className="flex gap-2">
                    <button className="rounded-md border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted">
                      주문 상세
                    </button>
                    {order.status === '배송완료' && (
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
      </main>
      <SiteFooter />
    </div>
  );
}
