import type { OrderStatus } from '@/lib/data';

const styles: Record<OrderStatus, string> = {
  결제완료: 'bg-secondary text-secondary-foreground',
  배송준비: 'bg-chart-2/20 text-chart-5',
  배송중: 'bg-accent text-accent-foreground',
  배송완료: 'bg-primary text-primary-foreground',
  취소: 'bg-destructive/10 text-destructive',
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${styles[status]}`}
    >
      {status}
    </span>
  );
}
