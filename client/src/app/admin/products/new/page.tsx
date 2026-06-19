'use client';

import type React from 'react';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ImagePlus, X } from '@/lib/lucide-react';
import { AdminTopbar } from '@/components/admin/AdminTopbar';
import { Button } from '@/components/ui/Button';
import { categories } from '@/lib/data';

const fieldClass =
  'h-11 w-full rounded-md border border-input bg-card px-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30';

export default function NewProductPage() {
  const router = useRouter();
  const [sizes, setSizes] = useState<string[]>(['S', 'M', 'L']);
  const [colors, setColors] = useState<string[]>(['크림', '베이지']);
  const [colorInput, setColorInput] = useState('');

  const allSizes = ['FREE', 'S', 'M', 'L', 'XL'];

  function toggleSize(s: string) {
    setSizes((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));
  }

  function addColor() {
    const v = colorInput.trim();
    if (v && !colors.includes(v)) setColors((prev) => [...prev, v]);
    setColorInput('');
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    router.push('/admin/products');
  }

  return (
    <>
      <AdminTopbar title="상품 등록" subtitle="새로운 상품 정보를 입력하세요" />
      <form onSubmit={handleSubmit} className="flex-1 p-5 md:p-8">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <section className="rounded-lg border border-border bg-card p-5">
              <h2 className="mb-4 font-medium">기본 정보</h2>
              <div className="grid gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">상품명</label>
                  <input required placeholder="예) 코튼 러플 블라우스" className={fieldClass} />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">영문 상품명</label>
                  <input placeholder="예) Cotton Ruffle Blouse" className={fieldClass} />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">상품 설명</label>
                  <textarea
                    rows={4}
                    placeholder="상품에 대한 간단한 설명을 입력하세요"
                    className="w-full rounded-md border border-input bg-card p-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
                  />
                </div>
              </div>
            </section>

            <section className="rounded-lg border border-border bg-card p-5">
              <h2 className="mb-4 font-medium">가격 및 재고</h2>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">판매가 (원)</label>
                  <input required type="number" placeholder="39000" className={fieldClass} />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">정가 (원)</label>
                  <input type="number" placeholder="52000" className={fieldClass} />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">재고 수량</label>
                  <input required type="number" placeholder="100" className={fieldClass} />
                </div>
              </div>
            </section>

            <section className="rounded-lg border border-border bg-card p-5">
              <h2 className="mb-4 font-medium">옵션</h2>
              <div className="mb-5">
                <label className="mb-2 block text-sm font-medium">사이즈</label>
                <div className="flex flex-wrap gap-2">
                  {allSizes.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => toggleSize(s)}
                      className={`rounded-md border px-4 py-2 text-sm transition-colors ${
                        sizes.includes(s)
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border hover:bg-muted'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">컬러</label>
                <div className="mb-2 flex flex-wrap gap-2">
                  {colors.map((c) => (
                    <span
                      key={c}
                      className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-sm text-secondary-foreground"
                    >
                      {c}
                      <button
                        type="button"
                        onClick={() => setColors((prev) => prev.filter((x) => x !== c))}
                        aria-label={`${c} 삭제`}
                      >
                        <X className="size-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    value={colorInput}
                    onChange={(e) => setColorInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addColor();
                      }
                    }}
                    placeholder="컬러명 입력 후 추가"
                    className={fieldClass}
                  />
                  <Button type="button" variant="outline" onClick={addColor}>
                    추가
                  </Button>
                </div>
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <section className="rounded-lg border border-border bg-card p-5">
              <h2 className="mb-4 font-medium">상품 이미지</h2>
              <div className="flex aspect-square flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-border text-muted-foreground">
                <ImagePlus className="size-8" />
                <span className="text-sm">이미지를 업로드하세요</span>
                <span className="text-xs">권장 1000 x 1000px</span>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="flex aspect-square items-center justify-center rounded-md border border-dashed border-border text-muted-foreground"
                  >
                    <ImagePlus className="size-4" />
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-lg border border-border bg-card p-5">
              <h2 className="mb-4 font-medium">분류</h2>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">카테고리</label>
                  <select className={fieldClass}>
                    {categories
                      .filter((c) => !['all', 'best', 'new'].includes(c.slug))
                      .map((c) => (
                        <option key={c.slug} value={c.slug}>
                          {c.label}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">뱃지</label>
                  <select className={fieldClass}>
                    <option value="">없음</option>
                    <option value="NEW">NEW</option>
                    <option value="BEST">BEST</option>
                    <option value="SALE">SALE</option>
                  </select>
                </div>
              </div>
            </section>

            <div className="flex flex-col gap-2">
              <Button type="submit" size="lg" className="w-full">
                상품 등록
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="w-full"
                onClick={() => router.push('/admin/products')}
              >
                취소
              </Button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
