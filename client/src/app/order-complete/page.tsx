import Link from 'next/link';
import { CheckCircle2, Package, Truck } from '@/lib/lucide-react';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { formatPrice } from '@/lib/data';

export default async function OrderCompletePage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string; total?: string }>;
}) {
  const { id = '20260617-0000', total = '0' } = await searchParams;
  const totalNum = Number(total) || 0;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-2xl px-4 py-16 text-center md:px-6">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-accent">
          <CheckCircle2 className="size-9 text-accent-foreground" />
        </div>
        <h1 className="mt-6 font-heading text-3xl text-foreground">주문이 완료되었습니다</h1>
        <p className="mt-3 leading-relaxed text-muted-foreground">
          소중한 주문 감사합니다. 빠르고 안전하게 배송해 드릴게요.
        </p>

        <div className="mt-8 rounded-xl border border-border bg-card p-6 text-left">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <span className="text-sm text-muted-foreground">주문번호</span>
            <span className="font-mono text-sm font-medium text-foreground">{id}</span>
          </div>
          <div className="flex items-center justify-between pt-4">
            <span className="text-sm text-muted-foreground">총 결제금액</span>
            <span className="text-xl font-semibold text-foreground">{formatPrice(totalNum)}</span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-2 text-sm">
          {[
            { icon: CheckCircle2, label: '결제완료', active: true },
            { icon: Package, label: '배송준비', active: false },
            { icon: Truck, label: '배송시작', active: false },
          ].map((s) => (
            <div
              key={s.label}
              className={`flex flex-col items-center gap-2 rounded-lg border p-4 ${
                s.active
                  ? 'border-primary bg-secondary/50 text-foreground'
                  : 'border-border text-muted-foreground'
              }`}
            >
              <s.icon className="size-5" />
              {s.label}
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/orders"
            className="rounded-full bg-primary px-8 py-3.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            주문 내역 보기
          </Link>
          <Link
            href="/"
            className="rounded-full border border-border px-8 py-3.5 text-sm text-foreground transition-colors hover:bg-secondary"
          >
            쇼핑 계속하기
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
