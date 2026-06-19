'use client';

import { useState } from 'react';
import { Search, Eye } from '@/lib/lucide-react';
import { AdminTopbar } from '@/components/admin/AdminTopbar';
import { StatusBadge } from '@/components/StatusBadge';
import { OrderDetailModal } from '@/components/admin/OrderDetailModal';
import { orders as initialOrders, type Order, type OrderStatus, formatPrice } from '@/lib/data';

const filters: (OrderStatus | '전체')[] = [
  '전체',
  '결제완료',
  '배송준비',
  '배송중',
  '배송완료',
  '취소',
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [filter, setFilter] = useState<OrderStatus | '전체'>('전체');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Order | null>(null);

  const filtered = orders.filter((o) => {
    const matchStatus = filter === '전체' || o.status === filter;
    const matchQuery = query === '' || o.id.includes(query) || o.customer.includes(query);
    return matchStatus && matchQuery;
  });

  function handleStatusChange(id: string, status: OrderStatus) {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    setSelected((prev) => (prev && prev.id === id ? { ...prev, status } : prev));
  }

  return (
    <>
      <AdminTopbar title="주문 조회" subtitle={`총 ${orders.length}건의 주문`} />
      <div className="flex-1 space-y-5 p-5 md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
                  filter === f
                    ? 'bg-primary text-primary-foreground'
                    : 'border border-border bg-card hover:bg-muted'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="주문번호 / 주문자 검색"
              className="h-10 w-full rounded-md border border-input bg-card pl-9 pr-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
            />
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted-foreground">
                  <th className="px-5 py-3 font-medium">주문번호</th>
                  <th className="px-5 py-3 font-medium">주문자</th>
                  <th className="px-5 py-3 font-medium">상품</th>
                  <th className="px-5 py-3 font-medium">금액</th>
                  <th className="px-5 py-3 font-medium">상태</th>
                  <th className="px-5 py-3 font-medium">날짜</th>
                  <th className="px-5 py-3 text-right font-medium">상세</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((o) => (
                  <tr key={o.id} className="border-b border-border last:border-0">
                    <td className="px-5 py-3.5 font-medium">{o.id}</td>
                    <td className="px-5 py-3.5">{o.customer}</td>
                    <td className="px-5 py-3.5 text-muted-foreground">
                      {o.items[0].name}
                      {o.items.length > 1 && ` 외 ${o.items.length - 1}건`}
                    </td>
                    <td className="px-5 py-3.5 font-medium">{formatPrice(o.total)}</td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={o.status} />
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground">{o.date}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex justify-end">
                        <button
                          onClick={() => setSelected(o)}
                          className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted"
                        >
                          <Eye className="size-3.5" />
                          상세
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-5 py-12 text-center text-sm text-muted-foreground"
                    >
                      조건에 맞는 주문이 없습니다.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selected && (
        <OrderDetailModal
          order={selected}
          onClose={() => setSelected(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </>
  );
}
