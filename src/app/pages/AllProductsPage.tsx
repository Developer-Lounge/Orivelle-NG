import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SlidersHorizontal, Search, ArrowUpDown, X, Grid, List, Sparkles } from 'lucide-react';
import { BackgroundDecorations } from '../components/BackgroundDecorations';
import { ProductCard } from '../components/ProductCard';
import productsData from '../../data/products.json';
import categoriesData from '../../data/categories.json';
import { Product } from '../../types/product';

export function AllProductsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [maxPrice, setMaxPrice] = useState<number>(300);
  const [sortBy, setSortBy] = useState<string>('default');

  // Extract unique brands dynamically from productsData
  const brands = useMemo(() => {
    const allBrands = productsData.map((p) => p.brand);
    return Array.from(new Set(allBrands));
  }, []);

  // Find max price in the data to set bounds dynamically
  const absoluteMaxPrice = useMemo(() => {
    let highest = 300;
    productsData.forEach((p) => {
      p.variants.forEach((v) => {
        if (v.price > highest) highest = v.price;
      });
    });
    return Math.ceil(highest);
  }, []);

  // Filter products based on search, category, brand, and max price
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

      // Check if any variant is under the max price
      const hasVariantUnderMaxPrice = product.variants.some(
        (v) => v.price <= maxPrice
      );

      return matchesSearch && matchesCategory && matchesBrand && hasVariantUnderMaxPrice;
    });
  }, [searchQuery, selectedCategory, selectedBrand, maxPrice]);

  // Sort products
  const sortedProducts = useMemo(() => {
    const products = [...filteredProducts];
    if (sortBy === 'price-asc') {
      return products.sort((a, b) => a.variants[0].price - b.variants[0].price);
    }
    if (sortBy === 'price-desc') {
      return products.sort((a, b) => b.variants[0].price - a.variants[0].price);
    }
    if (sortBy === 'name-asc') {
      return products.sort((a, b) => a.name.localeCompare(b.name));
    }
    return products; // Default / Featured
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

  return (
    <div className="bg-white dark:bg-neutral-900 transition-colors duration-300 min-h-screen relative pb-16">
      <BackgroundDecorations />

      {/* Hero Banner Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-950 via-slate-900 to-neutral-950 text-white py-16 px-4">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent" />
        <div className="max-w-7xl mx-auto text-center relative z-10 space-y-4">
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
            className="text-4xl md:text-5xl font-display font-bold tracking-tight"
          >
            All Products
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-neutral-300 max-w-2xl mx-auto text-sm md:text-base"
          >
            Explore our curated catalog of high-performance gear, premium fashion, and advanced electronics designed to elevate your everyday routine.
          </motion.p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-neutral-50 dark:bg-neutral-800/50 p-6 rounded-2xl border border-neutral-200/50 dark:border-neutral-700/50 backdrop-blur-sm sticky top-24 space-y-6">
              <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-700/50 pb-4">
                <h2 className="font-semibold text-lg flex items-center gap-2 text-neutral-900 dark:text-neutral-100">
                  <SlidersHorizontal className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  Filters
                </h2>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* Search */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  Search
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-400/20 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all text-neutral-800 dark:text-neutral-100"
                  />
                  <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-3.5" />
                </div>
              </div>

              {/* Categories */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  Category
                </label>
                <div className="flex flex-col gap-1.5">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`text-left px-3 py-2 rounded-lg text-sm transition-all ${
                      !selectedCategory
                        ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-semibold'
                        : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                    }`}
                  >
                    All Categories
                  </button>
                  {categoriesData.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.name)}
                      className={`text-left px-3 py-2 rounded-lg text-sm transition-all ${
                        selectedCategory?.toLowerCase() === cat.name.toLowerCase()
                          ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-semibold'
                          : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Brands */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  Brand
                </label>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => setSelectedBrand(null)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                      !selectedBrand
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-500/20'
                        : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:border-neutral-300'
                    }`}
                  >
                    All Brands
                  </button>
                  {brands.map((brand) => (
                    <button
                      key={brand}
                      onClick={() => setSelectedBrand(brand)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                        selectedBrand === brand
                          ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-500/20'
                          : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:border-neutral-300'
                      }`}
                    >
                      {brand}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    Max Price
                  </label>
                  <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                    ${maxPrice}
                  </span>
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
          </div>

          {/* Products Column */}
          <div className="lg:col-span-3 space-y-6">
            {/* Sorting and Grid controls */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-neutral-50 dark:bg-neutral-800/30 p-4 rounded-xl border border-neutral-200/50 dark:border-neutral-700/50 backdrop-blur-sm">
              <p className="text-sm text-neutral-600 dark:text-neutral-400 font-medium">
                Showing <span className="font-semibold text-neutral-900 dark:text-neutral-100">{sortedProducts.length}</span> products
              </p>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-initial">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full pl-9 pr-8 py-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm text-neutral-700 dark:text-neutral-300 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="default">Sort by: Featured</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="name-asc">Name: A to Z</option>
                  </select>
                  <ArrowUpDown className="w-4 h-4 text-neutral-400 absolute left-3 top-3 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Active Filters Summary */}
            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium mr-1">
                  Active Filters:
                </span>
                {searchQuery && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-semibold border border-indigo-100 dark:border-indigo-900/50">
                    Search: "{searchQuery}"
                    <button onClick={() => setSearchQuery('')} className="hover:text-red-500">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {selectedCategory && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-semibold border border-indigo-100 dark:border-indigo-900/50">
                    Category: {selectedCategory}
                    <button onClick={() => setSelectedCategory(null)} className="hover:text-red-500">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {selectedBrand && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-semibold border border-indigo-100 dark:border-indigo-900/50">
                    Brand: {selectedBrand}
                    <button onClick={() => setSelectedBrand(null)} className="hover:text-red-500">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {maxPrice < absoluteMaxPrice && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-semibold border border-indigo-100 dark:border-indigo-900/50">
                    Max Price: ${maxPrice}
                    <button onClick={() => setMaxPrice(absoluteMaxPrice)} className="hover:text-red-500">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>
            )}

            {/* Grid */}
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                className="text-center py-16 bg-neutral-50 dark:bg-neutral-800/10 border border-dashed border-neutral-300 dark:border-neutral-800 rounded-2xl"
              >
                <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4 text-neutral-400">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                  No Products Found
                </h3>
                <p className="text-neutral-500 dark:text-neutral-400 mt-1 max-w-sm mx-auto text-sm">
                  We couldn't find any products matching your search or filters. Try adjusting your parameters.
                </p>
                <button
                  onClick={clearFilters}
                  className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition-all shadow-md shadow-indigo-500/20"
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
