import { notFound } from 'next/navigation';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { ProductCard } from '@/components/ProductCard';
import { ProductDetail } from '@/components/ProductDetail';
import { getProduct, products } from '@/lib/data';

export function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = getProduct(id);
  if (!product) notFound();

  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);
  const fallback = products.filter((p) => p.id !== product.id).slice(0, 4);
  const recommend = related.length >= 2 ? related : fallback;

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
