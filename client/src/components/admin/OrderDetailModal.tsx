'use client';

import Image from 'next/image';
import { X } from '@/lib/lucide-react';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/StatusBadge';
import { type Order, type OrderStatus, formatPrice } from '@/lib/data';

const statusOptions: OrderStatus[] = ['결제완료', '배송준비', '배송중', '배송완료', '취소'];

export function OrderDetailModal({
  order,
  onClose,
  onStatusChange,
  errorMessage,
}: {
  order: Order;
  onClose: () => void;
  onStatusChange: (id: string, status: OrderStatus) => void | Promise<void>;
  errorMessage?: string;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg bg-card shadow-xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="주문 상세"
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <h2 className="font-heading text-lg">주문 상세</h2>
            <p className="text-xs text-muted-foreground">주문번호 {order.id}</p>
          </div>
          <button
            onClick={onClose}
            aria-label="닫기"
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="space-y-6 px-6 py-5">
          <div className="flex items-center justify-between">
            <StatusBadge status={order.status} />
            <span className="text-sm text-muted-foreground">{order.date}</span>
          </div>

          <section>
            <h3 className="mb-3 text-sm font-medium text-muted-foreground">주문자 정보</h3>
            <dl className="grid grid-cols-3 gap-y-2 text-sm">
              <dt className="text-muted-foreground">이름</dt>
              <dd className="col-span-2">{order.customer}</dd>
              <dt className="text-muted-foreground">연락처</dt>
              <dd className="col-span-2">{order.phone}</dd>
              <dt className="text-muted-foreground">배송지</dt>
              <dd className="col-span-2">{order.address}</dd>
              <dt className="text-muted-foreground">결제수단</dt>
              <dd className="col-span-2">{order.payment}</dd>
            </dl>
          </section>

          <section>
            <h3 className="mb-3 text-sm font-medium text-muted-foreground">주문 상품</h3>
            <div className="divide-y divide-border rounded-md border border-border">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-3">
                  <div className="relative size-14 shrink-0 overflow-hidden rounded-md bg-muted">
                    <Image
                      src={item.image || '/placeholder.svg'}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.option} · {item.qty}개
                    </p>
                  </div>
                  <span className="text-sm font-medium">{formatPrice(item.price * item.qty)}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
              <span className="text-sm text-muted-foreground">총 결제금액</span>
              <span className="font-heading text-lg">{formatPrice(order.total)}</span>
            </div>
          </section>

          <section>
            <h3 className="mb-2 text-sm font-medium text-muted-foreground">배송 상태 변경</h3>
            <select
              value={order.status}
              onChange={(e) => onStatusChange(order.id, e.target.value as OrderStatus)}
              className="h-11 w-full rounded-md border border-input bg-card px-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
            >
              {statusOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            {errorMessage && <p className="mt-2 text-xs text-destructive">{errorMessage}</p>}
          </section>
        </div>

        <div className="flex gap-2 border-t border-border px-6 py-4">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            닫기
          </Button>
          <Button className="flex-1" onClick={onClose}>
            저장
          </Button>
        </div>
      </div>
    </div>
  );
}
