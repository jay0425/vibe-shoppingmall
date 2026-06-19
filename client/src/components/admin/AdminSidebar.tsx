'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, PlusCircle, ClipboardList, Store } from '@/lib/lucide-react';

const nav = [
  { href: '/admin', label: '대시보드', icon: LayoutDashboard },
  { href: '/admin/products', label: '상품 관리', icon: Package },
  { href: '/admin/products/new', label: '상품 등록', icon: PlusCircle },
  { href: '/admin/orders', label: '주문 조회', icon: ClipboardList },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-60 shrink-0 border-r border-sidebar-border bg-sidebar md:flex md:flex-col">
      <div className="flex h-16 items-center border-b border-sidebar-border px-6">
        <Link href="/admin" className="font-heading text-xl tracking-tight text-sidebar-foreground">
          milkcocoa <span className="text-xs font-sans text-muted-foreground">admin</span>
        </Link>
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-3">
        {nav.map((item) => {
          const active =
            item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors ${
                active
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent'
              }`}
            >
              <Icon className="size-4.5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-sidebar-border p-3">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-muted-foreground hover:bg-sidebar-accent"
        >
          <Store className="size-4.5" />
          쇼핑몰로 이동
        </Link>
      </div>
    </aside>
  );
}
