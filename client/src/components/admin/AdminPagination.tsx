import Link from 'next/link';
import { ChevronLeft, ChevronRight } from '@/lib/lucide-react';
import { cn } from '@/lib/utils';

type AdminPaginationProps = {
  currentPage: number;
  totalPages: number;
  basePath: string;
};

const pageLinkClass =
  'inline-flex size-9 items-center justify-center rounded-md border border-border text-sm font-medium transition-colors hover:bg-muted';

function getPageNumbers(currentPage: number, totalPages: number) {
  const start = Math.max(currentPage - 2, 1);
  const end = Math.min(start + 4, totalPages);
  const adjustedStart = Math.max(end - 4, 1);

  return Array.from({ length: end - adjustedStart + 1 }, (_, index) => adjustedStart + index);
}

function createHref(basePath: string, page: number) {
  return `${basePath}?page=${page}`;
}

export function AdminPagination({ currentPage, totalPages, basePath }: AdminPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const pages = getPageNumbers(currentPage, totalPages);
  const isFirstPage = currentPage <= 1;
  const isLastPage = currentPage >= totalPages;

  return (
    <nav className="flex items-center justify-between border-t border-border px-5 py-4" aria-label="페이지네이션">
      <p className="text-sm text-muted-foreground">
        {currentPage} / {totalPages} 페이지
      </p>
      <div className="flex items-center gap-1">
        <Link
          href={createHref(basePath, Math.max(currentPage - 1, 1))}
          aria-disabled={isFirstPage}
          className={cn(pageLinkClass, isFirstPage && 'pointer-events-none opacity-40')}
        >
          <ChevronLeft className="size-4" />
        </Link>
        {pages.map((page) => (
          <Link
            key={page}
            href={createHref(basePath, page)}
            aria-current={page === currentPage ? 'page' : undefined}
            className={cn(
              pageLinkClass,
              page === currentPage && 'border-primary bg-primary text-primary-foreground hover:bg-primary',
            )}
          >
            {page}
          </Link>
        ))}
        <Link
          href={createHref(basePath, Math.min(currentPage + 1, totalPages))}
          aria-disabled={isLastPage}
          className={cn(pageLinkClass, isLastPage && 'pointer-events-none opacity-40')}
        >
          <ChevronRight className="size-4" />
        </Link>
      </div>
    </nav>
  );
}
