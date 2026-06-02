import { useState } from 'react';
import { ProductCard } from './ProductCard';
import { Product } from '../../types/product';

interface ProductGridProps {
  products: Product[];
  title?: string;
  flashSale?: boolean;
  flashSaleEndDate?: string;
}

export function ProductGrid({ products, title, flashSale, flashSaleEndDate }: ProductGridProps) {
  const [isLoading] = useState(false);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {title && <h2 className="text-2xl">{title}</h2>}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {title && <h2 className="text-2xl">{title}</h2>}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            flashSaleEndDate={flashSale ? flashSaleEndDate : undefined}
            discount={flashSale ? 35 : undefined}
          />
        ))}
      </div>
    </div>
  );
}

function ProductCardSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden animate-pulse">
      <div className="aspect-square bg-gray-200" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
        <div className="h-3 bg-gray-200 rounded w-1/3" />
        <div className="flex justify-between">
          <div className="h-6 bg-gray-200 rounded w-1/4" />
          <div className="w-9 h-9 bg-gray-200 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
