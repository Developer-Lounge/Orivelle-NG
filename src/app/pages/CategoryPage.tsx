import { useState } from 'react';
import { useParams, Link } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { SlidersHorizontal, ChevronDown } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '../components/ui/breadcrumb';
import { BackgroundDecorations } from '../components/BackgroundDecorations';
import { ProductCard } from '../components/ProductCard';
import categoriesData from '../../data/categories.json';
import productsData from '../../data/products.json';

const accentColorMap: Record<string, string> = {
  electronics: '#4f46e5',
  fashion: '#db2777',
  beauty: '#f59e0b',
  home: '#10b981',
  sports: '#ef4444',
  books: '#8b5cf6',
  toys: '#f97316',
  grocery: '#22c55e',
};

const ratingOptions = [5, 4, 3, 2, 1];

export function CategoryPage() {
  const { slug } = useParams();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const category = categoriesData.find((c) => c.id === slug);

  if (!category) {
    return (
      <div className="bg-white dark:bg-neutral-900 min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-6xl">🛒</p>
          <h1 className="text-3xl font-display font-bold text-neutral-900 dark:text-neutral-100">
            Category Not Found
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400">
            The category you're looking for doesn't exist.
          </p>
          <Link
            to="/"
            className="inline-block px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const categoryProducts = productsData.filter(
    (p) => p.category.toLowerCase() === category.name.toLowerCase(),
  );

  const accentColor = accentColorMap[category.id] ?? '#4f46e5';

  return (
    <div className="bg-white dark:bg-neutral-900 transition-colors duration-300 min-h-screen relative">
      <BackgroundDecorations />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{category.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Category Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 p-6 rounded-2xl border-2"
          style={{
            borderColor: accentColor,
            backgroundColor: `${accentColor}0D`,
          }}
        >
          <h1
            className="text-3xl lg:text-4xl font-display font-bold mb-2"
            style={{ color: accentColor }}
          >
            {category.name}
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            {categoryProducts.length} product{categoryProducts.length !== 1 ? 's' : ''} in this category
          </p>
        </motion.div>

        {/* Mobile Filter Toggle */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="w-full flex items-center justify-between px-4 py-3 bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 rounded-xl font-semibold text-sm text-neutral-700 dark:text-neutral-300"
          >
            <span className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-indigo-500" />
              Filters
            </span>
            <ChevronDown className={`w-4 h-4 transition-transform ${filtersOpen ? 'rotate-180' : ''}`} />
          </button>
          <AnimatePresence>
            {filtersOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden mt-2"
              >
                <div className="bg-neutral-50 dark:bg-neutral-800/50 p-5 rounded-2xl border border-neutral-200/50 dark:border-neutral-700/50 space-y-6">
                  <div className="space-y-3">
                    <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Price Range</label>
                    <div className="flex gap-2">
                      <input type="number" placeholder="Min" className="w-full px-3 py-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-neutral-800 dark:text-neutral-100" />
                      <span className="text-neutral-400 self-center">—</span>
                      <input type="number" placeholder="Max" className="w-full px-3 py-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-neutral-800 dark:text-neutral-100" />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24 bg-neutral-50 dark:bg-neutral-800/50 p-5 rounded-2xl border border-neutral-200/50 dark:border-neutral-700/50 space-y-6">
              <h2 className="font-semibold text-neutral-900 dark:text-neutral-100 text-base">
                Filters
              </h2>

              {/* Price Range */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  Price Range
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    className="w-full px-3 py-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-neutral-800 dark:text-neutral-100"
                  />
                  <span className="text-neutral-400 self-center">—</span>
                  <input
                    type="number"
                    placeholder="Max"
                    className="w-full px-3 py-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-neutral-800 dark:text-neutral-100"
                  />
                </div>
              </div>

              {/* Rating */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  Rating
                </label>
                <div className="flex flex-col gap-1.5">
                  {ratingOptions.map((stars) => (
                    <label
                      key={stars}
                      className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 cursor-pointer hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors"
                    >
                      <input
                        type="checkbox"
                        className="accent-indigo-600 rounded"
                      />
                      <span className="text-amber-500">
                        {'★'.repeat(stars)}
                        {'☆'.repeat(5 - stars)}
                      </span>
                      <span className="text-xs">& up</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <section className="lg:col-span-3">
            {categoryProducts.length > 0 ? (
              <motion.div
                layout
                className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5"
              >
                {categoryProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="text-center py-16 bg-neutral-50 dark:bg-neutral-800/10 border border-dashed border-neutral-300 dark:border-neutral-800 rounded-2xl">
                <p className="text-neutral-500 dark:text-neutral-400">
                  No products found in {category.name}.
                </p>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
