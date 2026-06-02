import { useState, useEffect } from 'react';
import { Star, ShoppingCart } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router';
import { useCartStore } from '../../store/cartStore';
import { Product } from '../../types/product';

interface ProductCardProps {
  product: Product;
  flashSaleEndDate?: string;
  discount?: number;
}

export function ProductCard({ product, flashSaleEndDate, discount }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const firstVariant = product.variants.find((v) => v.stock > 0) || product.variants[0];
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    if (!flashSaleEndDate) return;

    const updateTimer = () => {
      const end = new Date(flashSaleEndDate);
      const now = new Date();
      const diff = end.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft('Ended');
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [flashSaleEndDate]);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (firstVariant.stock === 0) return;

    addItem({
      variantId: firstVariant.id,
      productName: product.name,
      brand: product.brand,
      color: firstVariant.color,
      size: firstVariant.size,
      price: firstVariant.price,
      quantity: 1,
      image: firstVariant.images[0],
    });
  };

  const rating = 4 + Math.random();

  return (
    <Link to={`/product/${product.slug}`}>
      <motion.div
        whileHover={{ y: -4 }}
        className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-shadow group"
      >
        <div className="relative aspect-square bg-gray-100 overflow-hidden">
          <img
            src={firstVariant.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {discount && (
            <div className="absolute top-2 left-2 px-2 py-1 bg-red-600 text-white text-xs rounded">
              -{discount}%
            </div>
          )}
          {firstVariant.stock === 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="px-4 py-2 bg-white text-black rounded-lg">Out of Stock</span>
            </div>
          )}
        </div>
        <div className="p-4 space-y-2">
          <h3 className="truncate group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
          <p className="text-sm text-gray-500">{product.brand}</p>
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${
                  i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                }`}
              />
            ))}
            <span className="text-xs text-gray-500 ml-1">({rating.toFixed(1)})</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg">${firstVariant.price}</p>
              {discount && (
                <p className="text-xs text-gray-400 line-through">
                  ${(firstVariant.price / (1 - discount / 100)).toFixed(2)}
                </p>
              )}
            </div>
            <button
              onClick={handleAddToCart}
              disabled={firstVariant.stock === 0}
              className="w-9 h-9 flex items-center justify-center bg-black text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              aria-label="Add to cart"
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
          </div>
          {flashSaleEndDate && timeLeft && (
            <div className="pt-2 border-t">
              <p className="text-xs text-red-600">
                ⚡ Flash sale ends in: <span className="font-mono">{timeLeft}</span>
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </Link>
  );
}
