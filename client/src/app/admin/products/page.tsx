import Link from 'next/link';
import Image from 'next/image';
import { Plus, Search } from '@/lib/lucide-react';
import { AdminProductActions } from '@/components/admin/AdminProductActions';
import { AdminPagination } from '@/components/admin/AdminPagination';
import { AdminTopbar } from '@/components/admin/AdminTopbar';
import { formatPrice } from '@/lib/data';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '') ?? 'http://localhost:4000';
const PRODUCTS_PER_PAGE = 10;

type AdminProduct = {
  id: string;
  sku: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description?: string;
};

type AdminProductsResponse = {
  items: AdminProduct[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

const categoryLabels: Record<string, string> = {
  top: '상의',
  bottom: '하의',
  accessory: '액세서리',
};

async function getAdminProducts(page: number): Promise<AdminProductsResponse & { errorMessage: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/products?page=${page}&limit=${PRODUCTS_PER_PAGE}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('상품 리스트를 불러오지 못했습니다.');
    }

    const data = (await response.json()) as AdminProductsResponse;

    return {
      ...data,
      errorMessage: '',
    };
  } catch {
    return {
      items: [],
      total: 0,
      page,
      limit: PRODUCTS_PER_PAGE,
      totalPages: 1,
      errorMessage: '상품 리스트를 불러오지 못했습니다. 백엔드 서버 실행 상태를 확인해주세요.',
    };
  }
}

function categoryLabel(slug: string) {
  return categoryLabels[slug] ?? slug;
}

function parsePage(value: string | string[] | undefined) {
  const rawValue = Array.isArray(value) ? value[0] : value;
  const page = Number(rawValue ?? 1);

  return Number.isInteger(page) && page > 0 ? page : 1;
}

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string | string[] }>;
}) {
  const { page: pageParam } = await searchParams;
  const requestedPage = parsePage(pageParam);
  const { items: products, total, page, totalPages, errorMessage } = await getAdminProducts(requestedPage);

  return (
    <>
      <AdminTopbar title="상품 관리" subtitle={`총 ${total}개의 상품`} />
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
                          <p className="truncate text-xs text-muted-foreground">{p.sku}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">{categoryLabel(p.category)}</td>
                    <td className="px-5 py-3 font-medium">{formatPrice(p.price)}</td>
                    <td className="px-5 py-3">
                      <span className="text-muted-foreground">-</span>
                    </td>
                    <td className="px-5 py-3">
                      <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-1 text-xs text-secondary-foreground">
                        판매중
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <AdminProductActions productId={p.id} productName={p.name} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {errorMessage && (
              <div className="border-t border-border px-5 py-10 text-center text-sm text-destructive">
                {errorMessage}
              </div>
            )}
            {!errorMessage && products.length === 0 && (
              <div className="border-t border-border px-5 py-10 text-center text-sm text-muted-foreground">
                등록된 상품이 없습니다.
              </div>
            )}
            {!errorMessage && (
              <AdminPagination currentPage={page} totalPages={totalPages} basePath="/admin/products" />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
