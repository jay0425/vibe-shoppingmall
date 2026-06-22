'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Pencil, Trash2 } from '@/lib/lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '') ?? 'http://localhost:4000';

export function AdminProductActions({ productId, productName }: { productId: string; productName: string }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(`'${productName}' 상품을 삭제할까요?`);
    if (!confirmed) {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/products/${productId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { message?: string } | null;
        throw new Error(data?.message ?? '상품 삭제에 실패했습니다.');
      }

      router.refresh();
    } catch (error) {
      window.alert(error instanceof Error ? error.message : '상품 삭제에 실패했습니다.');
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="flex items-center justify-end gap-1">
      <Link
        href={`/admin/products/${productId}/edit`}
        aria-label="수정"
        className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
      >
        <Pencil className="size-4" />
      </Link>
      <button
        type="button"
        aria-label="삭제"
        disabled={isDeleting}
        onClick={handleDelete}
        className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-destructive disabled:pointer-events-none disabled:opacity-50"
      >
        <Trash2 className="size-4" />
      </button>
    </div>
  );
}
