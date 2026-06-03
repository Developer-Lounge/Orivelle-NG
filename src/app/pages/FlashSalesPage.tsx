import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, Timer, Flame, Sparkles, ShoppingCart, Percent } from 'lucide-react';
import { BackgroundDecorations } from '../components/BackgroundDecorations';
import { ProductCard } from '../components/ProductCard';
import productsData from '../../data/products.json';
import { Product } from '../../types/product';
import { useCartStore } from '../../store/cartStore';

export function FlashSalesPage() {
  const addItem = useCartStore((state) => state.addItem);
  const [timeLeft, setTimeLeft] = useState({ hours: '00', minutes: '00', seconds: '00' });

  // Filter flash sale products
  const flashSaleProducts = useMemo(() => {
    return productsData.filter((p) => p.isFlashSale === true);
  }, []);

  // Compute target end date (dynamic: always 2 days in the future so it never expires)
  const targetDateStr = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + 2);
    date.setHours(23, 59, 59, 0);
    return date.toISOString();
  }, []);

  useEffect(() => {
    const target = new Date(targetDateStr).getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft({ hours: '00', minutes: '00', seconds: '00' });
        return;
      }

      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({
        hours: h < 10 ? `0${h}` : `${h}`,
        minutes: m < 10 ? `0${m}` : `${m}`,
        seconds: s < 10 ? `0${s}` : `${s}`,
      });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [targetDateStr]);

  // Mock claimed percentage data per product
  const claimedData: Record<string, { percent: number; itemsLeft: number }> = {
    '3': { percent: 78, itemsLeft: 4 }, // Chrono Lux Smartwatch
    '6': { percent: 64, itemsLeft: 6 }, // Chef's Choice Knife Set
  };

  const handleQuickAdd = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const variant = product.variants.find((v) => v.stock > 0) || product.variants[0];
    if (variant.stock === 0) return;

    addItem({
      variantId: variant.id,
      productName: product.name,
      brand: product.brand,
      color: variant.color,
      size: variant.size,
      price: variant.price,
      quantity: 1,
      image: variant.images[0],
    });
  };

  return (
    <div className="bg-neutral-50 dark:bg-neutral-900 transition-colors duration-300 min-h-screen relative pb-20">
      <BackgroundDecorations />

      {/* Hero Banner Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-red-950 via-rose-900 to-neutral-950 text-white py-20 px-4">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-500/10 via-transparent to-transparent animate-pulse" />
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10 space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-red-500/20 border border-red-500/30 rounded-full text-sm font-semibold text-red-400 backdrop-blur-md"
          >
            <Flame className="w-4 h-4 text-red-500 animate-bounce" />
            Limited Time Offers
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-display font-bold tracking-tight text-white"
          >
            ⚡ FLASH SALE
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-red-200 max-w-xl mx-auto text-sm md:text-base"
          >
            Unbelievable prices on premium quality products. Stocks are extremely limited. Grab them before they are gone!
          </motion.p>

          {/* Countdown Clock */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-3 md:gap-4 pt-4"
          >
            <div className="flex flex-col items-center">
              <span className="text-3xl md:text-5xl font-mono font-bold bg-neutral-900/80 border border-neutral-700/50 rounded-xl px-4 py-3 shadow-2xl backdrop-blur-sm min-w-[70px]">
                {timeLeft.hours}
              </span>
              <span className="text-[10px] md:text-xs text-red-300 font-bold uppercase tracking-wider mt-2">Hours</span>
            </div>
            <span className="text-3xl md:text-5xl font-mono text-red-400 font-bold animate-ping">:</span>
            <div className="flex flex-col items-center">
              <span className="text-3xl md:text-5xl font-mono font-bold bg-neutral-900/80 border border-neutral-700/50 rounded-xl px-4 py-3 shadow-2xl backdrop-blur-sm min-w-[70px]">
                {timeLeft.minutes}
              </span>
              <span className="text-[10px] md:text-xs text-red-300 font-bold uppercase tracking-wider mt-2">Mins</span>
            </div>
            <span className="text-3xl md:text-5xl font-mono text-red-400 font-bold animate-ping">:</span>
            <div className="flex flex-col items-center">
              <span className="text-3xl md:text-5xl font-mono font-bold bg-neutral-900/80 border border-neutral-700/50 rounded-xl px-4 py-3 shadow-2xl backdrop-blur-sm min-w-[70px]">
                {timeLeft.seconds}
              </span>
              <span className="text-[10px] md:text-xs text-red-300 font-bold uppercase tracking-wider mt-2">Secs</span>
            </div>
          </motion.div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* Flash Sale Grid with Progress Bars */}
        <div className="grid md:grid-cols-2 gap-8">
          {flashSaleProducts.map((product, idx) => {
            const firstVariant = product.variants[0];
            const claimed = claimedData[product.id] || { percent: 50, itemsLeft: 5 };
            const original = product.originalPrice || firstVariant.price * 1.35;
            const savings = original - firstVariant.price;
            const percentOff = Math.round(((original - firstVariant.price) / original) * 100);

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.15 }}
                className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-3xl overflow-hidden hover:shadow-2xl hover:border-red-500/30 transition-all flex flex-col md:flex-row group backdrop-blur-md"
              >
                {/* Image Section */}
                <div className="relative md:w-2/5 aspect-square md:aspect-auto bg-neutral-100 dark:bg-neutral-900 overflow-hidden">
                  <img
                    src={firstVariant.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-red-600 to-amber-500 text-white text-xs font-black tracking-widest uppercase py-1.5 px-3.5 rounded-lg shadow-lg flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 fill-white" />
                    -{percentOff}% OFF
                  </div>
                </div>

                {/* Details Section */}
                <div className="p-6 md:w-3/5 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-red-500 dark:text-red-400 uppercase tracking-widest">
                      {product.brand}
                    </p>
                    <h3 className="text-xl font-display font-bold text-neutral-900 dark:text-neutral-50 hover:text-red-500 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  {/* Price info */}
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-extrabold text-neutral-900 dark:text-white">
                      ${firstVariant.price.toFixed(2)}
                    </span>
                    <span className="text-base text-neutral-400 dark:text-neutral-500 line-through">
                      ${original.toFixed(2)}
                    </span>
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded">
                      Save ${savings.toFixed(2)}
                    </span>
                  </div>

                  {/* Urgency Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold text-neutral-600 dark:text-neutral-400">
                      <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 animate-pulse">
                        <Flame className="w-3 h-3 fill-current" />
                        {claimed.percent}% Claimed
                      </span>
                      <span>{claimed.itemsLeft} items left</span>
                    </div>
                    <div className="w-full h-2.5 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${claimed.percent}%` }}
                        transition={{ duration: 1.2, ease: 'easeOut' }}
                        className="h-full bg-gradient-to-r from-red-500 to-amber-500"
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 pt-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={(e) => handleQuickAdd(product, e)}
                      disabled={firstVariant.stock === 0}
                      className="flex-1 py-3.5 bg-neutral-900 hover:bg-neutral-800 dark:bg-red-600 dark:hover:bg-red-700 text-white rounded-xl text-sm font-bold transition-all shadow-lg flex items-center justify-center gap-2 disabled:bg-neutral-300 dark:disabled:bg-neutral-700 disabled:cursor-not-allowed"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Add to Cart
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
