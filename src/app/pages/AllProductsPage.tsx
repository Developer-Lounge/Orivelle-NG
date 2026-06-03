import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SlidersHorizontal, Search, ArrowUpDown, X, Sparkles, ChevronDown } from 'lucide-react';
import { BackgroundDecorations } from '../components/BackgroundDecorations';
import { ProductCard } from '../components/ProductCard';
import productsData from '../../data/products.json';
import categoriesData from '../../data/categories.json';

export function AllProductsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [maxPrice, setMaxPrice] = useState<number>(300);
  const [sortBy, setSortBy] = useState<string>('default');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const brands = useMemo(() => {
    const allBrands = productsData.map((p) => p.brand);
    return Array.from(new Set(allBrands));
  }, []);

  const absoluteMaxPrice = useMemo(() => {
    let highest = 300;
    productsData.forEach((p) => {
      p.variants.forEach((v) => {
        if (v.price > highest) highest = v.price;
      });
    });
    return Math.ceil(highest);
  }, []);

  const filteredProducts = useMemo(() => {
    return productsData.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        !selectedCategory ||
        product.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchesBrand = !selectedBrand || product.brand === selectedBrand;
      const hasVariantUnderMaxPrice = product.variants.some((v) => v.price <= maxPrice);
      return matchesSearch && matchesCategory && matchesBrand && hasVariantUnderMaxPrice;
    });
  }, [searchQuery, selectedCategory, selectedBrand, maxPrice]);

  const sortedProducts = useMemo(() => {
    const products = [...filteredProducts];
    if (sortBy === 'price-asc') return products.sort((a, b) => a.variants[0].price - b.variants[0].price);
    if (sortBy === 'price-desc') return products.sort((a, b) => b.variants[0].price - a.variants[0].price);
    if (sortBy === 'name-asc') return products.sort((a, b) => a.name.localeCompare(b.name));
    return products;
  }, [filteredProducts, sortBy]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory(null);
    setSelectedBrand(null);
    setMaxPrice(absoluteMaxPrice);
    setSortBy('default');
  };

  const activeFiltersCount =
    (selectedCategory ? 1 : 0) +
    (selectedBrand ? 1 : 0) +
    (searchQuery ? 1 : 0) +
    (maxPrice < absoluteMaxPrice ? 1 : 0);

  const FilterPanel = () => (
    <div className="bg-neutral-50 dark:bg-neutral-800/50 p-5 rounded-2xl border border-neutral-200/50 dark:border-neutral-700/50 backdrop-blur-sm space-y-6">
      <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-700/50 pb-4">
        <h2 className="font-semibold text-base flex items-center gap-2 text-neutral-900 dark:text-neutral-100">
          <SlidersHorizontal className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          Filters
        </h2>
        {activeFiltersCount > 0 && (
          <button onClick={clearFilters} className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 transition-colors">
            Clear All
          </button>
        )}
      </div>

      {/* Search */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Search</label>
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-neutral-800 dark:text-neutral-100"
          />
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Category</label>
        <div className="flex flex-col gap-1">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`text-left px-3 py-2 rounded-lg text-sm transition-all ${!selectedCategory ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-semibold' : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'}`}
          >
            All Categories
          </button>
          {categoriesData.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.name)}
              className={`text-left px-3 py-2 rounded-lg text-sm transition-all ${selectedCategory?.toLowerCase() === cat.name.toLowerCase() ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-semibold' : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'}`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Brands */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Brand</label>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setSelectedBrand(null)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${!selectedBrand ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400'}`}
          >
            All
          </button>
          {brands.map((brand) => (
            <button
              key={brand}
              onClick={() => setSelectedBrand(brand)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${selectedBrand === brand ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400'}`}
            >
              {brand}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Max Price</label>
          <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">${maxPrice}</span>
        </div>
        <input
          type="range"
          min="0"
          max={absoluteMaxPrice}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-indigo-600 h-1.5 bg-neutral-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-neutral-400">
          <span>$0</span>
          <span>${absoluteMaxPrice}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white dark:bg-neutral-900 transition-colors duration-300 min-h-screen relative pb-16">
      <BackgroundDecorations />

      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-950 via-slate-900 to-neutral-950 text-white py-12 md:py-16 px-4">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent" />
        <div className="max-w-7xl mx-auto text-center relative z-10 space-y-3">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-semibold backdrop-blur-md border border-white/10"
          >
            <Sparkles className="w-3 h-3 text-indigo-400 animate-pulse" />
            Discover The Collection
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-display font-bold tracking-tight"
          >
            All Products
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-neutral-300 max-w-xl mx-auto text-sm"
          >
            Explore our curated catalog of high-performance gear, premium fashion, and advanced electronics.
          </motion.p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 relative z-10">

        {/* Mobile Filter Toggle Button */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="w-full flex items-center justify-between px-4 py-3 bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 rounded-xl font-semibold text-sm text-neutral-700 dark:text-neutral-300"
          >
            <span className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-indigo-500" />
              Filters {activeFiltersCount > 0 && <span className="bg-indigo-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{activeFiltersCount}</span>}
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
                <FilterPanel />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="grid lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Desktop Sidebar Filters */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24">
              <FilterPanel />
            </div>
          </div>

          {/* Products Column */}
          <div className="lg:col-span-3 space-y-5">
            {/* Sort Bar */}
            <div className="flex flex-col xs:flex-row gap-3 items-start xs:items-center justify-between bg-neutral-50 dark:bg-neutral-800/30 p-3 sm:p-4 rounded-xl border border-neutral-200/50 dark:border-neutral-700/50">
              <p className="text-sm text-neutral-600 dark:text-neutral-400 font-medium">
                <span className="font-semibold text-neutral-900 dark:text-neutral-100">{sortedProducts.length}</span> products
              </p>
              <div className="relative w-full xs:w-auto">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full pl-9 pr-8 py-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm text-neutral-700 dark:text-neutral-300 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
                >
                  <option value="default">Featured</option>
                  <option value="price-asc">Price: Low → High</option>
                  <option value="price-desc">Price: High → Low</option>
                  <option value="name-asc">Name: A → Z</option>
                </select>
                <ArrowUpDown className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Active Filter Badges */}
            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-neutral-500 font-medium">Active:</span>
                {searchQuery && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-semibold border border-indigo-100 dark:border-indigo-900/50">
                    "{searchQuery}" <button onClick={() => setSearchQuery('')}><X className="w-3 h-3" /></button>
                  </span>
                )}
                {selectedCategory && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-semibold border border-indigo-100 dark:border-indigo-900/50">
                    {selectedCategory} <button onClick={() => setSelectedCategory(null)}><X className="w-3 h-3" /></button>
                  </span>
                )}
                {selectedBrand && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-semibold border border-indigo-100 dark:border-indigo-900/50">
                    {selectedBrand} <button onClick={() => setSelectedBrand(null)}><X className="w-3 h-3" /></button>
                  </span>
                )}
                {maxPrice < absoluteMaxPrice && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-semibold border border-indigo-100 dark:border-indigo-900/50">
                    ≤${maxPrice} <button onClick={() => setMaxPrice(absoluteMaxPrice)}><X className="w-3 h-3" /></button>
                  </span>
                )}
              </div>
            )}

            {/* Grid */}
            <motion.div layout className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
              <AnimatePresence mode="popLayout">
                {sortedProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.92 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {sortedProducts.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12 bg-neutral-50 dark:bg-neutral-800/10 border border-dashed border-neutral-300 dark:border-neutral-800 rounded-2xl"
              >
                <div className="w-14 h-14 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4 text-neutral-400">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">No Products Found</h3>
                <p className="text-neutral-500 dark:text-neutral-400 mt-1 max-w-xs mx-auto text-sm px-4">
                  Try adjusting your filters or search terms.
                </p>
                <button
                  onClick={clearFilters}
                  className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition-all"
                >
                  Reset Filters
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
