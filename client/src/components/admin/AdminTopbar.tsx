import { Bell } from '@/lib/lucide-react';

export function AdminTopbar({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-background px-5 md:px-8">
      <div>
        <h1 className="font-heading text-xl tracking-tight">{title}</h1>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-4">
        <button aria-label="알림" className="relative text-muted-foreground hover:text-foreground">
          <Bell className="size-5" />
          <span className="absolute -right-1 -top-1 size-2 rounded-full bg-accent" />
        </button>
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
            관리
          </div>
          <span className="hidden text-sm sm:block">관리자</span>
        </div>
      </div>
    </header>
  );
}
