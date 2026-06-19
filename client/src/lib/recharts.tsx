import type { ReactNode } from 'react';

type ChartData = Record<string, string | number>;

export function ResponsiveContainer({
  children,
  height,
}: {
  width?: string | number;
  height?: number;
  children: ReactNode;
}) {
  return (
    <div className="w-full" style={{ height }}>
      {children}
    </div>
  );
}

export function AreaChart({
  data,
  children,
}: {
  data: ChartData[];
  margin?: Record<string, number>;
  children: ReactNode;
}) {
  const sales = data.map((item) => Number(item.sales ?? 0));
  const max = Math.max(...sales, 1);
  const points = sales
    .map((value, index) => {
      const x = data.length === 1 ? 0 : (index / (data.length - 1)) * 100;
      const y = 90 - (value / max) * 70;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="relative size-full">
      <svg className="size-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
        <polyline fill="none" points={points} stroke="oklch(0.6 0.08 30)" strokeWidth="2" />
        <polyline
          fill="none"
          opacity="0.18"
          points={`0,95 ${points} 100,95`}
          stroke="oklch(0.6 0.08 30)"
          strokeWidth="8"
        />
      </svg>
      <div className="absolute inset-x-0 bottom-0 flex justify-between text-xs text-muted-foreground">
        {data.map((item) => (
          <span key={String(item.day)}>{item.day}</span>
        ))}
      </div>
      <div className="sr-only">{children}</div>
    </div>
  );
}

type EmptyChartComponentProps = Record<string, unknown>;

export function Area(_props: EmptyChartComponentProps) {
  return null;
}

export function Tooltip(_props: EmptyChartComponentProps) {
  return null;
}

export function XAxis(_props: EmptyChartComponentProps) {
  return null;
}

export function YAxis(_props: EmptyChartComponentProps) {
  return null;
}
