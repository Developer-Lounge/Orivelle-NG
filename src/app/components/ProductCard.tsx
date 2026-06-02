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
        whileHover={{ y: -8 }}
        transition={{ duration: 0.2 }}
        className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl overflow-hidden hover:shadow-xl dark:hover:shadow-2xl hover:dark:shadow-indigo-500/20 transition-all group backdrop-blur-sm"
      >
        <div className="relative aspect-square bg-neutral-200 dark:bg-neutral-700 overflow-hidden">
          <img
            src={firstVariant.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {discount && (
            <motion.div
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              className="absolute top-3 left-3 px-3 py-1.5 bg-gradient-to-br from-red-500 to-red-600 text-white text-xs font-bold rounded-lg shadow-lg"
            >
              -{discount}%
            </motion.div>
          )}
          {firstVariant.stock === 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="px-4 py-2 bg-white text-black rounded-lg">Out of Stock</span>
            </div>
          )}
        </div>
        <div className="p-4 space-y-2">
          <h3 className="text-sm font-semibold truncate text-neutral-900 dark:text-neutral-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {product.name}
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">{product.brand}</p>
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${
                  i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                }`}
              />
            ))}
            <span className="text-xs text-neutral-500 dark:text-neutral-400 ml-1">({rating.toFixed(1)})</span>
          </div>
          <div className="flex items-center justify-between pt-2">
            <div>
              <p className="font-semibold text-lg text-neutral-900 dark:text-neutral-100">${firstVariant.price}</p>
              {discount && (
                <p className="text-xs text-neutral-400 dark:text-neutral-500 line-through">
                  ${(firstVariant.price / (1 - discount / 100)).toFixed(2)}
                </p>
              )}
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddToCart}
              disabled={firstVariant.stock === 0}
              className="w-10 h-10 flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-lg disabled:bg-neutral-300 dark:disabled:bg-neutral-600 disabled:cursor-not-allowed transition-colors shadow-lg hover:shadow-indigo-500/50"
              aria-label="Add to cart"
            >
              <ShoppingCart className="w-5 h-5" />
            </motion.button>
          </div>
          {flashSaleEndDate && timeLeft && (
            <motion.div
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="pt-3 border-t border-neutral-200 dark:border-neutral-700"
            >
              <p className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                ⚡ Flash sale ends in: <span className="font-mono">{timeLeft}</span>
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </Link>
  );
}
