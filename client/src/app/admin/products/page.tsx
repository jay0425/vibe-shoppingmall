import Link from 'next/link';
import Image from 'next/image';
import { Plus, Search, Pencil, Trash2 } from '@/lib/lucide-react';
import { AdminTopbar } from '@/components/admin/AdminTopbar';
import { products, formatPrice, categories } from '@/lib/data';

function categoryLabel(slug: string) {
  return categories.find((c) => c.slug === slug)?.label ?? slug;
}

export default function AdminProductsPage() {
  return (
    <>
      <AdminTopbar title="상품 관리" subtitle={`총 ${products.length}개의 상품`} />
      <div className="flex-1 space-y-5 p-5 md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="상품명 검색"
              className="h-10 w-full rounded-md border border-input bg-card pl-9 pr-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
            />
          </div>
          <Link
            href="/admin/products/new"
            className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            <Plus className="size-4" />
            상품 등록
          </Link>
        </div>

        <div className="overflow-hidden rounded-lg border border-border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted-foreground">
                  <th className="px-5 py-3 font-medium">상품</th>
                  <th className="px-5 py-3 font-medium">카테고리</th>
                  <th className="px-5 py-3 font-medium">판매가</th>
                  <th className="px-5 py-3 font-medium">재고</th>
                  <th className="px-5 py-3 font-medium">상태</th>
                  <th className="px-5 py-3 text-right font-medium">관리</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-b border-border last:border-0">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative size-12 shrink-0 overflow-hidden rounded-md bg-muted">
                          <Image
                            src={p.image || '/placeholder.svg'}
                            alt={p.name}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-medium">{p.name}</p>
                          <p className="truncate text-xs text-muted-foreground">{p.englishName}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">{categoryLabel(p.category)}</td>
                    <td className="px-5 py-3 font-medium">{formatPrice(p.price)}</td>
                    <td className="px-5 py-3">
                      <span className={p.stock < 50 ? 'text-destructive' : ''}>{p.stock}개</span>
                    </td>
                    <td className="px-5 py-3">
                      <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-1 text-xs text-secondary-foreground">
                        판매중
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          aria-label="수정"
                          className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                        >
                          <Pencil className="size-4" />
                        </button>
                        <button
                          aria-label="삭제"
                          className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-destructive"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </td>
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
