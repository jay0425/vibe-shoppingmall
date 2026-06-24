import { notFound } from 'next/navigation';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { ProductCard } from '@/components/ProductCard';
import { ProductDetail } from '@/components/ProductDetail';
import type { Product } from '@/lib/data';
import { ApiError, httpClient } from '@/shared/api';

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

async function getProduct(id: string) {
  try {
    const product = await httpClient<ApiProduct>(`/api/products/${id}`, {
      cache: 'no-store',
    });

    return toProduct(product);
  } catch (error) {
    if (error instanceof ApiError && (error.status === 400 || error.status === 404)) {
      notFound();
    }

    throw error;
  }
}

async function getRecommendedProducts(currentProduct: Product) {
  const response = await httpClient<ProductListResponse>('/api/products?page=1&limit=8', {
    cache: 'no-store',
  });

  const products = response.items.map(toProduct).filter((product) => product.id !== currentProduct.id);
  const sameCategory = products.filter((product) => product.category === currentProduct.category);

  return (sameCategory.length >= 2 ? sameCategory : products).slice(0, 4);
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProduct(id);
  const recommend = await getRecommendedProducts(product);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <ProductDetail product={product} />

      <section className="mx-auto max-w-7xl px-4 pb-4 md:px-6">
        <h2 className="mb-6 font-heading text-2xl text-foreground">함께 보면 좋은 상품</h2>
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4">
          {recommend.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
