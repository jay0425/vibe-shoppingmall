import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from '@/lib/lucide-react';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { ProductCard } from '@/components/ProductCard';
import { categories, type Product } from '@/lib/data';
import { httpClient } from '@/shared/api';

type ApiProduct = {
  id: string;
  sku: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description?: string | null;
};

type ProductListResponse = {
  items: ApiProduct[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

function toProduct(product: ApiProduct): Product {
  const description = product.description ?? '';

  return {
    id: product.id,
    name: product.name,
    englishName: product.sku,
    price: product.price,
    category: product.category,
    image: product.image,
    colors: ['기본'],
    sizes: ['FREE'],
    description,
    detail: description || `${product.name} 상품 상세 정보입니다.`,
    stock: 0,
  };
}

async function getProducts() {
  const response = await httpClient<ProductListResponse>('/api/products?page=1&limit=100', {
    cache: 'no-store',
  });

  return response.items.map(toProduct);
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category = 'all' } = await searchParams;
  const products = await getProducts();

  const filtered = products.filter((p) => {
    if (category === 'all') return true;
    if (category === 'new') return p.badge === 'NEW';
    if (category === 'best') return p.badge === 'BEST';
    return p.category === category;
  });

  const activeLabel = categories.find((c) => c.slug === category)?.label ?? '전체';

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-12 md:grid-cols-2 md:px-6 md:py-20">
          <div className="order-2 md:order-1">
            <p className="mb-4 text-sm tracking-[0.2em] text-accent-foreground">
              2026 SPRING / SUMMER
            </p>
            <h1 className="font-heading text-4xl leading-tight text-foreground text-balance md:text-6xl">
              매일이 사랑스러운
              <br />
              데일리 무드
            </h1>
            <p className="mt-5 max-w-md leading-relaxed text-muted-foreground">
              부드러운 컬러와 우아한 실루엣으로 완성하는 밀크코코아의 시즌 컬렉션. 오늘의 당신을 더
              빛나게 해줄 옷을 만나보세요.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/?category=new"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                신상품 보기 <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/?category=best"
                className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
              >
                베스트 셀러
              </Link>
            </div>
          </div>
          <div className="order-1 md:order-2">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
              <Image
                src="/hero-main.png"
                alt="밀크코코아 시즌 컬렉션"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Category banners */}
      <section className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              label: '원피스',
              desc: '하늘하늘 여름 원피스',
              href: '/?category=dress',
              img: '/products/dress-floral.png',
            },
            {
              label: '아우터',
              desc: '가볍게 걸치는 데일리 아우터',
              href: '/?category=outer',
              img: '/products/coat-camel.png',
            },
            {
              label: '신상품',
              desc: '이번 주 새로 입고된 아이템',
              href: '/?category=new',
              img: '/hero-secondary.png',
            },
          ].map((b) => (
            <Link
              key={b.label}
              href={b.href}
              className="group relative aspect-[4/3] overflow-hidden rounded-xl"
            >
              <Image
                src={b.img || '/placeholder.svg'}
                alt={b.label}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-foreground/15" />
              <div className="absolute bottom-5 left-5 text-background">
                <p className="text-xs">{b.desc}</p>
                <p className="font-heading text-2xl">{b.label}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Product grid */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-heading text-3xl text-foreground">{activeLabel}</h2>
            <p className="mt-1 text-sm text-muted-foreground">총 {filtered.length}개의 상품</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => {
              const active = c.slug === category || (category === 'all' && c.slug === 'all');
              return (
                <Link
                  key={c.slug}
                  href={c.slug === 'all' ? '/' : `/?category=${c.slug}`}
                  className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
                    active
                      ? 'bg-primary text-primary-foreground'
                      : 'border border-border text-muted-foreground hover:bg-secondary'
                  }`}
                >
                  {c.label}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Promo strip */}
      <section className="border-y border-border bg-secondary/40">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-12 text-center md:grid-cols-3 md:px-6">
          {[
            { t: '무료 배송', d: '5만원 이상 구매 시 전국 무료배송' },
            { t: '안심 교환·반품', d: '수령 후 7일 이내 교환 및 반품 가능' },
            { t: '적립 혜택', d: '구매 금액의 최대 3% 적립' },
          ].map((f) => (
            <div key={f.t}>
              <h3 className="font-heading text-xl text-foreground">{f.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
