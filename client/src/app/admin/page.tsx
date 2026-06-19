import Link from 'next/link';
import { TrendingUp, ShoppingBag, Package, Users, ArrowUpRight } from '@/lib/lucide-react';
import { AdminTopbar } from '@/components/admin/AdminTopbar';
import { SalesChart } from '@/components/admin/SalesChart';
import { StatusBadge } from '@/components/StatusBadge';
import { orders, products, formatPrice } from '@/lib/data';

const stats = [
  { label: '오늘 매출', value: '2,480,000원', delta: '+12.5%', icon: TrendingUp },
  { label: '신규 주문', value: '38건', delta: '+8.2%', icon: ShoppingBag },
  { label: '등록 상품', value: `${products.length}개`, delta: '+2', icon: Package },
  { label: '신규 회원', value: '124명', delta: '+5.4%', icon: Users },
];

export default function AdminDashboardPage() {
  return (
    <>
      <AdminTopbar title="대시보드" subtitle="오늘의 스토어 현황을 확인하세요" />
      <div className="flex-1 space-y-6 p-5 md:p-8">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="rounded-lg border border-border bg-card p-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{s.label}</span>
                  <Icon className="size-4 text-muted-foreground" />
                </div>
                <p className="mt-3 font-heading text-2xl tracking-tight">{s.value}</p>
                <p className="mt-1 flex items-center gap-1 text-xs text-chart-1">
                  <ArrowUpRight className="size-3" />
                  {s.delta} 전주 대비
                </p>
              </div>
            );
          })}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-lg border border-border bg-card p-5 lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-medium">주간 매출 추이</h2>
              <span className="text-xs text-muted-foreground">최근 7일</span>
            </div>
            <SalesChart />
          </div>

          <div className="rounded-lg border border-border bg-card p-5">
            <h2 className="mb-4 font-medium">인기 상품</h2>
            <div className="flex flex-col gap-4">
              {products.slice(0, 5).map((p, i) => (
                <div key={p.id} className="flex items-center gap-3">
                  <span className="w-4 text-sm font-medium text-muted-foreground">{i + 1}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm">{p.name}</p>
                    <p className="text-xs text-muted-foreground">재고 {p.stock}개</p>
                  </div>
                  <span className="text-sm font-medium">{formatPrice(p.price)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h2 className="font-medium">최근 주문</h2>
            <Link
              href="/admin/orders"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              전체 보기
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted-foreground">
                  <th className="px-5 py-3 font-medium">주문번호</th>
                  <th className="px-5 py-3 font-medium">주문자</th>
                  <th className="px-5 py-3 font-medium">금액</th>
                  <th className="px-5 py-3 font-medium">상태</th>
                  <th className="px-5 py-3 font-medium">날짜</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map((o) => (
                  <tr key={o.id} className="border-b border-border last:border-0">
                    <td className="px-5 py-3.5 font-medium">{o.id}</td>
                    <td className="px-5 py-3.5">{o.customer}</td>
                    <td className="px-5 py-3.5">{formatPrice(o.total)}</td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={o.status} />
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground">{o.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
