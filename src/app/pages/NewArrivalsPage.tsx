import { useMemo } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Calendar, ShoppingCart, ShieldCheck } from 'lucide-react';
import { BackgroundDecorations } from '../components/BackgroundDecorations';
import { ProductCard } from '../components/ProductCard';
import productsData from '../../data/products.json';
import { Product } from '../../types/product';
import { useCartStore } from '../../store/cartStore';

export function NewArrivalsPage() {
  const addItem = useCartStore((state) => state.addItem);

  const newProducts = useMemo(() => productsData.filter((p) => p.isNew === true), []);

  const spotlightProduct = useMemo(
    () => productsData.find((p) => p.slug === 'aerosound-elite') || newProducts[0],
    [newProducts]
  );

  const otherNewProducts = useMemo(
    () => (spotlightProduct ? newProducts.filter((p) => p.id !== spotlightProduct.id) : newProducts),
    [newProducts, spotlightProduct]
  );

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
    <div className="bg-white dark:bg-neutral-900 transition-colors duration-300 min-h-screen relative pb-20">
      <BackgroundDecorations />

      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-neutral-950 via-indigo-950 to-neutral-950 text-white py-12 md:py-20 px-4">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_var(--tw-gradient-stops))] from-amber-500/5 via-transparent to-transparent" />
        <div className="max-w-7xl mx-auto text-center relative z-10 space-y-3 md:space-y-4">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-xs font-semibold text-amber-400 backdrop-blur-md"
          >
            <Sparkles className="w-3 h-3 text-amber-400" />
            FRESH DROP
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-6xl font-display font-bold tracking-tight text-white"
          >
            New Arrivals
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-neutral-300 max-w-lg mx-auto text-sm px-2"
          >
            Step into the future with our latest releases — handpicked premium quality products freshly added to our collection.
          </motion.p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 relative z-10 space-y-12 md:space-y-16">
        {/* Spotlight Section */}
        {spotlightProduct && (
          <section className="space-y-5">
            <div className="flex items-center gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-3">
              <span className="p-1 bg-amber-500/10 rounded-lg text-amber-500">
                <Sparkles className="w-5 h-5 fill-amber-500/20" />
              </span>
              <h2 className="text-base sm:text-xl font-bold font-display text-neutral-900 dark:text-white uppercase tracking-wider">
                Arrival Spotlight
              </h2>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/50 dark:border-neutral-700/50 rounded-2xl sm:rounded-3xl overflow-hidden p-4 sm:p-6 md:p-10 flex flex-col lg:flex-row gap-6 lg:gap-12 backdrop-blur-md"
            >
              {/* Image */}
              <div className="lg:w-1/2 relative">
                <div className="aspect-video sm:aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden bg-neutral-200 dark:bg-neutral-800 relative">
                  <img
                    src={spotlightProduct.variants[0].images[0]}
                    alt={spotlightProduct.name}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                </div>
                {/* Thumbnail — only on sm+ */}
                {spotlightProduct.variants[0].images[1] && (
                  <div className="absolute bottom-3 right-3 w-20 sm:w-28 aspect-square rounded-xl overflow-hidden border-2 border-white dark:border-neutral-800 shadow-xl hidden sm:block">
                    <img src={spotlightProduct.variants[0].images[1]} alt="Alternate view" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="lg:w-1/2 flex flex-col justify-between gap-5">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-900 text-indigo-600 dark:text-indigo-400 text-xs font-bold rounded-lg">
                      NEW RELEASE
                    </span>
                    <span className="flex items-center gap-1 text-xs text-neutral-500">
                      <Calendar className="w-3.5 h-3.5" />
                      Just added this week
                    </span>
                  </div>

                  <div>
                    <p className="text-xs sm:text-sm font-semibold text-amber-500 uppercase tracking-widest">{spotlightProduct.brand}</p>
                    <h3 className="text-xl sm:text-3xl font-display font-extrabold text-neutral-900 dark:text-white mt-1">
                      {spotlightProduct.name}
                    </h3>
                  </div>

                  <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">{spotlightProduct.description}</p>

                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Key features</h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {spotlightProduct.features.slice(0, 4).map((feat, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
                          <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-neutral-200/50 dark:border-neutral-700/50">
                  <div>
                    <p className="text-[10px] text-neutral-400 uppercase font-bold">Introductory Price</p>
                    <p className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white">
                      ${spotlightProduct.variants[0].price.toFixed(2)}
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={(e) => handleQuickAdd(spotlightProduct, e)}
                    className="w-full sm:w-auto px-6 py-3 sm:py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 text-sm"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </section>
        )}

        {/* More New Arrivals */}
        {otherNewProducts.length > 0 && (
          <section className="space-y-5">
            <div className="border-b border-neutral-100 dark:border-neutral-800 pb-3">
              <h2 className="text-base sm:text-xl font-bold font-display text-neutral-900 dark:text-white uppercase tracking-wider">
                More Fresh Additions
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
              {otherNewProducts.map((product) => (
                <div key={product.id} className="relative">
                  <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10 bg-amber-500 text-neutral-950 font-black text-[8px] sm:text-[9px] uppercase tracking-widest px-2 py-0.5 sm:py-1 rounded shadow-lg flex items-center gap-0.5">
                    <Sparkles className="w-2 h-2 sm:w-2.5 sm:h-2.5 fill-current" />
                    New
                  </div>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
