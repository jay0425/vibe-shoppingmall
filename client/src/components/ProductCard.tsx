import Link from 'next/link';
import Image from 'next/image';
import { formatPrice, type Product } from '@/lib/data';

const badgeStyles: Record<string, string> = {
  NEW: 'bg-accent text-accent-foreground',
  BEST: 'bg-primary text-primary-foreground',
  SALE: 'bg-destructive text-white',
};

export function ProductCard({ product }: { product: Product }) {
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  return (
    <Link href={`/products/${product.id}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden rounded-md bg-muted">
        <Image
          src={product.image || '/placeholder.svg'}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {product.badge && (
          <span
            className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-wide ${badgeStyles[product.badge]}`}
          >
            {product.badge}
          </span>
        )}
      </div>
      <div className="mt-3 space-y-1">
        <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
          {product.englishName}
        </p>
        <h3 className="text-sm text-foreground">{product.name}</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-foreground">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <>
              <span className="text-xs text-muted-foreground line-through">
                {formatPrice(product.originalPrice)}
              </span>
              <span className="text-xs font-semibold text-destructive">{discount}%</span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
