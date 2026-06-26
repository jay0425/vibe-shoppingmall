'use client';

import { useEffect, useState } from 'react';
import { Eye, Search } from '@/lib/lucide-react';
import { AdminTopbar } from '@/components/admin/AdminTopbar';
import { StatusBadge } from '@/components/StatusBadge';
import { OrderDetailModal } from '@/components/admin/OrderDetailModal';
import {
  getAdminOrders,
  updateAdminOrderStatus,
  type Order as ApiOrder,
  type OrderStatus as ApiOrderStatus,
} from '@/entities/order';
import { useAuthStore } from '@/entities/user';
import { type Order, type OrderStatus, formatPrice } from '@/lib/data';

const filters: (OrderStatus | '전체')[] = [
  '전체',
  '결제완료',
  '배송준비',
  '배송중',
  '배송완료',
  '취소',
];

const statusLabels: Record<ApiOrderStatus, OrderStatus> = {
  pending: '결제완료',
  paid: '결제완료',
  preparing: '배송준비',
  shipping: '배송중',
  delivered: '배송완료',
  cancelled: '취소',
};

const apiStatuses: Record<OrderStatus, ApiOrderStatus> = {
  결제완료: 'paid',
  배송준비: 'preparing',
  배송중: 'shipping',
  배송완료: 'delivered',
  취소: 'cancelled',
};

function formatDate(value?: string) {
  if (!value) {
    return '-';
  }

  return new Intl.DateTimeFormat('ko-KR', {
    dateStyle: 'medium',
  }).format(new Date(value));
}

function itemOption(item: ApiOrder['items'][number]) {
  return [item.color, item.size].filter(Boolean).join(' / ') || '기본 옵션';
}

function toDisplayOrder(order: ApiOrder): Order {
  const shippingAddress = order.shippingAddress;
  const address = [shippingAddress.address1, shippingAddress.address2].filter(Boolean).join(' ');

  return {
    id: order.orderNumber,
    date: formatDate(order.createdAt),
    customer: shippingAddress.recipient,
    phone: shippingAddress.phone,
    address,
    status: statusLabels[order.status],
    items: order.items.map((item) => ({
      name: item.name,
      option: itemOption(item),
      qty: item.quantity,
      price: item.price,
      image: item.image,
    })),
    total: order.total,
    payment: order.paymentMethod,
  };
}

export default function AdminOrdersPage() {
  const session = useAuthStore((state) => state.session);
  const hydrateAuth = useAuthStore((state) => state.hydrateAuth);
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<OrderStatus | '전체'>('전체');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [statusErrorMessage, setStatusErrorMessage] = useState('');
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    hydrateAuth();
  }, [hydrateAuth]);

  useEffect(() => {
    if (!session) {
      setIsLoading(false);
      setErrorMessage('관리자 로그인 후 주문을 조회할 수 있습니다.');
      return;
    }

    if (session.user.user_type !== 'admin') {
      setIsLoading(false);
      setErrorMessage('관리자만 주문을 조회할 수 있습니다.');
      return;
    }

    const currentSession = session;
    let isMounted = true;

    async function loadOrders() {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const data = await getAdminOrders(currentSession.accessToken, { page: 1, limit: 100 });

        if (isMounted) {
          setOrders(data.orders.map(toDisplayOrder));
          setTotalCount(data.pagination.totalCount);
        }
      } catch (error) {
        if (isMounted) {
          setOrders([]);
          setTotalCount(0);
          setErrorMessage(error instanceof Error ? error.message : '주문 목록을 불러오지 못했습니다.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadOrders();

    return () => {
      isMounted = false;
    };
  }, [session]);

  const filtered = orders.filter((o) => {
    const matchStatus = filter === '전체' || o.status === filter;
    const normalizedQuery = query.trim();
    const matchQuery =
      normalizedQuery === '' ||
      o.id.includes(normalizedQuery) ||
      o.customer.includes(normalizedQuery) ||
      o.phone.includes(normalizedQuery);
    return matchStatus && matchQuery;
  });

  async function handleStatusChange(id: string, status: OrderStatus) {
    if (!session) {
      setStatusErrorMessage('관리자 로그인 후 주문 상태를 변경할 수 있습니다.');
      return;
    }

    const previousOrder = orders.find((order) => order.id === id);

    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    setSelected((prev) => (prev && prev.id === id ? { ...prev, status } : prev));
    setStatusErrorMessage('');

    try {
      const updatedOrder = await updateAdminOrderStatus(session.accessToken, id, {
        status: apiStatuses[status],
      });
      const updatedDisplayOrder = toDisplayOrder(updatedOrder);

      setOrders((prev) => prev.map((o) => (o.id === id ? updatedDisplayOrder : o)));
      setSelected((prev) => (prev && prev.id === id ? updatedDisplayOrder : prev));
    } catch (error) {
      if (previousOrder) {
        setOrders((prev) => prev.map((o) => (o.id === id ? previousOrder : o)));
        setSelected((prev) => (prev && prev.id === id ? previousOrder : prev));
      }

      setStatusErrorMessage(
        error instanceof Error ? error.message : '주문 상태를 변경하지 못했습니다.',
      );
    }
  }

  return (
    <>
      <AdminTopbar title="주문 조회" subtitle={`총 ${totalCount}건의 주문`} />
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
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-5 py-12 text-center text-sm text-muted-foreground"
                    >
                      주문 목록을 불러오는 중입니다.
                    </td>
                  </tr>
                ) : errorMessage ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-12 text-center text-sm text-destructive">
                      {errorMessage}
                    </td>
                  </tr>
                ) : filtered.length > 0 ? (
                  filtered.map((o) => (
                    <tr key={o.id} className="border-b border-border last:border-0">
                      <td className="px-5 py-3.5 font-medium">{o.id}</td>
                      <td className="px-5 py-3.5">{o.customer}</td>
                      <td className="px-5 py-3.5 text-muted-foreground">
                        {o.items[0]?.name ?? '-'}
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
                  ))
                ) : (
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
          errorMessage={statusErrorMessage}
        />
      )}
    </>
  );
}
