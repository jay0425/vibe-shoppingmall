'use client';

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from '@/lib/recharts';

const data = [
  { day: '월', sales: 1240000 },
  { day: '화', sales: 980000 },
  { day: '수', sales: 1560000 },
  { day: '목', sales: 1320000 },
  { day: '금', sales: 2010000 },
  { day: '토', sales: 2480000 },
  { day: '일', sales: 1890000 },
];

export function SalesChart() {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="salesFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.78 0.06 30)" stopOpacity={0.35} />
            <stop offset="100%" stopColor="oklch(0.78 0.06 30)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="day"
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 12, fill: 'oklch(0.52 0.015 55)' }}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          width={48}
          tick={{ fontSize: 11, fill: 'oklch(0.52 0.015 55)' }}
          tickFormatter={(v: number) => `${v / 10000}만`}
        />
        <Tooltip
          cursor={{ stroke: 'oklch(0.9 0.01 70)' }}
          contentStyle={{
            borderRadius: 8,
            border: '1px solid oklch(0.9 0.01 70)',
            fontSize: 12,
          }}
          formatter={(value: number) => [`${value.toLocaleString('ko-KR')}원`, '매출']}
        />
        <Area
          type="monotone"
          dataKey="sales"
          stroke="oklch(0.6 0.08 30)"
          strokeWidth={2}
          fill="url(#salesFill)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
