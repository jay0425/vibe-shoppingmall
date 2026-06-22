'use client';

import type React from 'react';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import Script from 'next/script';
import { AdminTopbar } from '@/components/admin/AdminTopbar';
import { Button } from '@/components/ui/Button';
import { ImagePlus } from '@/lib/lucide-react';

const fieldClass =
  'h-11 w-full rounded-md border border-input bg-card px-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '') ?? 'http://localhost:4000';
const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

type AdminProduct = {
  id: string;
  sku: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description?: string;
};

type CloudinaryUploadResult = {
  event: string;
  info?: {
    secure_url?: string;
  };
};

type CloudinaryWidget = {
  open: () => void;
};

declare global {
  interface Window {
    cloudinary?: {
      createUploadWidget: (
        options: {
          cloudName: string;
          uploadPreset: string;
          sources?: string[];
          multiple?: boolean;
          cropping?: boolean;
          resourceType?: string;
          clientAllowedFormats?: string[];
          maxFileSize?: number;
        },
        callback: (error: Error | null, result: CloudinaryUploadResult) => void,
      ) => CloudinaryWidget;
    };
  }
}

const productCategories = [
  { value: 'top', label: '상의' },
  { value: 'bottom', label: '하의' },
  { value: 'accessory', label: '액세서리' },
];

const getFormValue = (formData: FormData, key: string) => {
  const value = formData.get(key);
  return typeof value === 'string' ? value.trim() : '';
};

export default function EditProductPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [product, setProduct] = useState<AdminProduct | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isCloudinaryReady, setIsCloudinaryReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function getProduct() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/products/${params.id}`, {
          cache: 'no-store',
        });

        if (!response.ok) {
          const data = (await response.json().catch(() => null)) as { message?: string } | null;
          throw new Error(data?.message ?? '상품 정보를 불러오지 못했습니다.');
        }

        const data = (await response.json()) as AdminProduct;
        if (isMounted) {
          setProduct(data);
          setImageUrl(data.image);
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(error instanceof Error ? error.message : '상품 정보를 불러오지 못했습니다.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void getProduct();

    return () => {
      isMounted = false;
    };
  }, [params.id]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const payload = {
      sku: getFormValue(formData, 'sku'),
      name: getFormValue(formData, 'name'),
      price: Number(getFormValue(formData, 'price')),
      category: getFormValue(formData, 'category'),
      image: getFormValue(formData, 'image'),
      description: getFormValue(formData, 'description') || undefined,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/products/${params.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { message?: string } | null;
        throw new Error(data?.message ?? '상품 수정에 실패했습니다.');
      }

      router.push('/admin/products');
      router.refresh();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : '상품 수정에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  }

  function openCloudinaryWidget() {
    setErrorMessage('');

    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
      setErrorMessage(
        'Cloudinary 설정이 필요합니다. NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET 값을 설정해주세요.',
      );
      return;
    }

    if (!window.cloudinary || !isCloudinaryReady) {
      setErrorMessage('Cloudinary 업로드 위젯을 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: CLOUDINARY_CLOUD_NAME,
        uploadPreset: CLOUDINARY_UPLOAD_PRESET,
        sources: ['local', 'url', 'camera'],
        multiple: false,
        cropping: false,
        resourceType: 'image',
        clientAllowedFormats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
        maxFileSize: 5_000_000,
      },
      (error, result) => {
        if (error) {
          setErrorMessage('이미지 업로드에 실패했습니다.');
          return;
        }

        if (result.event === 'success' && result.info?.secure_url) {
          setImageUrl(result.info.secure_url);
        }
      },
    );

    widget.open();
  }

  return (
    <>
      <Script
        src="https://widget.cloudinary.com/v2.0/global/all.js"
        strategy="afterInteractive"
        onLoad={() => setIsCloudinaryReady(true)}
      />
      <AdminTopbar title="상품 수정" subtitle="상품 정보를 변경하세요" />
      <form onSubmit={handleSubmit} className="flex-1 p-5 md:p-8">
        {isLoading ? (
          <div className="rounded-lg border border-border bg-card px-5 py-10 text-center text-sm text-muted-foreground">
            상품 정보를 불러오는 중입니다.
          </div>
        ) : product ? (
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <section className="rounded-lg border border-border bg-card p-5">
                <h2 className="mb-4 font-medium">기본 정보</h2>
                <div className="grid gap-4">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="sku" className="text-sm font-medium">
                      SKU
                    </label>
                    <input id="sku" name="sku" required defaultValue={product.sku} className={fieldClass} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      상품명
                    </label>
                    <input id="name" name="name" required defaultValue={product.name} className={fieldClass} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="description" className="text-sm font-medium">
                      상품 설명
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows={4}
                      defaultValue={product.description ?? ''}
                      className="w-full rounded-md border border-input bg-card p-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
                    />
                  </div>
                </div>
              </section>

              <section className="rounded-lg border border-border bg-card p-5">
                <h2 className="mb-4 font-medium">가격</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="price" className="text-sm font-medium">
                      판매가 (원)
                    </label>
                    <input
                      id="price"
                      name="price"
                      required
                      type="number"
                      min="0"
                      defaultValue={product.price}
                      className={fieldClass}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="category" className="text-sm font-medium">
                      카테고리
                    </label>
                    <select
                      id="category"
                      name="category"
                      required
                      defaultValue={product.category}
                      className={fieldClass}
                    >
                      {productCategories.map((category) => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </section>

              <section className="rounded-lg border border-border bg-card p-5">
                <h2 className="mb-4 font-medium">상품 이미지</h2>
                <div className="grid gap-4">
                  <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-md border border-dashed border-border bg-muted">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt="상품 이미지 미리보기"
                        fill
                        className="object-cover"
                        sizes="(min-width: 1024px) 66vw, 100vw"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground">
                        <ImagePlus className="size-8" />
                        <span>이미지를 업로드하면 미리보기가 표시됩니다.</span>
                      </div>
                    )}
                  </div>
                  <Button type="button" variant="outline" className="w-fit" onClick={openCloudinaryWidget}>
                    <ImagePlus className="size-4" />
                    이미지 변경
                  </Button>
                </div>

                <div className="mt-4 flex flex-col gap-2">
                  <label htmlFor="image" className="text-sm font-medium">
                    Cloudinary 이미지 URL
                  </label>
                  <input
                    id="image"
                    name="image"
                    required
                    type="url"
                    value={imageUrl}
                    onChange={(event) => setImageUrl(event.target.value)}
                    className={fieldClass}
                  />
                </div>
              </section>

              {errorMessage && (
                <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {errorMessage}
                </p>
              )}
            </div>

            <div className="space-y-6">
              <section className="rounded-lg border border-border bg-card p-5">
                <h2 className="mb-4 font-medium">수정 정보</h2>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <p>SKU는 상품마다 고유해야 합니다.</p>
                  <p>이미지는 Cloudinary 업로드 위젯으로 변경합니다.</p>
                  <p>설명은 비워둘 수 있습니다.</p>
                </div>
              </section>

              <section className="rounded-lg border border-border bg-card p-5">
                <h2 className="mb-4 font-medium">분류 기준</h2>
                <div className="space-y-2 text-sm text-muted-foreground">
                  {productCategories.map((category) => (
                    <div key={category.value} className="flex items-center justify-between">
                      <span>{category.label}</span>
                      <code className="rounded bg-muted px-2 py-1 text-xs text-foreground">
                        {category.value}
                      </code>
                    </div>
                  ))}
                </div>
              </section>

              <div className="flex flex-col gap-2">
                <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? '수정 중...' : '상품 수정'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="w-full"
                  disabled={isSubmitting}
                  onClick={() => router.push('/admin/products')}
                >
                  취소
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-lg border border-border bg-card px-5 py-10 text-center text-sm text-destructive">
            {errorMessage || '상품 정보를 불러오지 못했습니다.'}
          </div>
        )}
      </form>
    </>
  );
}
